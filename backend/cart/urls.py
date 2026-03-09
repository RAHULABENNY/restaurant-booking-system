from django.urls import path
from .views import CartView

urlpatterns = [
    # View, add, update, and remove cart items
    path('api/cart/', CartView.as_view(), name='cart_view'),
]