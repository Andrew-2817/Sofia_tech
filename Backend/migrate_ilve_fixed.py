#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/raul/projects/sofa2/Sofia_tech')

from app.database import SessionLocal
from app.models.product_ilve import IlveProduct
from app.models.product import Product
from app.models.brand import Brand
from app.models.category import Category
from decimal import Decimal
from datetime import datetime, date, timedelta

def convert(value):
    if value is None:
        return None
    if isinstance(value, (Decimal, float)):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, timedelta):
        return str(value)
    return value

db = SessionLocal()

brand = db.query(Brand).filter(Brand.name == 'Ilve').first()
if not brand:
    print("Бренд ILVE не найден в таблице brands. Сначала добавьте его (см. инструкцию).")
    db.close()
    sys.exit(1)

print(f"Бренд ILVE: id={brand.id}")

ilve_products = db.query(IlveProduct).all()
print(f"Найдено товаров ILVE: {len(ilve_products)}")

total = 0
for old in ilve_products:
    attrs = {}
    for col in IlveProduct.__table__.columns:
        col_name = col.name
        if col_name in ['id', 'category_id', 'brand_id', 'sku', 'name', 'price', 'main_image']:
            continue
        if col_name in ['created_at', 'updated_at']:
            continue
        value = getattr(old, col_name)
        if value is not None:
            attrs[col_name] = convert(value)

    existing = db.query(Product).filter(Product.sku == old.sku).first()
    if existing:
        print(f"Товар с sku {old.sku} уже есть в products, пропускаем")
        continue

    cat_id = old.category_id
    if cat_id is not None:
        cat_exists = db.query(Category).filter(Category.id == cat_id).first()
        if not cat_exists:
            print(f"Предупреждение: категория id={cat_id} не найдена, будет NULL для {old.sku}")
            cat_id = None

    new_product = Product(
        brand_id=brand.id,
        category_id=cat_id,
        name=old.name,
        sku=old.sku,
        price=float(old.price) if old.price else None,
        main_image=old.main_image,
        attributes=attrs if attrs else None
    )
    db.add(new_product)
    total += 1
    if total % 500 == 0:
        db.commit()
        print(f"  Добавлено {total} товаров")

db.commit()
print(f"Готово! Перенесено {total} товаров ILVE в таблицу products")
db.close()
