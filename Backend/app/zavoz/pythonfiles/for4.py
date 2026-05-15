#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров в БД"""

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
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_4.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_homeier import HomeierProduct
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
    """Очистка целочисленного значения"""
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return int(value) if not pd.isna(value) else None
    value_str = str(value).strip()
    value_str = re.sub(r'[^\d]', '', value_str)
    try:
        return int(value_str) if value_str else None
    except:
        return None

def clean_float(value):
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return float(value) if not pd.isna(value) else None
    value_str = str(value).strip().replace(',', '.')
    value_str = re.sub(r'[^\d.]', '', value_str)
    try:
        return float(value_str)
    except:
        return None

def convert_emf_to_jpg(emf_data, quality=85):
    """Конвертирует EMF изображение в JPG формат"""
    try:
        import tempfile

        with tempfile.NamedTemporaryFile(suffix='.emf', delete=False) as tmp_emf:
            tmp_emf.write(emf_data)
            tmp_emf_path = tmp_emf.name

        try:
            # Пробуем конвертировать через LibreOffice если PIL не справляется
            img = Image.open(tmp_emf_path)

            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            output = io.BytesIO()
            img.save(output, format='JPEG', quality=quality, optimize=True)
            Path(tmp_emf_path).unlink()
            return output.getvalue(), 'jpg'
        except Exception as e:
            Path(tmp_emf_path).unlink()
            print(f"      ⚠️ PIL не смог конвертировать EMF: {e}")
            # Возвращаем как есть, но с другим расширением
            return emf_data, 'emf'

    except Exception as e:
        print(f"      ⚠️ Ошибка конвертации EMF: {e}")
        return emf_data, 'emf'

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

def extract_images_with_positions():
    """Извлекает изображения из Excel и определяет их позиции"""
    print("=" * 70)
    print("📸 ИЗВЛЕЧЕНИЕ ИЗОБРАЖЕНИЙ С ПОЗИЦИЯМИ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

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
                    print(f"  📁 Найден файл: {Path(file_name).name} (ID: {img_num})")

            print(f"📸 Обработано изображений: {len(image_files)}")

            # Читаем XML для получения позиций
            drawing_files = [f for f in zip_ref.namelist() if 'xl/drawings/drawing' in f and f.endswith('.xml')]
            row_mapping = {}

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
                                        # В XML строки с 0, но в Excel первая строка с данными - это строка 2
                                        # Поэтому вычитаем 1, чтобы получить правильный номер фото начиная с 1
                                        row_num = xml_row  # Оставляем как есть для номера фото
                                        row_mapping[r_id] = row_num
                                        print(f"  📍 Найдено фото: rId={r_id}, XML row={xml_row}, номер фото={row_num}")
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {drawing_file}: {e}")

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
                            print(f"  🔗 Связь: {rel_id} -> {filename}")
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {rels_file}: {e}")

            # Сопоставляем и извлекаем изображения
            image_counter = 0
            # Сортируем по номеру строки для правильного порядка
            sorted_mapping = sorted(row_mapping.items(), key=lambda x: x[1])

            for idx, (rid, row_num) in enumerate(sorted_mapping):
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
                            if img_filename.lower().endswith('.emf'):
                                converted_data, ext = convert_emf_to_jpg(img_data)
                                print(f"  🔄 Конвертирован EMF: {img_filename}")
                            else:
                                converted_data, ext = convert_to_jpg(img_data)

                            # Номер фото: используем idx + 1 для последовательной нумерации с 1
                            photo_num = idx + 1
                            img_name = f"4.{photo_num}.jpg"
                            img_path = PHOTOS_DIR / img_name
                            with open(img_path, 'wb') as f:
                                f.write(converted_data)

                            dest_path = UPLOADS_DIR / img_name
                            shutil.copy2(img_path, dest_path)

                            photo_by_row[photo_num] = {
                                'file_name': img_name,
                                'path': f"/uploads/products/{img_name}",
                                'row': photo_num,
                                'original': img_filename
                            }
                            print(f"  ✅ Извлечено: фото номер {photo_num} -> {img_name} (было: {img_filename})")
                            image_counter += 1
                    else:
                        print(f"  ⚠️ Файл не найден: {img_filename}")

            # Резервный метод (если XML не сработал)
            if image_counter == 0 and image_files:
                print("\n  ⚠️ Не удалось определить позиции фото через XML, используем порядковый номер")
                sorted_files = sorted(image_files.items(), key=lambda x: x[1]['num'])
                for idx, (file_path, info) in enumerate(sorted_files):
                    img_data = zip_ref.read(file_path)
                    if len(img_data) > 100:
                        if file_path.lower().endswith('.emf'):
                            converted_data, ext = convert_emf_to_jpg(img_data)
                        else:
                            converted_data, ext = convert_to_jpg(img_data)

                        photo_num = idx + 1
                        img_name = f"4.{photo_num}.jpg"
                        img_path = PHOTOS_DIR / img_name
                        with open(img_path, 'wb') as f:
                            f.write(converted_data)
                        dest_path = UPLOADS_DIR / img_name
                        shutil.copy2(img_path, dest_path)
                        photo_by_row[photo_num] = {
                            'file_name': img_name,
                            'path': f"/uploads/products/{img_name}",
                            'row': photo_num,
                            'original': Path(file_path).name
                        }
                        print(f"  ✅ Извлечено (порядковый): фото номер {photo_num} -> {img_name}")
                        image_counter += 1

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {image_counter} изображений")

    if photo_by_row:
        print("\n📋 СООТВЕТСТВИЕ НОМЕРОВ ФОТО:")
        for photo_num in sorted(photo_by_row.keys()):
            print(f"   Фото 4.{photo_num}.jpg -> {photo_by_row[photo_num]['original']}")

    return photo_by_row

def load_products_to_db(photo_by_row):
    """Загрузка товаров в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ В БАЗУ ДАННЫХ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    df = pd.read_excel(EXCEL_FILE)
    print(f"📊 Найдено строк: {len(df)}")

    db = SessionLocal()

    try:
        brand = db.query(Brand).filter(Brand.name == 'Homeier').first()
        if not brand:
            brand = Brand(name='Homeier')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Homeier (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Homeier (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        for idx, row in df.iterrows():
            # Номер фото = idx + 1 (начиная с 1)
            photo_num = idx + 1

            sku = clean_string(row.get('Артикул'))

            if not sku or sku == 'nan':
                print(f"⚠️ Строка {idx + 1}: пропущен Артикул")
                skipped_count += 1
                continue

            photo_path = None
            if photo_num in photo_by_row:
                photo_path = photo_by_row[photo_num]['path']
                print(f"  📷 {sku[:30]}... -> фото 4.{photo_num}.jpg")
            else:
                print(f"  ⚠️ {sku[:30]}...: фото не найдено для номера {photo_num}")

            category_id = clean_int(row.get('category_id'))
            if category_id is None:
                print(f"  ⚠️ Пропущен category_id для {sku[:30]}..., товар не добавлен")
                skipped_count += 1
                continue

            # Проверяем существует ли категория в БД
            category_exists = db.query(Category).filter(Category.id == category_id).first()
            if not category_exists:
                print(f"  ⚠️ Категория с id={category_id} не найдена в БД для {sku[:30]}..., товар не добавлен")
                skipped_count += 1
                continue

            # Очищаем SKU от лишних символов
            sku_clean = sku.replace('\n', ' ').strip()

            product_data = {
                'sku': sku_clean,
                'name': clean_string(row.get('Название')) or f"Товар {sku_clean}",
                'price': clean_price(row.get('Цена')),
                'category_id': category_id,
                'brand_id': brand.id,
                'group_level_1': clean_string(row.get('Группа I уровня')),
                'group_level_2': clean_string(row.get('Группа II уровень')),
                'main_image': photo_path,
                'comment': clean_string(row.get('Комментарий')),
                'description': clean_string(row.get('Описание')),
                'color': clean_string(row.get('Цвет прибора')),
                'width': clean_float(row.get('Ширина (м) упаковки ')),
                'height': clean_float(row.get('Высота (м) упаковки ')),
                'depth': clean_float(row.get('Глубина (м) упаковки ')),
                'volume': clean_float(row.get('Объем (м3) упаковки')),
                'net_weight': clean_float(row.get('Вес нетто (кг)')),
                'gross_weight': clean_float(row.get('Вес брутто (кг)'))
            }

            existing = db.query(HomeierProduct).filter(HomeierProduct.sku == sku_clean).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {sku_clean[:40]}")
            else:
                new_product = HomeierProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {sku_clean[:40]}")

        db.commit()
        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено: {new_count}")
        print(f"   🔄 Обновлено: {updated_count}")
        print(f"   ⏭️ Пропущено: {skipped_count}")
        print(f"   📦 Всего товаров Homeier: {db.query(HomeierProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(HomeierProduct).filter(HomeierProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ И ФОТО")
    print("=" * 70)

    photos_by_row = extract_images_with_positions()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото")
    else:
        print("\n⚠️ Фото не найдены!")

    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)