from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order, OrderItem, Address
from cart.models import Cart
from .serializers import OrderSerializer, AddressSerializer

# ==========================================
# 1. ADDRESS VIEW (Add & View Locations)
# ==========================================
class AddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 2. PLACE ORDER VIEW (Checkout)
# ==========================================
class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # 1. Address Validation
        address_id = request.data.get('address_id')
        user_address = Address.objects.filter(user=user, id=address_id).first() if address_id else Address.objects.filter(user=user).first()

        if not user_address:
            return Response({"message": "Please add an address first."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Cart Validation
        try:
            cart = Cart.objects.get(user=user)
            items = cart.items.all()
            if not items.exists():
                return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        # 3. Create the Order
        total_price = sum(item.item_total for item in items)
        
        # Format the selected address into a single text string
        full_address = f"{user_address.full_name}, {user_address.house_no}, {user_address.city} - {user_address.pincode}. Ph: {user_address.phone_number}"

        order = Order.objects.create(
            user=user, 
            total_price=total_price,
            shipping_address=full_address # Saves the address permanently to the order
        )

        # 4. Move Cart Items to Order Items
        for item in items:
            OrderItem.objects.create(
                order=order, 
                product=item.product, 
                quantity=item.quantity, 
                price_at_order=item.product.mrp
            )
        
        # 5. Clear the Cart
        items.delete()
        
        return Response({
            "message": "Order placed successfully!", 
            "order_id": order.id, 
            "delivery_to": full_address,
            "total": total_price
        }, status=status.HTTP_201_CREATED)


# ==========================================
# 3. ORDER HISTORY VIEW (List all past orders)
# ==========================================
class OrderHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch all orders belonging to this user, newest first
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ==========================================
# 4. ORDER DETAIL VIEW (View one specific order)
# ==========================================
class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            # Ensure the order belongs to the user requesting it
            order = Order.objects.get(id=order_id, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        



    


# ==========================================
# 5. ADMIN: VIEW ALL ORDERS
# ==========================================
class AdminOrderListView(APIView):
    # CRITICAL: Only staff/superusers can access this
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """View EVERY order placed by EVERY user"""
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ==========================================
# 6. ADMIN: ORDER DETAILS & ACTION (Update Status)
# ==========================================
class AdminOrderDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, order_id):
        """View full details of any specific order"""
        try:
            # We do NOT filter by user here because the admin needs to see everyone's orders
            order = Order.objects.get(id=order_id)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, order_id):
        """ACTION: Update the order status (e.g., Pending -> Shipped)"""
        try:
            order = Order.objects.get(id=order_id)
            new_status = request.data.get('status')
            
            # Check if the provided status is valid based on your model choices
            valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
            if new_status not in valid_statuses:
                return Response({
                    "error": f"Invalid status. Choose from: {valid_statuses}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update and save the new status
            order.status = new_status
            order.save()
            
            return Response({
                "message": f"Order #{order.id} status updated successfully!",
                "current_status": order.status
            }, status=status.HTTP_200_OK)
            
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        




from .models import Banner
from .serializers import BannerSerializer

# ==========================================
# 1. PUBLIC VIEW (For Users/Frontend App)
# ==========================================
class BannerListView(APIView):
    # Allow anyone to see the banners (or change to IsAuthenticated if needed)
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Only show banners that the admin has set to 'is_active=True'
        banners = Banner.objects.filter(is_active=True).order_by('-created_at')
        
        # Passing 'context={"request": request}' is crucial! 
        # It ensures the image URL comes back as a full absolute URL (http://127.0.0.1:8000/media/...)
        serializer = BannerSerializer(banners, many=True, context={'request': request})
        return Response(serializer.data)


# ==========================================
# 2. ADMIN VIEW (For Staff to Manage Banners)
# ==========================================
class AdminBannerManageView(APIView):
    # CRITICAL: Only users with 'is_staff=True' can access this
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        """ADMIN: Add a new banner"""
        serializer = BannerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, banner_id):
        """ADMIN: Edit an existing banner (update text, image, or is_active)"""
        try:
            banner = Banner.objects.get(id=banner_id)
            # partial=True allows us to update only specific fields without requiring all of them
            serializer = BannerSerializer(banner, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Banner updated successfully", 
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Banner.DoesNotExist:
            return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, banner_id):
        """ADMIN: Delete a banner completely"""
        try:
            banner = Banner.objects.get(id=banner_id)
            banner.delete()
            return Response({"message": "Banner deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Banner.DoesNotExist:
            return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)