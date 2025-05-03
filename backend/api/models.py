from django.db import models
from django.contrib.auth.models import User
import os

def user_profile_picture_path(instance, filename):
    return f'profile_pictures/user_{instance.user.id}/{filename}'

def get_default_profile_picture():
    return 'default/Progil.png'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    profile_picture = models.ImageField(
        upload_to=user_profile_picture_path,
        default=get_default_profile_picture,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.user.email}'s profile"

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Wallet(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link wallets to users
    color = models.CharField(max_length=7, default="#84AE26")

    @property
    def balance(self):
        income = self.transaction_set.filter(transaction_type='income').aggregate(models.Sum('amount'))['amount__sum'] or 0
        expense = self.transaction_set.filter(transaction_type='expense').aggregate(models.Sum('amount'))['amount__sum'] or 0
        return income - expense

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )

    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link transactions to users

    def __str__(self):
        return f"{self.title} ({self.transaction_type}) - {self.amount}"
