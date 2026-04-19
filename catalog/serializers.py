from rest_framework import serializers
from .models import (
    Brand, Category, Color, BaseProduct, Product,
    ProductImage, ProductAttribute, Cart, CartItem
)

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main', 'sort_order']

class ProductAttributeSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    unit = serializers.CharField(source='attribute.unit', read_only=True)

    class Meta:
        model = ProductAttribute
        fields = ['attribute_name', 'value', 'unit']

class ProductSerializer(serializers.ModelSerializer):
    color = ColorSerializer(read_only=True)
    decor_color = ColorSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'article', 'article_decor', 'price', 'promo_price',
            'color', 'decor_color', 'status', 'stock_comment',
            'package_width', 'package_height', 'package_depth',
            'volume', 'net_weight', 'gross_weight',
            'images', 'attributes', 'is_active'
        ]

class BaseProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    variants = ProductSerializer(many=True, read_only=True, source='variants.filter')

    class Meta:
        model = BaseProduct
        fields = [
            'id', 'article_base', 'name', 'brand', 'category',
            'description', 'variants', 'is_active'
        ]


# ================= КОРЗИНА =================
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    quantity = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        total = 0
        for item in obj.items.all():
            price = item.product.promo_price if item.product.promo_price else item.product.price
            total += price * item.quantity
        return total