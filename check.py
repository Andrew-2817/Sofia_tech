import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from catalog.models import Brand, BaseProduct, Product

for brand in Brand.objects.all():
    base_count = BaseProduct.objects.filter(brand=brand).count()
    prod_count = Product.objects.filter(base_product__brand=brand).count()
    print(f"{brand.name}: {base_count} базовых, {prod_count} вариантов")