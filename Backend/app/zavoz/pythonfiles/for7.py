#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Brandt в БД"""

import sys
import re
import zipfile
import shutil
from pathlib import Path
from PIL import Image
import io

# Пути
BASE_DIR = Path('/home/raul/projects/sofa2/Sofia_tech')
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_7.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_brandt import BrandtProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
import pandas as pd

def clean_price(price_str):
    """Очистка цены от символов"""
    if pd.isna(price_str):
        return 0
    price_str = str(price_str).strip()
    price_str = price_str.replace('₽', '').replace('руб', '').replace(' ', '').replace(',', '.')
    price_str = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(price_str)
    except:
        return 0

def clean_string(value):
    if pd.isna(value):
        return None
    return str(value).strip()

def clean_int(value):
    if pd.isna(value):
        return None
    try:
        return int(float(value))
    except:
        return None

def convert_to_jpg(image_data, quality=85):
    """Конвертирует изображение в JPG формат"""
    try:
        img = Image.open(io.BytesIO(image_data))
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        return output.getvalue(), 'jpg'
    except Exception as e:
        print(f"      ⚠️ Ошибка конвертации: {e}")
        return image_data, 'png'

def extract_images_from_excel():
    """Извлечение изображений из Excel файла"""
    print("=" * 70)
    print("📸 ИЗВЛЕЧЕНИЕ ИЗОБРАЖЕНИЙ ИЗ EXCEL ФАЙЛА (BRANDT)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")
    print(f"📁 Размер файла: {EXCEL_FILE.stat().st_size / 1024:.2f} KB")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"📁 Папка для фото: {PHOTOS_DIR}")
    print(f"📁 Папка uploads: {UPLOADS_DIR}")

    photo_mapping = {}
    image_counter = 0

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            all_files = zip_ref.namelist()
            print(f"\n📦 В архиве найдено файлов: {len(all_files)}")
            media_files = [f for f in all_files if 'media' in f.lower() or 'image' in f.lower()]
            print(f"🖼️ Найдено медиа файлов: {len(media_files)}")

            for idx, file_name in enumerate(media_files):
                if file_name.startswith('xl/media/') or file_name.startswith('xl/drawings/'):
                    img_data = zip_ref.read(file_name)
                    if len(img_data) > 100:
                        converted_data, ext = convert_to_jpg(img_data)
                        img_number = idx + 1
                        img_name = f"7.{img_number}_brandt.jpg"
                        img_path = PHOTOS_DIR / img_name
                        with open(img_path, 'wb') as f:
                            f.write(converted_data)
                        dest_path = UPLOADS_DIR / img_name
                        shutil.copy2(img_path, dest_path)
                        photo_mapping[img_number] = {
                            'file_name': img_name,
                            'path': f"/uploads/products/{img_name}",
                            'number': img_number
                        }
                        print(f"  ✅ Извлечено: {img_name}")
                        image_counter += 1
    except Exception as e:
        print(f"❌ Ошибка при открытии архива: {e}")
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {image_counter} изображений")
    return photo_mapping

def load_products_to_db(photo_mapping):
    """Загрузка товаров Brandt в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ BRANDT В БАЗУ ДАННЫХ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    df = pd.read_excel(EXCEL_FILE)
    print(f"📊 Найдено строк: {len(df)}")
    print(f"📋 Колонки: {list(df.columns)}")

    db = SessionLocal()

    try:
        # Бренд Brandt (id=7)
        brand = db.query(Brand).filter(Brand.id == 7).first()
        if not brand:
            brand = Brand(id=7, name='Brandt')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Brandt (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Brandt (id: {brand.id})")

        new_count = 0
        updated_count = 0

        for idx, row in df.iterrows():
            row_num = idx + 2

            # Получаем наименование (обязательное поле)
            name = clean_string(row.get('Наименовние'))
            if not name:
                print(f"⚠️ Строка {row_num}: пропущено Наименование")
                continue

            # Получаем фото для этой строки (по порядку)
            photo_path = None
            photo_num = idx + 1
            if photo_num in photo_mapping:
                photo_path = photo_mapping[photo_num]['path']
                print(f"  📷 {name[:30]}: фото {photo_mapping[photo_num]['file_name']}")

            # Получаем category_id
            category_id = clean_int(row.get('categiry_id'))

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'main_image': photo_path,
                'name': name,
                'model': clean_string(row.get('Модель')),
                'specifications': clean_string(row.get('Характеристики')),
                'design': clean_string(row.get('Дизайн')),
                'price': clean_price(row.get('РРЦ, руб')),
                'comment': clean_string(row.get('Комментарий'))
            }

            # Проверяем существует ли товар по названию и модели
            existing = db.query(BrandtProduct).filter(
                BrandtProduct.name == name,
                BrandtProduct.model == product_data['model']
            ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"🔄 Обновлен: {name[:40]}")
            else:
                new_product = BrandtProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"➕ Добавлен: {name[:40]}")

        db.commit()
        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Brandt: {new_count}")
        print(f"   🔄 Обновлено товаров Brandt: {updated_count}")
        print(f"   📦 Всего товаров Brandt в БД: {db.query(BrandtProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(BrandtProduct).filter(BrandtProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ BRANDT И ФОТО")
    print("=" * 70)

    # Извлекаем фото
    photos = extract_images_from_excel()

    # Загружаем товары в БД (с фото или без)
    load_products_to_db(photos)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)