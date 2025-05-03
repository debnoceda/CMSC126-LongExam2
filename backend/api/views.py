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

    def get_income_vs_expenses(request):
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

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return User.objects.none()
        return User.objects.filter(id=self.request.user.id)
    
    def perform_update(self, serializer):
        # Ensure users can only update their own profile
        if serializer.instance.id != self.request.user.id:
            raise serializer.ValidationError("You can only update your own profile.")
        serializer.save()