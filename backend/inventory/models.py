from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='categories/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
import os
from django.db.models.signals import post_delete
from django.dispatch import receiver

@receiver(post_delete, sender=Category)
def delete_category_image(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)






class MenuSection(models.Model):
    """Model to let Admin/Staff add sections like 'Today Special', 'Combo Menu'"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    DIETARY_CHOICES = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
    ]

    # Linked to Category and MenuSection models
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    menu_section = models.ForeignKey(MenuSection, on_delete=models.SET_NULL, null=True, related_name='products')
    
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='products/')
    short_description = models.TextField(blank=True, null=True)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    dietary_type = models.CharField(max_length=20, choices=DIETARY_CHOICES, default='Veg')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name