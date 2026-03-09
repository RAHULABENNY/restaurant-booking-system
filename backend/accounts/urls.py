from django.urls import path
from .views import CheckUserView, RegisterRequestView, VerifyOTPView,CreateStaffView,AdminStaffLoginView,UserProfileView

urlpatterns = [
    path('api/check-user/', CheckUserView.as_view(), name='check_user'),
    path('api/register/', RegisterRequestView.as_view(), name='register'),
    path('api/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('api/admin-login/', AdminStaffLoginView.as_view(), name='admin_login'),
    path('api/admin/create-staff/', CreateStaffView.as_view(), name='create_staff'),
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),
]