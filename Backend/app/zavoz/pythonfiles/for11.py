#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Bonkrasher в БД"""

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
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_11.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_bonkrasher import BonkrasherProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
from sqlalchemy import text
import pandas as pd

# ID бренда Bonkrasher
BONKRASHER_BRAND_ID = 11

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
    """Очистка таблицы products_bonkrasher перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_bonkrasher")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(BonkrasherProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(BonkrasherProduct).delete()
        db.commit()

        # Сброс последовательности для PostgreSQL
        try:
            db.execute(text("ALTER SEQUENCE products_bonkrasher_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(BonkrasherProduct).count()
        print(f"📊 Записей после очистки: {count_after}")

    except Exception as e:
        print(f"❌ Ошибка очистки: {e}")
        db.rollback()
    finally:
        db.close()

def find_header_row(file_path):
    """Находит строку с заголовками в Excel файле"""
    try:
        df_preview = pd.read_excel(file_path, header=None, nrows=20)

        for idx, row in df_preview.iterrows():
            row_values = [str(v).lower() for v in row.values if pd.notna(v)]

            if ('id' in row_values or 'наименование' in row_values or
                'артикул' in row_values or 'ррц' in row_values):
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
    print("📸 ИЗВЛЕЧЕНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ПО ПОРЯДКУ (BONKRASHER)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Bonkrasher
    for old_file in PHOTOS_DIR.glob("11.*.jpg"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("11.*.jpg"):
        old_file.unlink()
    print("📁 Старые фото Bonkrasher удалены")

    photo_by_row = {}

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            # Получаем список всех файлов
            all_files = zip_ref.namelist()

            # Находим все изображения в xl/media/
            image_files = {}
            media_files = [f for f in all_files if f.startswith('xl/media/')]
            print(f"📸 Найдено медиа файлов: {len(media_files)}")

            for file_name in media_files:
                file_lower = file_name.lower()
                if any(ext in file_lower for ext in ['.png', '.jpg', '.jpeg', '.gif']):
                    image_files[file_name] = {
                        'name': file_name,
                        'filename': Path(file_name).name
                    }
                    print(f"  📸 {Path(file_name).name}")

            # Находим drawing файл
            drawing_file = None
            for f in all_files:
                if 'xl/drawings/drawing' in f and f.endswith('.xml'):
                    drawing_file = f
                    break

            if not drawing_file:
                print("⚠️ Drawing файл не найден! Фото могут быть вставлены как OLE-объекты.")
                print("📋 Пробуем извлечь все изображения без привязки к строкам...")

                # Если нет drawing файла, просто извлекаем все фото
                for idx, file_name in enumerate(media_files, 1):
                    try:
                        img_data = zip_ref.read(file_name)
                        if len(img_data) > 100:
                            converted_data, ext = convert_to_jpg(img_data)

                            # Сохраняем фото с порядковым номером
                            img_name = f"11.{idx}.jpg"
                            img_path = PHOTOS_DIR / img_name
                            with open(img_path, 'wb') as f:
                                f.write(converted_data)

                            dest_path = UPLOADS_DIR / img_name
                            shutil.copy2(img_path, dest_path)

                            # Используем порядковый номер как номер строки
                            photo_by_row[idx] = {
                                'file_name': img_name,
                                'path': f"/uploads/products/{img_name}",
                                'row': idx,
                                'original': Path(file_name).name
                            }
                            print(f"  ✅ Извлечено: фото {idx} -> {img_name}")
                    except Exception as e:
                        print(f"  ❌ Ошибка при извлечении {file_name}: {e}")

                return photo_by_row

            print(f"\n📄 Найден drawing файл: {drawing_file}")

            # Читаем drawing.xml для получения позиций фото
            xml_content = zip_ref.read(drawing_file)
            root = ET.fromstring(xml_content)

            namespaces = {
                'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            }

            # Находим файл связей - пробуем разные варианты пути
            rid_to_filename = {}

            # Вариант 1: стандартный путь
            rels_file1 = drawing_file.replace('.xml', '.rels').replace('xl/drawings/', 'xl/drawings/_rels/')
            # Вариант 2: связи в той же папке
            rels_file2 = drawing_file.replace('.xml', '.rels')
            # Вариант 3: ищем в корне _rels
            rels_file3 = f"xl/_rels/{Path(drawing_file).name}.rels"

            rels_file = None
            for test_file in [rels_file1, rels_file2, rels_file3]:
                try:
                    zip_ref.getinfo(test_file)
                    rels_file = test_file
                    print(f"📄 Найден файл связей: {rels_file}")
                    break
                except:
                    continue

            if rels_file:
                try:
                    rels_content = zip_ref.read(rels_file)
                    rels_root = ET.fromstring(rels_content)
                    for rel in rels_root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                        rel_id = rel.get('Id')
                        target = rel.get('Target')
                        if target:
                            # Извлекаем имя файла из пути
                            filename = Path(target).name
                            rid_to_filename[rel_id] = filename
                            print(f"  🔗 Связь: {rel_id} -> {filename}")
                except Exception as e:
                    print(f"  ⚠️ Ошибка чтения файла связей: {e}")
            else:
                print(f"  ⚠️ Файл связей не найден! Пробуем альтернативный метод...")



            # Собираем все фото с их позициями
            photos_with_positions = []

            # Ищем все anchor элементы (поддерживаем разные типы)
            for anchor in root.findall('.//xdr:twoCellAnchor', namespaces) + \
                         root.findall('.//xdr:oneCellAnchor', namespaces) + \
                         root.findall('.//xdr:absoluteAnchor', namespaces):

                # Получаем номер строки
                row_num = None
                from_elem = anchor.find('.//xdr:from', namespaces)
                if from_elem is not None:
                    row_elem = from_elem.find('.//xdr:row', namespaces)
                    if row_elem is not None:
                        row_num = int(row_elem.text)

                if row_num is not None:
                    # Получаем rId изображения
                    pic = anchor.find('.//xdr:pic', namespaces)
                    if pic is not None:
                        blip = pic.find('.//a:blip', namespaces)
                        if blip is not None:
                            r_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')

                            photos_with_positions.append({
                                'r_id': r_id,
                                'xml_row': row_num
                            })
                            print(f"  📍 Найдено фото: строка {row_num}, rId={r_id}")

            print(f"\n📸 Найдено фото с позициями: {len(photos_with_positions)}")


                        # Альтернативный метод: ищем соответствие по порядку
            # Сортируем фото по имени и сопоставляем с rId по порядку
            sorted_images = sorted(image_files.keys(), key=lambda x: image_files[x]['filename'])
            rids = list(set([p['r_id'] for p in photos_with_positions]))

            for idx, rid in enumerate(rids):
                if idx < len(sorted_images):
                    img_filename = Path(sorted_images[idx]).name
                    rid_to_filename[rid] = img_filename
                    print(f"  🔗 (альт) Связь: {rid} -> {img_filename}")

            # Извлекаем фото
            extracted_count = 0
            for photo_info in photos_with_positions:
                rid = photo_info['r_id']
                xml_row = photo_info['xml_row']

                if rid in rid_to_filename:
                    img_filename = rid_to_filename[rid]

                    # Находим файл в image_files
                    img_path_in_zip = None
                    for file_path in image_files.keys():
                        if image_files[file_path]['filename'] == img_filename:
                            img_path_in_zip = file_path
                            break

                    if img_path_in_zip:
                        try:
                            img_data = zip_ref.read(img_path_in_zip)
                            if len(img_data) > 100:
                                converted_data, ext = convert_to_jpg(img_data)

                                # Номер строки в Excel (начиная с 1)
                                excel_row_number = xml_row

                                img_name = f"11.{excel_row_number}.jpg"
                                img_path = PHOTOS_DIR / img_name
                                with open(img_path, 'wb') as f:
                                    f.write(converted_data)

                                dest_path = UPLOADS_DIR / img_name
                                shutil.copy2(img_path, dest_path)

                                photo_by_row[excel_row_number] = {
                                    'file_name': img_name,
                                    'path': f"/uploads/products/{img_name}",
                                    'row': excel_row_number,
                                    'original': img_filename,
                                    'xml_row': xml_row
                                }
                                extracted_count += 1
                                print(f"  ✅ Извлечено: фото для строки {excel_row_number} -> {img_name}")
                        except Exception as e:
                            print(f"  ❌ Ошибка при извлечении {img_filename}: {e}")
                    else:
                        print(f"  ⚠️ Файл не найден: {img_filename}")
                else:
                    print(f"  ⚠️ Не найден rId={rid} в связях")

            print(f"\n📸 Успешно извлечено фото: {extracted_count}")

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {len(photo_by_row)} изображений")

    if photo_by_row:
        print("\n📋 Соответствие строк и фото:")
        for row_num in sorted(photo_by_row.keys())[:20]:
            print(f"   Строка {row_num} -> {photo_by_row[row_num]['file_name']}")
        if len(photo_by_row) > 20:
            print(f"   ... и еще {len(photo_by_row) - 20} фото")

    return photo_by_row

def load_products_to_db(photo_by_row):
    """Загрузка товаров Bonkrasher в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ BONKRASHER В БАЗУ ДАННЫХ")
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
        # Получаем или создаем бренд Bonkrasher
        brand = db.query(Brand).filter(Brand.id == BONKRASHER_BRAND_ID).first()
        if not brand:
            brand = Brand(id=BONKRASHER_BRAND_ID, name='Bonkrasher')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Bonkrasher (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Bonkrasher (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам Excel
        for idx, row in df.iterrows():
            # Реальный номер строки в Excel
            excel_row_num = idx + header_row + 2

            # Получаем наименование товара (обязательное поле)
            name = None
            for col_name in ['Наименование', 'наименование', 'Name', 'NAME', 'name', 'Наименование товара']:
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
            for col_name in ['ID_категории', 'id_категории', 'Category ID', 'category_id', 'ID']:
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
            for col_name in ['РРЦ', 'РРЦ Рубли', 'Price', 'price', 'Цена']:
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

            # Получаем функционал
            functionality = None
            for col_name in ['Функционал', 'функционал', 'Functionality', 'functionality', 'Описание']:
                if col_name in row:
                    functionality = clean_string(row[col_name])
                    if functionality:
                        break

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'name': name,
                'sku': sku,
                'price': price if price > 0 else 0,
                'main_image': photo_path,
                'functionality': functionality
            }

            # Проверяем, существует ли товар с таким артикулом или именем
            existing = None
            if product_data['sku']:
                existing = db.query(BonkrasherProduct).filter(
                    BonkrasherProduct.sku == product_data['sku']
                ).first()

            if not existing and product_data['name']:
                existing = db.query(BonkrasherProduct).filter(
                    BonkrasherProduct.name == product_data['name']
                ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {name[:40]}")
            else:
                new_product = BonkrasherProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:40]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Bonkrasher: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено (пустые строки): {skipped_count}")
        print(f"   📷 Всего фото в папке: {len(photo_by_row)}")
        print(f"   📦 Всего товаров Bonkrasher в БД: {db.query(BonkrasherProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(BonkrasherProduct).filter(BonkrasherProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ BONKRASHER И ФОТО")
    print("=" * 70)

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем все фото в порядке их следования
    photos_by_row = extract_all_images_with_order()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото для Bonkrasher")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены! Проверьте Excel файл.")

    # Загружаем товары в БД
    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)