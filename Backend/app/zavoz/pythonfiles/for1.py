#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Kuppersbusch в БД"""

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
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_1.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_kuppersbusch import KuppersbuschProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
from sqlalchemy import text
import pandas as pd

# ID бренда Kuppersbusch
KUPPERSBUSCH_BRAND_ID = 1

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

def clean_float(value):
    if pd.isna(value):
        return None
    try:
        if isinstance(value, str):
            value = value.replace(',', '.')
        return float(value)
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
    """Очистка таблицы products_kuppersbusch перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_kuppersbusch")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(KuppersbuschProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(KuppersbuschProduct).delete()
        db.commit()

        # Сброс последовательности для PostgreSQL
        try:
            db.execute(text("ALTER SEQUENCE products_kuppersbusch_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass  # Если последовательности нет или другая БД

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(KuppersbuschProduct).count()
        print(f"📊 Записей после очистки: {count_after}")

    except Exception as e:
        print(f"❌ Ошибка очистки: {e}")
        db.rollback()
    finally:
        db.close()

def find_header_row(file_path):
    """Находит строку с заголовками в Excel файле"""
    try:
        # Читаем первые 20 строк чтобы найти заголовки
        df_preview = pd.read_excel(file_path, header=None, nrows=20)

        for idx, row in df_preview.iterrows():
            # Ищем строку, которая содержит нужные заголовки
            row_values = [str(v).lower() for v in row.values if pd.notna(v)]

            # Проверяем наличие ключевых заголовков
            if ('id' in row_values or 'артикул' in row_values or
                'наименование товара' in row_values or 'ррц' in row_values):
                print(f"📌 Найдена строка с заголовками: {idx}")
                return idx

        print("⚠️ Строка с заголовками не найдена, используем первую строку")
        return 0
    except Exception as e:
        print(f"⚠️ Ошибка поиска заголовков: {e}")
        return 0

def extract_all_images_with_order():
    """Извлекает ВСЕ изображения в порядке их следования в Excel"""
    print("=" * 70)
    print("📸 ИЗВЛЕЧЕНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ПО ПОРЯДКУ (KUPPERSBUSCH)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Kuppersbusch
    for old_file in PHOTOS_DIR.glob("1.*.jpg"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("1.*.jpg"):
        old_file.unlink()
    print("📁 Старые фото Kuppersbusch удалены")

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

            # Извлекаем ВСЕ фото в порядке их следования
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

                            # ВАЖНО: используем xml_row для определения номера строки
                            # xml_row - это 0-индексированный номер строки в Excel
                            # Прибавляем 1 для отображения (Excel строки начинаются с 1)
                            excel_row_number = xml_row + 1

                            img_name = f"1.{excel_row_number}.jpg"
                            img_path = PHOTOS_DIR / img_name
                            with open(img_path, 'wb') as f:
                                f.write(converted_data)

                            dest_path = UPLOADS_DIR / img_name
                            shutil.copy2(img_path, dest_path)

                            # Сохраняем фото по номеру строки Excel
                            photo_by_row[excel_row_number] = {
                                'file_name': img_name,
                                'path': f"/uploads/products/{img_name}",
                                'row': excel_row_number,
                                'original': img_filename,
                                'xml_row': xml_row
                            }
                            print(f"  ✅ Извлечено: фото для строки {excel_row_number} -> {img_name}")

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {len(photo_by_row)} изображений")

    # Выводим соответствие строк и фото для отладки
    if photo_by_row:
        print("\n📋 Соответствие строк и фото:")
        for row_num in sorted(photo_by_row.keys()):
            print(f"   Строка {row_num} -> {photo_by_row[row_num]['file_name']}")

    return photo_by_row

def load_products_to_db(photo_by_row):
    """Загрузка товаров Kuppersbusch в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ KUPPERSBUSCH В БАЗУ ДАННЫХ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    # Находим строку с заголовками
    header_row = find_header_row(EXCEL_FILE)

    # Читаем Excel файл с указанием строки заголовков
    df = pd.read_excel(EXCEL_FILE, header=header_row)

    print(f"📊 Строка заголовков: {header_row}")
    print(f"📊 Найдено строк данных в Excel: {len(df)}")
    print(f"📊 Доступные колонки: {list(df.columns)}")

    # Выводим первые несколько строк для отладки
    print("\n📋 Первые 3 строки данных:")
    for i in range(min(3, len(df))):
        print(f"  Строка {i+1}: {df.iloc[i].to_dict()}")

    db = SessionLocal()

    try:
        # Получаем или создаем бренд Kuppersbusch
        brand = db.query(Brand).filter(Brand.id == KUPPERSBUSCH_BRAND_ID).first()
        if not brand:
            brand = Brand(id=KUPPERSBUSCH_BRAND_ID, name='Kuppersbusch')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Kuppersbusch (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Kuppersbusch (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам Excel
        for idx, row in df.iterrows():
            # Реальный номер строки в Excel (с учетом заголовков)
            # idx - это индекс в DataFrame (начинается с 0)
            # header_row - номер строки с заголовками
            # +2 потому что: строки в Excel нумеруются с 1, а заголовок занимает header_row+1
            excel_row_num = idx + header_row + 2

            # Получаем наименование товара (обязательное поле)
            name = None
            for col_name in ['Наименование товара', 'наименование товара', 'Name', 'NAME', 'name']:
                if col_name in row:
                    name = clean_string(row[col_name])
                    if name:
                        break

            if not name:
                print(f"⚠️ Строка {excel_row_num}: пропущено (нет наименования)")
                skipped_count += 1
                continue

            # Получаем фото по реальному номеру строки в Excel
            photo_path = None
            if excel_row_num in photo_by_row:
                photo_path = photo_by_row[excel_row_num]['path']
                print(f"  📷 Строка {excel_row_num}: {name[:30]}... -> фото найдено: {photo_by_row[excel_row_num]['file_name']}")
            else:
                print(f"  ⚠️ Строка {excel_row_num}: {name[:30]}... -> фото не найдено")

            # Получаем category_id
            category_id = None
            for col_name in ['ID_категорий', 'id_категорий', 'Category ID', 'category_id']:
                if col_name in row:
                    val = clean_float(row[col_name])
                    if val:
                        category_id = int(val)
                        break

            if category_id:
                category_exists = db.query(Category).filter(Category.id == category_id).first()
                if not category_exists:
                    print(f"  ⚠️ Категория id={category_id} не найдена для {name[:30]}...")
                    category_id = None

            # Получаем цену
            price = 0
            for col_name in ['РРЦ  Рубли', 'РРЦ Рубли', 'РРЦ', 'Price', 'price']:
                if col_name in row:
                    price = clean_price(row[col_name])
                    if price > 0:
                        break

            # Получаем артикул
            sku = None
            for col_name in ['Артикул', 'артикул', 'SKU', 'sku', 'Article']:
                if col_name in row:
                    sku = clean_string(row[col_name])
                    if sku:
                        break

            # Получаем статус
            status = None
            for col_name in ['Статус', 'статус', 'Status', 'status']:
                if col_name in row:
                    status = clean_string(row[col_name])
                    if status:
                        break

            # Получаем комментарий
            comment = None
            for col_name in ['Комментарий', 'комментарий', 'Comment', 'comment']:
                if col_name in row:
                    comment = clean_string(row[col_name])
                    if comment:
                        break

            # Получаем цвет прибора
            color = None
            for col_name in ['Цвет прибора', 'цвет прибора', 'Color', 'color']:
                if col_name in row:
                    color = clean_string(row[col_name])
                    if color:
                        break

            # Получаем описание
            description = None
            for col_name in ['Описание', 'описание', 'Description', 'description']:
                if col_name in row:
                    description = clean_string(row[col_name])
                    if description:
                        break

            # Получаем серию
            series = None
            for col_name in ['Серия', 'серия', 'Series', 'series']:
                if col_name in row:
                    series = clean_string(row[col_name])
                    if series:
                        break

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'sku': sku,
                'name': name,
                'price': price if price > 0 else 0,
                'main_image': photo_path,
                'status': status,
                'comment': comment,
                'color': color,
                'description': description,
                'series': series,
                'width': clean_float(row.get('Ширина (м) упаковки')),
                'height': clean_float(row.get('Высота (м) упаковки')),
                'depth': clean_float(row.get('Глубина (м) упаковки')),
                'volume': clean_float(row.get('Объем (м3) упаковки')),
                'net_weight': clean_float(row.get('Вес нетто'))
            }

            # Проверяем, существует ли товар с таким артикулом
            existing = None
            if product_data['sku']:
                existing = db.query(KuppersbuschProduct).filter(
                    KuppersbuschProduct.sku == product_data['sku']
                ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {name[:40]}")
            else:
                new_product = KuppersbuschProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:40]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Kuppersbusch: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено (пустые строки): {skipped_count}")
        print(f"   📷 Всего фото в папке: {len(photo_by_row)}")
        print(f"   📦 Всего товаров Kuppersbusch в БД: {db.query(KuppersbuschProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(KuppersbuschProduct).filter(KuppersbuschProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ KUPPERSBUSCH И ФОТО")
    print("=" * 70)

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем все фото в порядке их следования
    photos_by_row = extract_all_images_with_order()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото для Kuppersbusch")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены! Проверьте Excel файл.")

    # Загружаем товары в БД
    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)