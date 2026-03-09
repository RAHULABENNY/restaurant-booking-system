from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    # We explicitly define these as required for the OTP registration flow
    name = serializers.CharField(required=True, error_messages={"required": "Please provide your name."})
    mobile_number = serializers.CharField(required=True, error_messages={"required": "Mobile number is mandatory for registration."})

    class Meta:
        model = User
        fields = ['email', 'name', 'mobile_number']

    def validate_mobile_number(self, value):
        """
        Check if the mobile number is already registered.
        """
        if User.objects.filter(mobile_number=value).exists():
            raise serializers.ValidationError("This mobile number is already linked to an account.")
        return value

    def validate_email(self, value):
        """
        Check if the email is already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already registered.")
        return value
    


from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email']


