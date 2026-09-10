
"""Миграция всех товаров из таблиц брендов в общую таблицу products"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.models.product_elica import ElicaProduct
from app.models.product_bonkrasher import BonkrasherProduct
from app.models.product_dedietrich import DedietrichProduct
from app.models.product_falmec import FalmecProduct
from app.models.product_graude import GraudeProduct
from app.models.product_homeier import HomeierProduct
from app.models.product_ilve import IlveProduct
from app.models.product_kuppersbusch import KuppersbuschProduct
from app.models.product_liebherr import LiebherrProduct
from app.models.product_nivona import NivonaProduct
from app.models.product_schulthess import SchulthessProduct
from app.models.product_teka import TekaProduct
from app.models.product_brandt import BrandtProduct

from app.database import SessionLocal
from app.models import Product, Brand, Category
from decimal import Decimal
from datetime import datetime, date, timedelta

# ========== УТИЛИТЫ ==========
def get_sku_from_product(model_obj, brand_name):
    
    sku = getattr(model_obj, 'sku', None) or getattr(model_obj, 'actual_code', None)
    if not sku:
        sku = getattr(model_obj, 'manufacturer_code', None)
    if not sku:
        sku = getattr(model_obj, 'ean', None)
    return sku or f"{brand_name}_{model_obj.id}"

def get_price_from_product(model_obj):
    price = getattr(model_obj, 'price', None)
    if price is None:
        price = getattr(model_obj, 'price_public', None)
    if price is None:
        price = getattr(model_obj, 'price_retail', None)
    if price is None:
        price = getattr(model_obj, 'price_wholesale', None)
    return float(price) if price is not None else None

def get_name_from_product(model_obj):
    name = getattr(model_obj, 'name', None) or getattr(model_obj, 'Название', None)
    return name or getattr(model_obj, 'Наименование', None)

def get_dimension_from_product(model_obj, *fields):
    for field in fields:
        value = getattr(model_obj, field, None)
        if value is not None:
            try:
                return float(value)
            except (ValueError, TypeError):
                continue
    return None

# ========== ПОДКЛЮЧЕНИЕ К БД ==========
db = SessionLocal()

# ========== ОТКАТЫВАЕМ ТРАНЗАКЦИИ ==========
db.rollback()

# ========== НАХОДИМ МАКСИМАЛЬНЫЙ ID ==========
max_id_result = db.query(Product.id).order_by(Product.id.desc()).first()
max_id = max_id_result[0] if max_id_result else 0
print(f"📊 Текущий максимальный ID в таблице products: {max_id}")

# ========== СЧЁТЧИК ДЛЯ НОВЫХ ID ==========
next_id = max_id + 1
print(f"📊 Следующий ID будет: {next_id}")

# ========== МОДЕЛИ ДЛЯ МИГРАЦИИ ==========
models = [
    # (BrandtProduct, 'Brandt'),
    # (LiebherrProduct, 'Liebherr'),
    # (DedietrichProduct, 'Dedietrich'),
    # (FalmecProduct, 'Falmec'),
    # (GraudeProduct, 'Graude'),
    # (HomeierProduct, 'Homeier'),
    # (KuppersbuschProduct, 'Kuppersbusch'),
    # (NivonaProduct, 'Nivona'),
    # (SchulthessProduct, 'Schulthess'),
    # (TekaProduct, 'Teka'),
    # (BonkrasherProduct, 'Bonkrasher'),
    (ElicaProduct, 'Elica'),
]

brand_map = {b.name: b.id for b in db.query(Brand).all()}
print(f"📋 Найдено брендов: {len(brand_map)}")

total = 0
skipped = 0
errors = 0

for model, brand_name in models:
    items = db.query(model).all()
    if not items:
        print(f"ℹ️ Нет товаров в {model.__name__}")
        continue

    brand_id = brand_map.get(brand_name)
    if not brand_id:
        print(f"⚠️ Бренд '{brand_name}' не найден, пропущено.")
        continue

    print(f"\n📦 Обработка {len(items)} товаров из {model.__name__} (бренд '{brand_name}')")

    for old in items:
        try:
            sku = get_sku_from_product(old, brand_name)
            
            # Проверка дубликатов по brand_id + sku
            existing = db.query(Product).filter(
                Product.brand_id == brand_id,
                Product.sku == sku
            ).first()
            
            if existing:
                skipped += 1
                continue

            name = get_name_from_product(old)
            if not name:
                skipped += 1
                continue

            price = get_price_from_product(old)
            cat_id = getattr(old, 'category_id', None)
            
            description = getattr(old, 'description', None) or getattr(old, 'Описание', None)
            color = getattr(old, 'color', None) or getattr(old, 'decor_color', None)
            
            width = get_dimension_from_product(old, 'width', 'width_cm')
            height = get_dimension_from_product(old, 'height', 'height_cm')
            depth = get_dimension_from_product(old, 'depth', 'depth_cm')
            weight = get_dimension_from_product(old, 'weight', 'net_weight', 'gross_weight')

            # ========== ГЛАВНОЕ: УСТАНАВЛИВАЕМ ID ВРУЧНУЮ ==========
            new_product = Product(
                id=next_id,  # ← Устанавливаем ID вручную
                brand_id=brand_id,
                category_id=cat_id,
                name=name,
                sku=sku,
                price=price,
                main_image=getattr(old, 'main_image', None),
                description=description,
                color=color,
                width=width,
                height=height,
                depth=depth,
                weight=weight
            )
            
            db.add(new_product)
            total += 1
            next_id += 1  # ← Увеличиваем счётчик
            
            if total % 50 == 0:
                db.commit()
                print(f"  ✅ Зафиксировано {total} товаров (следующий ID: {next_id})...")
                
        except Exception as e:
            errors += 1
            print(f"  ❌ Ошибка: {e}")
            db.rollback()
            # Не увеличиваем next_id при ошибке

    db.commit()
    print(f"  ✅ Завершён перенос для {model.__name__}")

db.commit()
print(f"\n" + "=" * 70)
print("📊 РЕЗУЛЬТАТ:")
print("=" * 70)
print(f"   ✅ Перенесено: {total}")
print(f"   ⏭️ Пропущено: {skipped}")
print(f"   ❌ Ошибок: {errors}")
print(f"   📊 Последний ID: {next_id - 1}")
print("=" * 70)
db.close()