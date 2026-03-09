from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name=None, mobile_number=None, role='user', password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email, 
            name=name, 
            mobile_number=mobile_number, 
            role=role,
            **extra_fields
        )

        if password:
            # Set real password for Admin and Staff
            user.set_password(password)
        else:
            # Regular Users remain passwordless (OTP only)
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if password is None:
            raise ValueError('Superuser must have a password.')

        # Superusers are automatically assigned the 'admin' role
        return self.create_user(
            email=email, 
            name="Head Admin", 
            mobile_number=None, # Superusers don't need a mobile number
            role='admin', 
            password=password, 
            **extra_fields
        )

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('user', 'User'),
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    # Unique=True but allows Null so Admins don't need one
    mobile_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Automatically True for Admin/Staff

    groups = models.ManyToManyField('auth.Group', related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name="customuser_permissions", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 

    def __str__(self):
        return f"{self.email} ({self.role})"

    # Helper properties for easy role checking in views
    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_staff_member(self):
        return self.role == 'staff'
    
