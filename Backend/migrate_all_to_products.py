#!/usr/bin/env python3
import sys

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
sys.path.insert(0, 'C:/vs code/Sofia_tech')

from app.models.product_brandt import BrandtProduct
from app.database import SessionLocal
from app.models import (
     Product, Brand, Category
)
from decimal import Decimal
from datetime import datetime, date, timedelta

def convert_value(value):
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

models = [
    (BrandtProduct, 'Brandt'),
    (LiebherrProduct, 'Liebherr'),
    (DedietrichProduct, 'Dedietrich'),
    (FalmecProduct, 'Falmec'),
    (GraudeProduct, 'Graude'),
    (HomeierProduct, 'Homeier'),
    (KuppersbuschProduct, 'Kuppersbusch'),
    (NivonaProduct, 'Nivona'),
    (SchulthessProduct, 'Schulthess'),
    (TekaProduct, 'Teka'),
    (BonkrasherProduct, 'Bonkrasher'),
    (IlveProduct, 'ILVE'),
]

brand_map = {b.name: b.id for b in db.query(Brand).all()}

total = 0
skipped = 0

for model, brand_name in models:
    items = db.query(model).all()
    if not items:
        continue

    brand_id = brand_map.get(brand_name)
    if not brand_id:
        print(f"⚠️ Бренд '{brand_name}' не найден, товары из {model.__name__} пропущены.")
        continue

    print(f"Обработка {len(items)} товаров из {model.__name__} (бренд '{brand_name}', id={brand_id})")

    for old in items:
        attrs = {}
        for col in model.__table__.columns:
            col_name = col.name
            if col_name in ['id', 'category_id', 'brand_id', 'name', 'sku', 'price', 'main_image']:
                continue
            if col_name in ['created_at', 'updated_at']:
                continue
            value = getattr(old, col_name)
            if value is not None:
                attrs[col_name] = convert_value(value)

        price = getattr(old, 'price', None)
        if price is None:
            price = getattr(old, 'price_public', None)
        if price is None:
            price = getattr(old, 'price_retail', None)
        if price is not None:
            price = float(price)

        sku = getattr(old, 'sku', None)
        if not sku:
            sku = getattr(old, 'model', None)
        if not sku:
            sku = getattr(old, 'manufacturer_code', None)
        if not sku:
            sku = getattr(old, 'ean', None)
        if not sku:
            sku = f"{brand_name}_{old.id}"

        existing = db.query(Product).filter(Product.sku == sku).first()
        if existing:
            skipped += 1
            continue

        cat_id = getattr(old, 'category_id', None)
        if cat_id is not None:
            cat_exists = db.query(Category).filter(Category.id == cat_id).first()
            if not cat_exists:
                print(f"  Предупреждение: категория id={cat_id} не найдена, будет NULL для {sku}")
                cat_id = None

        new_product = Product(
            brand_id=brand_id,
            category_id=cat_id,
            name=old.name,
            sku=sku,
            price=price,
            main_image=getattr(old, 'main_image', None),
            attributes=attrs if attrs else None
        )
        db.add(new_product)
        total += 1
        if total % 500 == 0:
            db.commit()
            print(f"  Зафиксировано {total} товаров...")

    db.commit()
    print(f"  Завершён перенос для {model.__name__}")

db.commit()
print(f"\n✅ Готово! Перенесено {total} товаров в таблицу products (пропущено {skipped} дубликатов).")
db.close()
