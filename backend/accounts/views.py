import random
from django.core.cache import cache
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer
from .permissions import IsAdminUser # Ensure this matches your filename
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import permissions # Added this because you use it in UserProfileView

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# --- MOBILE OTP AUTHENTICATION (REGULAR USERS) ---

class CheckUserView(APIView):
    """Step 1: Check mobile. If exists, login OTP. Else, prompt registration."""
    
    # CORRECT: Placed at the class level
    permission_classes = [AllowAny] 

    def post(self, request):
        mobile = request.data.get('mobile_number')
        if not mobile:
            return Response({"error": "Mobile number is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(mobile_number=mobile).first()
        
        if user:
            # Generate OTP ONLY if the user exists
            otp = str(random.randint(100000, 999999))
            
            # SECURE: Use mobile as the cache key, store OTP inside the dictionary
            cache.set(f"login_{mobile}", {"user_id": user.id, "otp": otp}, timeout=600)
            print(f"--- LOGIN OTP: {otp} ---")
            
            return Response({"status": "exists", "message": "OTP sent for login."}, status=status.HTTP_200_OK)
        
        # USER DOES NOT EXIST -> REGISTRATION FLOW
        return Response({"status": "new_user", "message": "Mobile not found. Please register."}, status=status.HTTP_200_OK)


class RegisterRequestView(APIView):
    """Step 2: Save registration details to CACHE only."""
    
    # CORRECT: Placed at the class level
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            mobile = user_data.get('mobile_number') # Get the mobile number
            
            otp = str(random.randint(100000, 999999))
            user_data['otp'] = otp # Add the OTP to the dictionary
            
            # SECURE: Use mobile as the cache key
            cache.set(f"reg_{mobile}", user_data, timeout=600)
            print(f"--- REGISTRATION OTP: {otp} ---")
            
            return Response({"message": "OTP sent. Verify to create account."}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """Step 3: Finalize Login or Account Creation."""
    
    # CORRECT: Placed at the class level
    permission_classes = [AllowAny]

    def post(self, request):
        mobile = request.data.get('mobile_number')
        otp = request.data.get('otp')
        
        if not mobile or not otp:
            return Response({"error": "Mobile number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Handle Login
        # Look up the cache using the mobile number
        login_data = cache.get(f"login_{mobile}")
        
        # Check if cache exists AND if the OTP matches
        if login_data and login_data.get('otp') == otp:
            user = User.objects.get(id=login_data['user_id'])
            cache.delete(f"login_{mobile}") # Clear cache after success
            
            tokens = get_tokens_for_user(user)
            return Response({
                "message": "Login Successful", 
                "access": tokens.get('access'),
                "refresh": tokens.get('refresh'),
                "name": user.name
            })

        # 2. Handle Registration
        # Look up the cache using the mobile number
        reg_data = cache.get(f"reg_{mobile}")
        
        # Check if cache exists AND if the OTP matches
        if reg_data and reg_data.get('otp') == otp:
            user = User.objects.create_user(
                email=reg_data['email'],
                name=reg_data['name'],
                mobile_number=reg_data['mobile_number'],
                role='user' 
            )
            cache.delete(f"reg_{mobile}") # Clear cache after success
            
            tokens = get_tokens_for_user(user)
            return Response({
                "message": "Account Created!", 
                "access": tokens.get('access'),
                "refresh": tokens.get('refresh'),
                "name": user.name
            }, status=status.HTTP_201_CREATED)

        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

# --- PASSWORD AUTHENTICATION (ADMIN & STAFF) ---

class AdminStaffLoginView(APIView):
    """Direct Login for Admin/Staff using Email and Password."""
    
    # CORRECT: Placed at the class level
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Credentials required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)

        if user is not None and user.role in ['admin', 'staff']:
            return Response({
                "message": f"{user.role.capitalize()} Login Successful",
                "role": user.role,
                "tokens": get_tokens_for_user(user)
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Unauthorized or invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# --- ADMIN ACTIONS ---

class CreateStaffView(APIView):
    """Admin-only view to create Staff accounts with passwords."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Staff get passwords and is_staff=True
        user = User.objects.create_user(
            email=email,
            name=request.data.get('name'),
            mobile_number=request.data.get('mobile_number'),
            role='staff', 
            password=password,
            is_staff=True 
        )

        return Response({"message": f"Staff {email} created successfully"}, status=status.HTTP_201_CREATED)
    

class UserProfileView(APIView):
    """
    Endpoint for users to view and update their own name and email.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """View their own profile."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Edit their own profile."""
        # partial=True allows submitting just the name or just the email without failing
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        """
        Delete their own profile (Optional).
        Uncomment if you want users to be able to delete their accounts entirely.
        """
        # user = request.user
        # user.delete()
        # return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)