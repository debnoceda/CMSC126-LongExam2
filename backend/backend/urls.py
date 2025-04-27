from django.contrib import admin
from django.urls import path, include
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from api.serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import UserViewSet

# Define RegisterView since it was missing
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
]
