from rest_framework.views import APIView  # <--- THIS WAS MISSING
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Category
from .serializers import CategorySerializer

class CategoryCreateView(APIView):
    """
    View for Admin and Staff to add a new category.
    """
    # Allow both Admin and Staff to access this
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Role check: only 'admin' or 'staff' can create categories
        if request.user.role not in ['admin', 'staff']:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Category
from .serializers import CategorySerializer

class CategoryDetailView(APIView):
    """
    View to Retrieve, Update, or Delete a specific category.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_role_check(self, user):
        return user.role in ['admin', 'staff']

    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        """Edit/Update Category"""
        if not self.get_role_check(request.user):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        category = get_object_or_404(Category, pk=pk)
        # partial=True allows you to update just the name or just the image
        serializer = CategorySerializer(category, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete Category"""
        if not self.get_role_check(request.user):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    


from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny    
class CategoryListView(ListAPIView):
    """
    Public view for users to see all categories.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] # Change to [IsAuthenticated] if users must log in first




from .models import MenuSection
from .serializers import MenuSectionSerializer
class MenuSectionListView(APIView):
    """Public view for users to see all Menu Sections"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        sections = MenuSection.objects.all().order_by('name')
        serializer = MenuSectionSerializer(sections, many=True)
        return Response(serializer.data)
    
# --- 1. POST VIEW (No ID in URL) ---
class MenuSectionManageView(APIView):
    """View to Add new Menu Sections"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['admin', 'staff']:
            return Response({"error": "Only Admins and Staff can add sections."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = MenuSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 2. PUT, GET, DELETE VIEW (Requires ID in URL) ---
class MenuSectionDetailManageView(APIView):
    """View to Edit, Delete, or View ONE Menu Section"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        section = get_object_or_404(MenuSection, pk=pk)
        serializer = MenuSectionSerializer(section)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role not in ['admin', 'staff']:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        section = get_object_or_404(MenuSection, pk=pk)
        serializer = MenuSectionSerializer(section, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role not in ['admin', 'staff']:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        section = get_object_or_404(MenuSection, pk=pk)
        section.delete()
        return Response({"message": "Menu Section deleted."}, status=status.HTTP_204_NO_CONTENT)
    



from .models import Product
from .serializers import ProductSerializer

# Helper function to check if the user is an admin or staff
def is_admin_or_staff(user):
    return user.is_authenticated and user.role in ['admin', 'staff']

# --- 1. VIEW ALL PRODUCTS (Public) ---
class ProductListView(APIView):
    """Public view for all users to see the entire menu."""
    permission_classes = [permissions.AllowAny] 

    def get(self, request):
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- 2. ADD A NEW PRODUCT (Admin/Staff Only) ---
class ProductCreateView(APIView):
    """Admin/Staff view to Add a new Product (Requires Form-Data)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not is_admin_or_staff(request.user):
            return Response({"error": "Only Admins and Staff can add products."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- 3. VIEW ONE, EDIT, OR DELETE (Mixed Permissions) ---
class ProductDetailManageView(APIView):
    """
    GET: Open to everyone (Public)
    PUT / DELETE: Restricted to Admin/Staff
    """
    # Set to AllowAny so the public GET request works
    permission_classes = [permissions.AllowAny] 

    def get(self, request, pk):
        """Publicly view details of a single product"""
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Admin/Staff edit an existing product"""
        # Manually block unauthorized users
        if not is_admin_or_staff(request.user): 
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        product = get_object_or_404(Product, pk=pk)
        
        # partial=True means you can update just the price without re-uploading the image
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Admin/Staff delete a product"""
        # Manually block unauthorized users
        if not is_admin_or_staff(request.user): 
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)