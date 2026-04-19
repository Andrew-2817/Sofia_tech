import django_filters
from django.db import models
from .models import BaseProduct

class BaseProductFilter(django_filters.FilterSet):
    brand = django_filters.CharFilter(field_name='brand__slug')
    category = django_filters.CharFilter(field_name='category__slug')
    min_price = django_filters.NumberFilter(field_name='variants__price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='variants__price', lookup_expr='lte')
    color = django_filters.CharFilter(field_name='variants__color__name', lookup_expr='iexact')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = BaseProduct
        fields = ['brand', 'category', 'min_price', 'max_price', 'color']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(article_base__icontains=value) |
            models.Q(variants__article__icontains=value)
        ).distinct()