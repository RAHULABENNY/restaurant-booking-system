from rest_framework import serializers
from .models import Order, OrderItem, Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user']





class OrderItemSerializer(serializers.ModelSerializer):
    # This nests the product details (name, price, image)
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    # 'order_items' must match the related_name in your OrderItem model
    items = OrderItemSerializer(many=True, read_only=True, source='order_items')

    class Meta:
        model = Order
        fields ='__all__'


from rest_framework import serializers
from .models import Banner

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'