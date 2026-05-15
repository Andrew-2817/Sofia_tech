#!/usr/bin/env python3
"""Простая загрузка товаров Liebherr в БД"""

import sys
import re
from pathlib import Path

BASE_DIR = Path('/home/raul/projects/sofa2/Sofia_tech')
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_8.xlsx'

sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from sqlalchemy import text
import pandas as pd

def clean_int(value):
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return int(value)
    numbers = re.findall(r'\d+', str(value))
    return int(numbers[0]) if numbers else None

def clean_price(value):
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    cleaned = re.sub(r'[^\d.]', '', str(value))
    try:
        return float(cleaned) if cleaned else None
    except:
        return None

def load_products():
    print("=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ LIEBHERR")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    df = pd.read_excel(EXCEL_FILE)
    print(f"📊 Найдено строк: {len(df)}")

    db = SessionLocal()

    try:
        # Получаем бренд
        brand_id = 8  # Liebherr
        print(f"✅ Бренд Liebherr (id: {brand_id})")

        # Очищаем таблицу перед загрузкой
        db.execute(text("TRUNCATE TABLE products_liebherr RESTART IDENTITY CASCADE"))
        db.commit()
        print("✅ Таблица очищена")

        count = 0
        for idx, row in df.iterrows():
            name = row.get('Название')
            if pd.isna(name) or not str(name).strip():
                continue

            # Вставляем данные
            db.execute(text("""
                INSERT INTO products_liebherr (
                    category_id, brand_id, model, ean, status, name, category_name,
                    production_start, factory, warranty, price_public, price_wholesale,
                    promo_price_public, promo_price_wholesale
                ) VALUES (
                    :category_id, :brand_id, :model, :ean, :status, :name, :category_name,
                    :production_start, :factory, :warranty, :price_public, :price_wholesale,
                    :promo_price_public, :promo_price_wholesale
                )
            """), {
                'category_id': clean_int(row.get('category_id')),
                'brand_id': brand_id,
                'model': row.get('Model') if not pd.isna(row.get('Model')) else None,
                'ean': str(row.get('EAN')) if not pd.isna(row.get('EAN')) else None,
                'status': row.get('Status') if not pd.isna(row.get('Status')) else None,
                'name': str(name).strip(),
                'category_name': row.get('Категория ') if not pd.isna(row.get('Категория ')) else None,
                'production_start': clean_int(row.get('Старт производства 2026')),
                'factory': row.get('Factory') if not pd.isna(row.get('Factory')) else None,
                'warranty': clean_int(row.get('Гарантия 2026')),
                'price_public': clean_price(row.get('РРЦ')),
                'price_wholesale': clean_price(row.get('ОПТ')),
                'promo_price_public': clean_price(row.get('Промо РРЦ')),
                'promo_price_wholesale': clean_price(row.get('Промо ОПТ'))
            })
            count += 1

            if count % 50 == 0:
                print(f"   Загружено {count} товаров...")

        db.commit()

        print("\n" + "=" * 70)
        print(f"✅ УСПЕШНО ЗАГРУЖЕНО: {count} товаров")

        # Проверка
        result = db.execute(text("SELECT COUNT(*) FROM products_liebherr")).first()
        print(f"📦 Всего товаров в БД: {result[0]}")

        # Показываем примеры
        samples = db.execute(text("SELECT id, name, price_public FROM products_liebherr LIMIT 5")).fetchall()
        print("\n📋 ПРИМЕРЫ ЗАГРУЖЕННЫХ ТОВАРОВ:")
        for s in samples:
            print(f"   ID: {s[0]}, Название: {s[1][:50]}, Цена: {s[2]}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ LIEBHERR")
    print("=" * 70)
    load_products()
    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)