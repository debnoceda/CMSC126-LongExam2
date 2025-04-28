from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Wallet, Transaction, UserProfile

class UserSerializer(serializers.ModelSerializer):
    monthly_budget = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'monthly_budget']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        monthly_budget = validated_data.pop('monthly_budget', 0.00)
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            **validated_data
        )
        UserProfile.objects.create(user=user, monthly_budget=monthly_budget)
        return user

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['monthly_budget'] = instance.profile.monthly_budget
        return ret
    
    def update(self, instance, validated_data):
        
        monthly_budget = validated_data.pop('monthly_budget', None)
        password = validated_data.pop('password', None)
        email = validated_data.pop('email', None)
        if email:
            instance.username = email
            instance.email = email
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()

        if monthly_budget is not None:
            instance.profile.monthly_budget = monthly_budget
            instance.profile.save()

        return instance

    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'name', 'balance', 'user']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        wallet = Wallet.objects.create(user=user, **validated_data)
        return wallet
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.balance = validated_data.get('balance', instance.balance)
        instance.save()
        return instance


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    wallet = WalletSerializer(read_only=True)
    wallet_id = serializers.PrimaryKeyRelatedField(queryset=Wallet.objects.all(), source='wallet', write_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'transaction_type', 'date', 'notes', 'wallet', 'wallet_id', 'category', 'category_id']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
    
    def validate_date(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value