from rest_framework import serializers
from .models import Category, MenuSection, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('image') and representation['image'].startswith('/'):
            representation['image'] = f"http://127.0.0.1:8000{representation['image']}"
        return representation


class MenuSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuSection
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    menu_section_name = serializers.ReadOnlyField(source='menu_section.name')

    class Meta:
        model = Product
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('image') and representation['image'].startswith('/'):
            representation['image'] = f"http://127.0.0.1:8000{representation['image']}"
        return representation