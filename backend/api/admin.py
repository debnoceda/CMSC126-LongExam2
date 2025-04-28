from django.contrib import admin
from .models import Category, Wallet, Transaction, UserProfile

# Register your models with the Django admin interface
admin.site.register(Category)
admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(UserProfile)