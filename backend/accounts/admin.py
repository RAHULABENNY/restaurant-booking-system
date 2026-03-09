from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    # This displays these columns in the list view
    list_display = ('email', 'name', 'mobile_number', 'role', 'is_staff')
    
    # This allows you to filter by role
    list_filter = ('role', 'is_staff', 'is_superuser')
    
    # This allows you to edit the role directly from the detail page
    fields = ('email', 'name', 'mobile_number', 'role', 'is_staff', 'is_superuser', 'is_active')