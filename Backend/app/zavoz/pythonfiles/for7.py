#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Brandt в БД"""

import sys
import re
import zipfile
import shutil
from pathlib import Path
from PIL import Image
import io
import xml.etree.ElementTree as ET

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
from sqlalchemy import text
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
        if isinstance(value, (int, float)):
            return int(value)
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

def cleanup_products_table():
    """Очистка таблицы products_brandt перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_brandt")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(BrandtProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(BrandtProduct).delete()
        db.commit()

        db.execute(text("ALTER SEQUENCE products_brandt_id_seq RESTART WITH 1"))
        db.commit()

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(BrandtProduct).count()
        print(f"📊 Записей после очистки: {count_after}")

    except Exception as e:
        print(f"❌ Ошибка очистки: {e}")
        db.rollback()
    finally:
        db.close()

def extract_all_images_with_order():
    """Извлекает ВСЕ изображения в порядке их следования в Excel (включая фото для пустых строк)"""
    print("=" * 70)
    print("📸 ИЗВЛЕЧЕНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ПО ПОРЯДКУ (BRANDT)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Brandt
    for old_file in PHOTOS_DIR.glob("7.*.jpg"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("7.*.jpg"):
        old_file.unlink()
    print("📁 Старые фото Brandt удалены")

    photo_by_row = {}

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            # Находим все файлы изображений
            image_files = {}
            media_files = [f for f in zip_ref.namelist() if f.startswith('xl/media/')]
            print(f"📸 Найдено медиа файлов в архиве: {len(media_files)}")

            for file_name in media_files:
                file_lower = file_name.lower()
                if any(ext in file_lower for ext in ['.png', '.jpg', '.jpeg', '.gif', '.emf', '.wmf']):
                    img_name = Path(file_name).stem
                    img_id = re.search(r'image(\d+)', img_name, re.IGNORECASE)
                    img_num = int(img_id.group(1)) if img_id else 0
                    image_files[file_name] = {'num': img_num, 'name': file_name}

            print(f"📸 Обработано изображений: {len(image_files)}")

            # Читаем XML для получения порядка фото
            drawing_files = [f for f in zip_ref.namelist() if 'xl/drawings/drawing' in f and f.endswith('.xml')]

            # Собираем все фото с их позициями (XML row)
            photos_with_positions = []

            for drawing_file in drawing_files:
                try:
                    xml_content = zip_ref.read(drawing_file)
                    root = ET.fromstring(xml_content)

                    namespaces = {
                        'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
                    }

                    for anchor in root.findall('.//xdr:twoCellAnchor', namespaces):
                        pic = anchor.find('.//xdr:pic', namespaces)
                        if pic is not None:
                            blip = pic.find('.//a:blip', namespaces)
                            if blip is not None:
                                r_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                                from_elem = anchor.find('.//xdr:from', namespaces)
                                if from_elem is not None:
                                    row_elem = from_elem.find('.//xdr:row', namespaces)
                                    if row_elem is not None:
                                        xml_row = int(row_elem.text)
                                        photos_with_positions.append({
                                            'r_id': r_id,
                                            'xml_row': xml_row
                                        })
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {drawing_file}: {e}")

            # Сортируем по XML row
            photos_with_positions.sort(key=lambda x: x['xml_row'])

            # Читаем связи rId -> имя файла
            rels_files = [f for f in zip_ref.namelist() if 'xl/drawings/_rels/drawing' in f and f.endswith('.rels')]
            rid_to_filename = {}

            for rels_file in rels_files:
                try:
                    xml_content = zip_ref.read(rels_file)
                    root = ET.fromstring(xml_content)
                    for rel in root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                        rel_id = rel.get('Id')
                        target = rel.get('Target')
                        if target and ('media' in target or 'image' in target):
                            filename = Path(target).name
                            rid_to_filename[rel_id] = filename
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {rels_file}: {e}")

            # Извлекаем ВСЕ фото в порядке их следования (НЕ пропуская пустые строки)
            print(f"\n📸 Извлечение {len(photos_with_positions)} фото в порядке следования...")

            for idx, photo_info in enumerate(photos_with_positions):
                rid = photo_info['r_id']
                xml_row = photo_info['xml_row']

                if rid in rid_to_filename:
                    img_filename = rid_to_filename[rid]
                    img_path_in_zip = None
                    for file_path in image_files.keys():
                        if Path(file_path).name == img_filename:
                            img_path_in_zip = file_path
                            break

                    if img_path_in_zip:
                        img_data = zip_ref.read(img_path_in_zip)
                        if len(img_data) > 100:
                            converted_data, ext = convert_to_jpg(img_data)

                            # Номер фото = idx + 1 (начиная с 1)
                            photo_num = idx + 1
                            img_name = f"7.{photo_num}.jpg"
                            img_path = PHOTOS_DIR / img_name
                            with open(img_path, 'wb') as f:
                                f.write(converted_data)

                            dest_path = UPLOADS_DIR / img_name
                            shutil.copy2(img_path, dest_path)

                            photo_by_row[photo_num] = {
                                'file_name': img_name,
                                'path': f"/uploads/products/{img_name}",
                                'row': photo_num,
                                'original': img_filename,
                                'xml_row': xml_row
                            }
                            print(f"  ✅ Извлечено: фото номер {photo_num} -> {img_name} (XML row={xml_row})")

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {len(photo_by_row)} изображений")

    return photo_by_row

def load_products_to_db(photo_by_row):
    """Загрузка товаров Brandt в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ BRANDT В БАЗУ ДАННЫХ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    df = pd.read_excel(EXCEL_FILE)
    print(f"📊 Найдено строк в Excel: {len(df)}")

    # Определяем, какие строки имеют наименование
    rows_with_name = []
    for idx, row in df.iterrows():
        name = clean_string(row.get('Наименовние'))
        if not name:
            name = clean_string(row.get('Наименование'))
        rows_with_name.append({
            'idx': idx,
            'has_name': bool(name),
            'name': name,
            'row': row
        })

    print(f"📊 Строк с наименованием: {sum(1 for r in rows_with_name if r['has_name'])}")
    print(f"📊 Строк без наименования: {sum(1 for r in rows_with_name if not r['has_name'])}")

    # Нумеруем фото для строк с наименованием (пропуская пустые строки)
    # Но нумерация фото должна соответствовать их реальному порядку в Excel
    # То есть фото 1 -> строка 1, фото 2 -> строка 2, фото 3 -> строка 3 (пустая), фото 4 -> строка 4 и т.д.

    db = SessionLocal()

    try:
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
        skipped_count = 0

        # Проходим по ВСЕМ строкам Excel
        for item in rows_with_name:
            excel_row_num = item['idx'] + 1  # номер строки в Excel (для отладки)
            photo_num = excel_row_num  # ФОТО СООТВЕТСТВУЕТ НОМЕРУ СТРОКИ В EXCEL!

            if not item['has_name']:
                print(f"⚠️ Строка {excel_row_num}: пропущено Наименование, фото {photo_num} не используется")
                skipped_count += 1
                continue

            name = item['name']
            row = item['row']

            # Получаем фото по номеру строки
            photo_path = None
            if photo_num in photo_by_row:
                photo_path = photo_by_row[photo_num]['path']
                print(f"  📷 Строка {excel_row_num}: {name[:30]}... -> фото 7.{photo_num}.jpg")
            else:
                print(f"  ⚠️ Строка {excel_row_num}: {name[:30]}...: фото не найдено для номера {photo_num}")

            # Получаем category_id
            category_id = clean_int(row.get('categiry_id'))
            if not category_id:
                category_id = clean_int(row.get('category_id'))

            if category_id:
                category_exists = db.query(Category).filter(Category.id == category_id).first()
                if not category_exists:
                    print(f"  ⚠️ Категория id={category_id} не найдена для {name[:30]}...")
                    category_id = None

            # Получаем цену
            price = clean_price(row.get('РРЦ, руб'))
            if price == 0:
                price = clean_price(row.get('РРЦ, руб.1'))

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'main_image': photo_path,
                'name': name,
                'model': clean_string(row.get('Модель')),
                'specifications': clean_string(row.get('Характеристики')),
                'design': clean_string(row.get('Дизайн')),
                'price': price if price > 0 else 0,
                'comment': clean_string(row.get('Комментарий'))
            }

            existing = db.query(BrandtProduct).filter(
                BrandtProduct.name == name,
                BrandtProduct.model == product_data['model']
            ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                print(f"  🔄 Обновлен: {name[:40]}")
            else:
                new_product = BrandtProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:40]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Brandt: {new_count}")
        print(f"   ⏭️ Пропущено (пустые строки): {skipped_count}")
        print(f"   📷 Всего фото в папке: {len(photo_by_row)}")
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

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем ВСЕ фото в порядке их следования
    photos_by_row = extract_all_images_with_order()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото для Brandt")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены! Проверьте Excel файл.")

    # Загружаем товары в БД
    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)