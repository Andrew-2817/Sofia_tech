from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny

from .models import BaseProduct, Brand, Category, Color, Product, Cart, CartItem
from .serializers import (
    BaseProductListSerializer, BrandSerializer,
    CategorySerializer, ColorSerializer,
    CartSerializer, CartItemSerializer
)
from .filters import BaseProductFilter
from .utils import get_or_create_cart

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class BaseProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BaseProduct.objects.filter(is_active=True).select_related(
        'brand', 'category'
    ).prefetch_related(
        'variants', 'variants__color', 'variants__decor_color',
        'variants__images', 'variants__attributes__attribute'
    )
    serializer_class = BaseProductListSerializer
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = BaseProductFilter
    search_fields = ['name', 'article_base', 'variants__article']

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    pagination_class = None

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

class ColorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    pagination_class = None


# ================= КОРЗИНА =================
class CartViewSet(viewsets.GenericViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['add', 'update_item', 'remove']:
            return CartItemSerializer
        return CartSerializer

    def get_cart(self, request):
        return get_or_create_cart(request)

    @action(detail=False, methods=['get'])
    def my(self, request):
        """Получить содержимое корзины текущего пользователя/сессии."""
        cart = self.get_cart(request)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        """Добавить товар в корзину."""
        cart = self.get_cart(request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({'status': 'added', 'quantity': cart_item.quantity}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Обновить количество товара в корзине."""
        cart = self.get_cart(request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не в корзине'}, status=status.HTTP_404_NOT_FOUND)

        if quantity <= 0:
            cart_item.delete()
            return Response({'status': 'removed'})
        else:
            cart_item.quantity = quantity
            cart_item.save()
            return Response({'status': 'updated', 'quantity': cart_item.quantity})

    @action(detail=False, methods=['post'])
    def remove(self, request):
        """Удалить товар из корзины."""
        cart = self.get_cart(request)
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id обязателен'}, status=status.HTTP_400_BAD_REQUEST)

        deleted, _ = CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        if deleted:
            return Response({'status': 'removed'})
        return Response({'error': 'Товар не найден в корзине'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Очистить всю корзину."""
        cart = self.get_cart(request)
        cart.items.all().delete()
        return Response({'status': 'cleared'})