from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'wallets', views.WalletViewSet, basename='wallet')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('api/income-vs-expenses/', views.TransactionViewSet.as_view({'get': 'get_income_vs_expenses'}), name='income-vs-expenses'),
]