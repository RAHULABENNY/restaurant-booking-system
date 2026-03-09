from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer
from inventory.models import Product

class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_cart(self, request):
        """Helper to find or create a cart for users or guests"""
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            return cart
        else:
            # For Guests: Ensure a session exists
            if not request.session.session_key:
                request.session.create()
            session_key = request.session.session_key
            # Identify guest cart by session_key
            cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
            return cart

    def get(self, request):
        # FIX: Pass 'request', NOT 'request.user'
        cart = self.get_cart(request) 
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        """ADD: Anyone can add to cart"""
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        cart = self.get_cart(request)
        
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()
        
        return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)

    def put(self, request):
        """EDIT: Update quantity"""
        cart = self.get_cart(request)
        item_id = request.data.get('cart_item_id')
        new_qty = request.data.get('quantity')

        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.quantity = int(new_qty)
            item.save()
            return Response({"message": "Quantity updated"})
        except (CartItem.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid item or quantity"}, status=400)

    def delete(self, request):
        """DELETE: Remove item or clear cart"""
        cart = self.get_cart(request)
        item_id = request.data.get('cart_item_id')

        if item_id:
            CartItem.objects.filter(id=item_id, cart=cart).delete()
            return Response({"message": "Item removed"})
        else:
            CartItem.objects.filter(cart=cart).delete()
            return Response({"message": "Cart cleared"}, status=204)