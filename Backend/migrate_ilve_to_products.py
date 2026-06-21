#!/usr/bin/env python3
"""Миграция товаров ILVE в общую таблицу products"""

import sys
from pathlib import Path

# Добавляем путь к проекту
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.database import SessionLocal
from app.models.product_ilve import IlveProduct
from app.models.product import Product
from app.models.brand import Brand
from app.models.category import Category
from decimal import Decimal
from datetime import datetime, date, timedelta

def convert_value(value):
    """Конвертирует значение в подходящий формат"""
    if value is None:
        return None
    if isinstance(value, (Decimal, float)):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, timedelta):
        return str(value)
    return value

def get_sku_from_product(model_obj, brand_name):
    """Извлекает SKU из товара по приоритету"""
    sku = getattr(model_obj, 'sku', None)
    if sku:
        return sku
    
    sku = getattr(model_obj, 'model', None)
    if sku:
        return sku
    
    sku = getattr(model_obj, 'manufacturer_code', None)
    if sku:
        return sku
    
    sku = getattr(model_obj, 'actual_code', None)
    if sku:
        return sku
    
    sku = getattr(model_obj, 'ean', None)
    if sku:
        return sku
    
    return f"{brand_name}_{model_obj.id}"

def get_price_from_product(model_obj):
    """Извлекает цену из товара по приоритету"""
    price = getattr(model_obj, 'price', None)
    if price is not None:
        return float(price)
    
    price = getattr(model_obj, 'price_public', None)
    if price is not None:
        return float(price)
    
    price = getattr(model_obj, 'price_retail', None)
    if price is not None:
        return float(price)
    
    price = getattr(model_obj, 'price_wholesale', None)
    if price is not None:
        return float(price)
    
    return None

def get_description_from_product(model_obj):
    """Извлекает описание из товара"""
    description = getattr(model_obj, 'description', None)
    if description:
        return description
    
    description = getattr(model_obj, 'Описание', None)
    if description:
        return description
    
    return None

def get_color_from_product(model_obj):
    """Извлекает цвет из товара"""
    color = getattr(model_obj, 'color', None)
    if color:
        return color
    
    color = getattr(model_obj, 'decor_color', None)
    if color:
        return color
    
    return None

def get_dimension_from_product(model_obj, field_name):
    """Извлекает размерность из товара"""
    value = getattr(model_obj, field_name, None)
    if value is not None:
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
    return None

def get_name_from_product(model_obj):
    """Извлекает название из товара"""
    name = getattr(model_obj, 'name', None)
    if name:
        return name
    
    name = getattr(model_obj, 'Название', None)
    if name:
        return name
    
    name = getattr(model_obj, 'Наименование', None)
    if name:
        return name
    
    return None

db = SessionLocal()

# Получаем бренд ILVE
brand = db.query(Brand).filter(Brand.name == 'ILVE').first()
if not brand:
    print("❌ Бренд ILVE не найден в таблице brands. Сначала добавьте его.")
    db.close()
    sys.exit(1)

print(f"✅ Бренд ILVE: id={brand.id}")

# Получаем все товары ILVE
ilve_products = db.query(IlveProduct).all()
print(f"📦 Найдено товаров ILVE: {len(ilve_products)}")

total = 0
skipped = 0
errors = 0

for old in ilve_products:
    try:
        # Получаем SKU
        sku = get_sku_from_product(old, 'ILVE')
        
        # Проверяем, нет ли товара с таким же sku
        existing = db.query(Product).filter(Product.sku == sku).first()
        if existing:
            skipped += 1
            print(f"⏭️ Товар с sku {sku} уже есть в products, пропускаем")
            continue

        # Получаем название
        name = get_name_from_product(old)
        if not name:
            print(f"⚠️ Пропущен товар {old.id}: нет названия")
            skipped += 1
            continue

        # Получаем цену
        price = get_price_from_product(old)

        # Проверяем существование категории
        cat_id = old.category_id
        if cat_id is not None:
            cat_exists = db.query(Category).filter(Category.id == cat_id).first()
            if not cat_exists:
                print(f"⚠️ Категория id={cat_id} не найдена для {sku}, будет NULL")
                cat_id = None

        # Извлекаем поля для новой структуры
        description = get_description_from_product(old)
        color = get_color_from_product(old)
        
        # Извлекаем размеры
        width = get_dimension_from_product(old, 'width') or get_dimension_from_product(old, 'width_cm')
        height = get_dimension_from_product(old, 'height') or get_dimension_from_product(old, 'height_cm')
        depth = get_dimension_from_product(old, 'depth') or get_dimension_from_product(old, 'depth_cm')
        weight = get_dimension_from_product(old, 'weight') or get_dimension_from_product(old, 'net_weight') or get_dimension_from_product(old, 'gross_weight')

        # Создаем новый товар
        new_product = Product(
            brand_id=brand.id,
            category_id=cat_id,
            name=name,
            sku=sku,
            price=price,
            main_image=old.main_image,
            description=description,
            color=color,
            width=width,
            height=height,
            depth=depth,
            weight=weight
        )
        
        db.add(new_product)
        total += 1
        
        if total % 100 == 0:
            db.commit()
            print(f"  ✅ Добавлено {total} товаров...")
            
    except Exception as e:
        errors += 1
        print(f"❌ Ошибка при переносе товара {old.id}: {e}")
        db.rollback()
        continue

db.commit()
print(f"\n" + "=" * 70)
print("📊 РЕЗУЛЬТАТ МИГРАЦИИ ILVE:")
print("=" * 70)
print(f"   ✅ Перенесено товаров: {total}")
print(f"   ⏭️ Пропущено дубликатов: {skipped}")
print(f"   ❌ Ошибок: {errors}")
print("=" * 70)
db.close()