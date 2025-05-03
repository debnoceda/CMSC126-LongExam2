from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Wallet, Transaction, UserProfile

class UserSerializer(serializers.ModelSerializer):
    monthly_budget = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    profile_picture = serializers.ImageField(source='profile.profile_picture', allow_null=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'monthly_budget', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        monthly_budget = validated_data.pop('monthly_budget', 0.00)
        profile_picture = validated_data.pop('profile_picture', None)

        email = validated_data.pop('email')
        password = validated_data.pop('password')

        if profile_picture is None:
            profile_picture = 'default/Progil.png'  # Set your default path here

        # Create the User object without the monthly_budget field
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            **validated_data  # This will pass other fields like first_name, last_name, etc.
        )

        # Create the UserProfile object and associate it with the user
        UserProfile.objects.create(
            user=user,
            monthly_budget=monthly_budget,
            profile_picture=profile_picture
        )

        return user

    def to_representation(self, instance):
        request = self.context.get('request')  # Get request from context
        ret = super().to_representation(instance)

        # Get the full URL of the profile picture
        if instance.profile.profile_picture:
            profile_picture_url = instance.profile.profile_picture.url
            if request is not None:
                profile_picture_url = request.build_absolute_uri(profile_picture_url)
            ret['profile_picture'] = profile_picture_url
        else:
            ret['profile_picture'] = None

        # Add monthly budget
        ret['monthly_budget'] = instance.profile.monthly_budget
        return ret

    def update(self, instance, validated_data):
        monthly_budget = validated_data.get('monthly_budget', None)
        profile_picture = validated_data.get('profile_picture', None)

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

        # Ensure UserProfile exists
        profile, created = UserProfile.objects.get_or_create(user=instance)

        if monthly_budget is not None:
            profile.monthly_budget = monthly_budget

        if profile_picture is not None:
            profile.profile_picture = profile_picture

        profile.save()

        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'name', 'balance', 'user', 'color']
        read_only_fields = ['user']

    def create(self, validated_data):
        return Wallet.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.balance = validated_data.get('balance', instance.balance)
        instance.color= validated_data.get('color', instance.balance)
        instance.save()
        return instance


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True, allow_null=True)
    wallet = WalletSerializer(read_only=True)
    wallet_id = serializers.PrimaryKeyRelatedField(queryset=Wallet.objects.all(), source='wallet', write_only=True)

    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'transaction_type', 'date', 'notes', 'wallet', 'wallet_id', 'category', 'category_id', 'category_name']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value
    
    def validate_date(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("Date cannot be in the future.")
        return value
    
    def create(self, validated_data):
        category = validated_data.pop('category')
        wallet = validated_data.pop('wallet')
        transaction = Transaction.objects.create(category=category, wallet=wallet, **validated_data)
        return transaction
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.transaction_type = validated_data.get('transaction_type', instance.transaction_type)
        instance.date = validated_data.get('date', instance.date)
        instance.notes = validated_data.get('notes', instance.notes)
        
        category = validated_data.get('category')
        if category:
            instance.category = category
        
        wallet = validated_data.get('wallet')
        if wallet:
            instance.wallet = wallet
        
        instance.save()
        return instance
    
