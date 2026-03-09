from django.urls import path
from .views import PlaceOrderView, OrderHistoryView, AddressView,OrderDetailView,AdminOrderDetailView,AdminOrderListView,BannerListView,AdminBannerManageView

urlpatterns = [
    # To save a new delivery address
    path('api/address/', AddressView.as_view(), name='add_address'),
    
    # To process the checkout (Checks for Login + Address)
    path('api/place-order/', PlaceOrderView.as_view(), name='place_order'),
    
    # To view past orders (User Side)
    path('api/my-orders/', OrderHistoryView.as_view(), name='order_history'),

    # URL for a specific order detail
    path('api/my-orders/<int:order_id>/', OrderDetailView.as_view(), name='order_detail'),

    # --- ADMIN URLs ---
    # GET: List all system orders
    path('api/admin/orders/', AdminOrderListView.as_view(), name='admin_order_list'),
    
    # GET: View specific order | PATCH: Update order status
    path('api/admin/orders/<int:order_id>/', AdminOrderDetailView.as_view(), name='admin_order_action'),


    # For the frontend to fetch and display banners
    path('api/banners/', BannerListView.as_view(), name='banner_list'),
    
    # For the admin panel to add banners (POST)
    path('api/admin/banners/', AdminBannerManageView.as_view(), name='admin_banner_add'),
    
    # For the admin panel to delete banners (DELETE)
    path('api/admin/banners/<int:banner_id>/', AdminBannerManageView.as_view(), name='admin_banner_delete'),
]

