from django.urls import path
from .views import (
    CategoryCreateView, 
    CategoryDetailView, 
    CategoryListView,
    MenuSectionListView,
    MenuSectionManageView,
    MenuSectionDetailManageView,
    ProductListView, 
    ProductCreateView, 
    ProductDetailManageView, 
)

urlpatterns = [
    # --- Category URLs ---
    path('api/categories/add/', CategoryCreateView.as_view(), name='add_category'),
    path('api/categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),
    path('api/categories/', CategoryListView.as_view(), name='category_list'),
    
    # --- Menu Section URLs ---
    path('api/menu-sections/', MenuSectionListView.as_view(), name='menu_section_list'), # GET All (Public)
    
    # POST only (No ID needed)
    path('api/menu-sections/manage/', MenuSectionManageView.as_view(), name='add_menu_section'), 
    
    # PUT, DELETE, and GET One (Requires ID)
    path('api/menu-sections/manage/<int:pk>/', MenuSectionDetailManageView.as_view(), name='manage_single_menu_section'), 
    path('api/products/', ProductListView.as_view(), name='product_list'), 
    
    # POST: Add a new product (No ID in URL)
    path('api/products/add/', ProductCreateView.as_view(), name='add_product'), 
    
    # GET, PUT, DELETE: Manage a specific product (Requires ID in URL)
    path('api/products/manage/<int:pk>/', ProductDetailManageView.as_view(), name='manage_product'),
]