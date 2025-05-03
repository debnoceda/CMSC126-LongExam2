from django.shortcuts import render
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, CategorySerializer, WalletSerializer, TransactionSerializer
from .models import Category, Wallet, Transaction
from datetime import date
from django.db.models import Sum
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.balance < 0:
            raise serializer.ValidationError("Wallet balance cannot be negative.")
        instance.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise serializers.ValidationError("You do not have permission to delete this wallet.")
        instance.delete()


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)

        #Update wallet balance based on transaction type
        if instance.transaction_type == 'income':
            instance.wallet.balance += instance.amount
        else:
            if instance.wallet.balance < instance.amount:
                raise serializer.ValidationError("Insufficient funds in the wallet.")
            instance.wallet.balance -= instance.amount
        
        instance.wallet.save()

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.transaction_type == 'expense' and instance.wallet.balance < instance.amount:
            raise serializer.ValidationError("Insufficient funds in the wallet.")
        if instance.transaction_type == 'income':
            instance.wallet.balance += instance.amount
        else:
            instance.wallet.balance -= instance.amount
        instance.wallet.save()
        instance.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise serializers.ValidationError("You do not have permission to delete this transaction.")
        if instance.transaction_type == 'income':
            instance.wallet.balance -= instance.amount
        else:
            instance.wallet.balance += instance.amount
        instance.wallet.save()
        instance.delete()

    @action(detail=False, methods=['get'], url_path='income_vs_expenses')
    def income_vs_expenses(self, request):
        current_year = date.today().year

        transactions = Transaction.objects.filter(date__year=current_year)

        income_data = transactions.filter(transaction_type='income') \
            .values('date__month') \
            .annotate(total_income=Sum('amount')) \
            .order_by('date__month')

        expense_data = transactions.filter(transaction_type='expense') \
            .values('date__month') \
            .annotate(total_expense=Sum('amount')) \
            .order_by('date__month')

        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        income_values = [0] * 12
        expense_values = [0] * 12

        for entry in income_data:
            income_values[entry['date__month'] - 1] = entry['total_income']

        for entry in expense_data:
            expense_values[entry['date__month'] - 1] = entry['total_expense']

        chart_data = {
            'months': months,
            'income': income_values,
            'expenses': expense_values
        }

        return JsonResponse(chart_data)

    @action(detail=False, methods=['get'], url_path='total_balance')
    def total_balance(self, request):
        # Filter transactions for the authenticated user
        transactions = Transaction.objects.filter(user=request.user)

        # Calculate total income and total expenses
        total_income = transactions.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = transactions.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0

        # Calculate total balance
        total_balance = total_income - total_expense

        # Return the result as a JSON response
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'total_balance': total_balance
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return User.objects.none()
        return User.objects.filter(id=self.request.user.id)

    def perform_update(self, serializer):
        if serializer.instance.id != self.request.user.id:
            raise serializers.ValidationError("You can only update your own profile.")
        serializer.save()

    @action(detail=True, methods=['PUT'], parser_classes=[MultiPartParser, FormParser])
    def update_profile_picture(self, request, pk=None):
        user = self.get_object()

        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No image provided'}, status=400)
        
        profile = getattr(user, 'profile', None)
        if not profile:
            return Response({'error': 'User profile not found'}, status=404)
        
        profile.profile_picture = request.FILES['profile_picture']
        profile.save()

        serializer = self.get_serializer(user)
        return Response(serializer.data)
