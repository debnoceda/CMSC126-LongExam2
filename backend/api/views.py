from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, CategorySerializer, WalletSerializer, TransactionSerializer
from .models import Category, Wallet, Transaction

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