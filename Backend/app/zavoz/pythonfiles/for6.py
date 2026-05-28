#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Graude в БД"""

import sys
import re
import zipfile
import shutil
from pathlib import Path
from PIL import Image
import io
import xml.etree.ElementTree as ET
import pandas as pd
from sqlalchemy import text

# Пути
BASE_DIR = Path('C:/vs code/Sofia_tech')
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_6.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_graude import GraudeProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category

# ID бренда Graude
GRAUDE_BRAND_ID = 6

def clean_price(price_str):
    """Очистка цены от символов"""
    if pd.isna(price_str):
        return None
    price_str = str(price_str).strip()
    price_str = price_str.replace('₽', '').replace('руб', '').replace(' ', '').replace(',', '.')
    price_str = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(price_str)
    except:
        return None

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
    """Конвертирует изображение в JPG формат, при ошибке сохраняет как PNG"""
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
        print(f"      ⚠️ Ошибка конвертации в JPG: {e}. Попытка сохранить как PNG...")
        try:
            img = Image.open(io.BytesIO(image_data))
            output = io.BytesIO()
            img.save(output, format='PNG')
            return output.getvalue(), 'png'
        except:
            pass
        return image_data, 'png'

def cleanup_products_table():
    """Очистка таблицы products_graude перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_graude")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(GraudeProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(GraudeProduct).delete()
        db.commit()

        try:
            db.execute(text("ALTER SEQUENCE products_graude_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass

        print(f"✅ Удалено записей: {deleted}")
        print(f"📊 Записей после очистки: {db.query(GraudeProduct).count()}")

    except Exception as e:
        print(f"❌ Ошибка очистки: {e}")
        db.rollback()
    finally:
        db.close()

def extract_images_by_sheet():
    """Извлекает изображения с привязкой к листам Excel через правильный парсинг OpenXML"""
    print("=" * 70)
    print("📸 ИЗВЛЕЧЕНИЕ ИЗОБРАЖЕНИЙ ПО ЛИСТАМ (GRAUDE)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Graude
    for old_file in PHOTOS_DIR.glob("6.*.*"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("6.*.*"):
        old_file.unlink()
    print("📁 Старые фото Graude удалены")

    photos_by_sheet = {}

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            all_files = zip_ref.namelist()

            # 1. Читаем workbook.xml для получения списка листов и их rId
            if 'xl/workbook.xml' not in all_files:
                print("❌ Не найден xl/workbook.xml")
                return {}

            workbook_xml = zip_ref.read('xl/workbook.xml')
            wb_root = ET.fromstring(workbook_xml)

            ns_wb = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
                     'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

            sheets_info = []
            for sheet in wb_root.findall('.//main:sheet', ns_wb):
                name = sheet.get('name')
                r_id = sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                sheets_info.append({'name': name, 'rId': r_id})

            # 2. Читаем workbook.xml.rels для связи rId -> sheetX.xml
            if 'xl/_rels/workbook.xml.rels' not in all_files:
                print("❌ Не найден xl/_rels/workbook.xml.rels")
                return {}

            wb_rels_xml = zip_ref.read('xl/_rels/workbook.xml.rels')
            wb_rels_root = ET.fromstring(wb_rels_xml)

            rid_to_sheet_file = {}
            for rel in wb_rels_root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                rid_to_sheet_file[rel.get('Id')] = rel.get('Target')

            print(f"📄 Найдено листов в workbook: {len(sheets_info)}")

            # 3. Для каждого листа находим drawing и извлекаем картинки
            for sheet_idx, sheet_info in enumerate(sheets_info, 1):
                sheet_name = sheet_info['name']
                sheet_target = rid_to_sheet_file.get(sheet_info['rId'])
                if not sheet_target:
                    continue

                sheet_file = f'xl/{sheet_target}'
                sheet_rels_file = f'xl/worksheets/_rels/{Path(sheet_target).name}.rels'

                if sheet_rels_file not in all_files:
                    print(f"  ⚠️ Нет rels файла для листа {sheet_name}")
                    continue

                # Читаем rels листа
                sheet_rels_xml = zip_ref.read(sheet_rels_file)
                sheet_rels_root = ET.fromstring(sheet_rels_xml)

                drawing_target = None
                for rel in sheet_rels_root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                    target = rel.get('Target')
                    if target and 'drawing' in target:
                        drawing_target = target
                        break

                if not drawing_target:
                    print(f"  ⚠️ Нет drawing для листа {sheet_name}")
                    continue

                # Путь к drawing файлу (обычно ../drawings/drawingX.xml)
                drawing_name = Path(drawing_target).name
                drawing_file = f'xl/drawings/{drawing_name}'

                if drawing_file not in all_files:
                    print(f"  ⚠️ Drawing файл {drawing_file} не найден для листа {sheet_name}")
                    continue

                # Читаем drawing rels
                drawing_rels_file = f'xl/drawings/_rels/{drawing_name}.rels'

                rid_to_image = {}
                if drawing_rels_file in all_files:
                    drawing_rels_xml = zip_ref.read(drawing_rels_file)
                    drawing_rels_root = ET.fromstring(drawing_rels_xml)
                    for rel in drawing_rels_root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                        target = rel.get('Target')
                        if target and 'media' in target:
                            rid_to_image[rel.get('Id')] = Path(target).name

                # Читаем сам drawing XML
                drawing_xml = zip_ref.read(drawing_file)
                drawing_root = ET.fromstring(drawing_xml)

                ns_xdr = {'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                          'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}

                anchors = drawing_root.findall('.//xdr:twoCellAnchor', ns_xdr) + \
                          drawing_root.findall('.//xdr:oneCellAnchor', ns_xdr)

                sheet_photos = {}
                for anchor in anchors:
                    pic = anchor.find('.//xdr:pic', ns_xdr)
                    if pic is not None:
                        blip = pic.find('.//a:blip', ns_xdr)
                        if blip is not None:
                            r_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                            from_elem = anchor.find('.//xdr:from', ns_xdr)
                            if from_elem is not None:
                                row_elem = from_elem.find('.//xdr:row', ns_xdr)
                                if row_elem is not None:
                                    xml_row = int(row_elem.text)

                                    if r_id in rid_to_image:
                                        img_filename = rid_to_image[r_id]

                                        # Пропускаем векторные форматы, которые PIL не может нормально сконвертировать
                                        if img_filename.lower().endswith(('.svg', '.emf', '.wmf')):
                                            continue

                                        img_path_in_zip = f'xl/media/{img_filename}'

                                        if img_path_in_zip in all_files:
                                            img_data = zip_ref.read(img_path_in_zip)
                                            if len(img_data) > 100:
                                                converted_data, ext = convert_to_jpg(img_data)

                                                img_name = f"6.{sheet_idx}.{xml_row}.{ext}"
                                                img_path = PHOTOS_DIR / img_name
                                                with open(img_path, 'wb') as f:
                                                    f.write(converted_data)

                                                dest_path = UPLOADS_DIR / img_name
                                                shutil.copy2(img_path, dest_path)

                                                sheet_photos[xml_row] = {
                                                    'file_name': img_name,
                                                    'path': f"/uploads/products/{img_name}",
                                                    'xml_row': xml_row
                                                }
                                                print(f"  ✅ Лист {sheet_idx} ({sheet_name}), xml_row {xml_row} -> {img_name}")

                photos_by_sheet[str(sheet_idx)] = sheet_photos
                print(f"  📊 Лист {sheet_idx} ({sheet_name}): извлечено {len(sheet_photos)} фото")

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    total_photos = sum(len(photos) for photos in photos_by_sheet.values())
    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {total_photos} изображений")

    return photos_by_sheet

def read_all_sheets_with_rows():
    """Читает все листы Excel и возвращает DataFrame с информацией о строках"""
    print("\n" + "=" * 70)
    print("📄 ЧТЕНИЕ ВСЕХ ЛИСТОВ EXCEL")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return pd.DataFrame()

    xl_file = pd.ExcelFile(EXCEL_FILE)
    sheet_names = xl_file.sheet_names
    print(f"📊 Найдено листов: {len(sheet_names)}")
    print(f"📋 Листы: {sheet_names}")

    all_data = []

    for sheet_idx, sheet_name in enumerate(sheet_names, 1):
        print(f"\n📄 Обработка листа: {sheet_name} (номер: {sheet_idx})")
        try:
            df = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name, header=0)

            df['sheet_name'] = sheet_name
            df['sheet_number'] = str(sheet_idx)
            # В Excel строка 1 - заголовок. Данные начинаются со строки 2.
            # В pandas idx=0 соответствует строке 2 в Excel.
            # В XML xdr:row для строки 2 равен 1 (так как 0-based).
            # Значит xml_row = idx + 1
            df['excel_row'] = range(2, len(df) + 2)
            df['xml_row'] = df['excel_row'] - 1  # = idx + 1

            print(f"  📊 Строк: {len(df)}, колонок: {list(df.columns)}")
            all_data.append(df)
        except Exception as e:
            print(f"  ⚠️ Ошибка чтения листа {sheet_name}: {e}")

    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        print(f"\n✅ Всего строк данных: {len(combined_df)}")
        return combined_df
    else:
        return pd.DataFrame()

def load_products_to_db(photos_by_sheet):
    """Загрузка товаров Graude в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ GRAUDE В БАЗУ ДАННЫХ")
    print("=" * 70)

    # Читаем все листы
    df = read_all_sheets_with_rows()

    if df.empty:
        print("❌ Нет данных для загрузки")
        return

    print(f"📊 Доступные колонки: {list(df.columns)}")

    db = SessionLocal()

    try:
        # Получаем или создаем бренд Graude
        brand = db.query(Brand).filter(Brand.id == GRAUDE_BRAND_ID).first()
        if not brand:
            brand = Brand(id=GRAUDE_BRAND_ID, name='Graude')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Graude (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Graude (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам
        for idx, row in df.iterrows():
            # Получаем артикул (SKU)
            sku = None
            for col_name in ['Артикул', 'артикул', 'SKU', 'sku']:
                if col_name in row and pd.notna(row[col_name]):
                    sku = clean_string(row[col_name])
                    if sku:
                        break

            # Получаем наименование
            name = None
            for col_name in ['Наименование', 'наименование', 'Name', 'name']:
                if col_name in row and pd.notna(row[col_name]):
                    name = clean_string(row[col_name])
                    if name:
                        break

            if not name or pd.isna(name):
                print(f"⚠️ Строка {row.get('excel_row')}: пропущено (нет наименования)")
                skipped_count += 1
                continue

            # Получаем category_id
            category_id = None
            if 'category_id' in row and pd.notna(row['category_id']):
                try:
                    category_id = int(float(row['category_id']))
                    # ПРОВЕРКА: существует ли категория
                    category_exists = db.query(Category).filter(Category.id == category_id).first()
                    if not category_exists:
                        print(f"  ⚠️ Категория {category_id} не существует, устанавливаем NULL")
                        category_id = None
                except:
                    category_id = None

            # Получаем номер листа и строки для поиска фото
            sheet_num = str(row.get('sheet_number'))
            xml_row = row.get('xml_row')

            # Пытаемся найти фото (с умным fallback)
            photo_path = None
            if sheet_num in photos_by_sheet:
                sheet_photos = photos_by_sheet[sheet_num]

                # 1. Точное совпадение
                if xml_row in sheet_photos:
                    photo_path = sheet_photos[xml_row]['path']
                # 2. Fallback: картинка могла "уехать" на строку заголовка (xml_row - 1) или на строку ниже (xml_row + 1)
                elif (xml_row - 1) in sheet_photos:
                    photo_path = sheet_photos[xml_row - 1]['path']
                elif (xml_row + 1) in sheet_photos:
                    photo_path = sheet_photos[xml_row + 1]['path']

            if photo_path:
                print(f"  📷 Лист {sheet_num}, строка {xml_row}: {name[:40]}... -> ЕСТЬ фото")
            else:
                print(f"  ⚠️ Лист {sheet_num}, строка {xml_row}: {name[:40]}... -> НЕТ фото")

            # Получаем описание
            description = None
            for col_name in ['Описание', 'описание', 'Description', 'description']:
                if col_name in row and pd.notna(row[col_name]):
                    description = clean_string(row[col_name])
                    if description:
                        break

            # Получаем цену
            price_public = None
            for col_name in ['РРЦ, руб', 'РРЦ', 'price_public', 'Price']:
                if col_name in row and pd.notna(row[col_name]):
                    price_public = clean_price(row[col_name])
                    if price_public:
                        break

            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'sku': sku,
                'name': name,
                'main_image': photo_path,
                'description': description,
                'price_public': price_public
            }

            # Проверяем, существует ли товар с таким SKU
            existing = None
            if sku:
                existing = db.query(GraudeProduct).filter(
                    GraudeProduct.sku == sku
                ).first()

            if existing:
                for key, value in product_data.items():
                    if value is not None:
                        setattr(existing, key, value)
                existing.updated_at = text('CURRENT_TIMESTAMP')
                updated_count += 1
            else:
                new_product = GraudeProduct(**product_data)
                db.add(new_product)
                new_count += 1

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено: {skipped_count}")
        print(f"   📦 Всего товаров в БД: {db.query(GraudeProduct).count()}")
        print(f"   📷 Товаров с фото: {db.query(GraudeProduct).filter(GraudeProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ GRAUDE")
    print("=" * 70)

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем фото по листам
    photos_by_sheet = extract_images_by_sheet()

    total_photos = sum(len(photos) for photos in photos_by_sheet.values())
    if total_photos > 0:
        print(f"\n✅ Найдено {total_photos} фото")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены!")

    # Загружаем товары в БД
    load_products_to_db(photos_by_sheet)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)