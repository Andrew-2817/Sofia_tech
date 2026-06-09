#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Elica в БД"""

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
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_14.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_elica import ElicaProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
from sqlalchemy import text
import pandas as pd

# ID бренда Elica
ELICA_BRAND_ID = 14

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
    """Очистка таблицы products_elica перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_elica")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(ElicaProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(ElicaProduct).delete()
        db.commit()

        # Сброс последовательности для PostgreSQL
        try:
            db.execute(text("ALTER SEQUENCE products_elica_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(ElicaProduct).count()
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

            if ('id' in row_values or 'название' in row_values or
                'model' in row_values or 'description' in row_values):
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
    print("📸 ИЗВЛЕЧЕНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ПО ПОРЯДКУ (ELICA)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Elica
    for old_file in PHOTOS_DIR.glob("14.*.jpg"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("14.*.jpg"):
        old_file.unlink()
    print("📁 Старые фото Elica удалены")

    photo_by_row = {}

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            # Получаем список всех файлов
            all_files = zip_ref.namelist()

            # Находим все изображения в xl/media/
            media_files = []
            for file_name in all_files:
                if file_name.startswith('xl/media/'):
                    file_lower = file_name.lower()
                    if any(ext in file_lower for ext in ['.png', '.jpg', '.jpeg', '.gif']):
                        media_files.append(file_name)

            print(f"📸 Найдено медиа файлов: {len(media_files)}")
            for f in media_files:
                print(f"  📸 {Path(f).name}")

            if not media_files:
                print("⚠️ Изображения не найдены!")
                return {}

            # Находим drawing файл
            drawing_file = None
            for f in all_files:
                if 'xl/drawings/drawing' in f and f.endswith('.xml'):
                    drawing_file = f
                    break

            if not drawing_file:
                print("⚠️ Drawing файл не найден, используем простой порядок фото")
                # Просто извлекаем все фото по порядку
                for idx, img_file in enumerate(media_files, 1):
                    try:
                        img_data = zip_ref.read(img_file)
                        if len(img_data) > 100:
                            converted_data, ext = convert_to_jpg(img_data)
                            img_name = f"14.{idx}.jpg"
                            img_path = PHOTOS_DIR / img_name
                            with open(img_path, 'wb') as f:
                                f.write(converted_data)
                            dest_path = UPLOADS_DIR / img_name
                            shutil.copy2(img_path, dest_path)
                            photo_by_row[idx] = {
                                'file_name': img_name,
                                'path': f"/uploads/products/{img_name}",
                                'row': idx,
                                'original': Path(img_file).name
                            }
                            print(f"  ✅ Извлечено: фото {idx} -> {img_name}")
                    except Exception as e:
                        print(f"  ❌ Ошибка при извлечении {img_file}: {e}")
                return photo_by_row

            print(f"\n📄 Найден drawing файл: {drawing_file}")

            # Читаем drawing.xml для получения номеров строк
            xml_content = zip_ref.read(drawing_file)
            root = ET.fromstring(xml_content)

            namespaces = {
                'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            }

            # Собираем номера строк в том порядке, в котором идут фото
            # Пробуем разные типы anchor
            row_numbers = []

            # Пробуем все типы anchor
            for anchor_type in ['.//xdr:twoCellAnchor', './/xdr:oneCellAnchor', './/xdr:absoluteAnchor']:
                for anchor in root.findall(anchor_type, namespaces):
                    # Пробуем найти строку в разных местах
                    xml_row = None

                    # Способ 1: из from/row
                    from_elem = anchor.find('.//xdr:from', namespaces)
                    if from_elem is not None:
                        row_elem = from_elem.find('.//xdr:row', namespaces)
                        if row_elem is not None:
                            xml_row = int(row_elem.text)
                            print(f"  📍 Найдена строка (from): {xml_row}")

                    # Способ 2: из to/row (для absoluteAnchor)
                    if xml_row is None:
                        to_elem = anchor.find('.//xdr:to', namespaces)
                        if to_elem is not None:
                            row_elem = to_elem.find('.//xdr:row', namespaces)
                            if row_elem is not None:
                                xml_row = int(row_elem.text)
                                print(f"  📍 Найдена строка (to): {xml_row}")

                    # Способ 3: из позиции (rowOff)
                    if xml_row is None:
                        row_off = anchor.find('.//xdr:rowOff', namespaces)
                        if row_off is not None:
                            # Для absoluteAnchor строка может быть в другом месте
                            pass

                    if xml_row is not None:
                        row_numbers.append(xml_row)

            # Если всё равно не нашли строки, используем порядковые номера
            if not row_numbers:
                print("⚠️ Не удалось найти номера строк в drawing файле")
                print("📋 Используем порядковые номера для фото")
                row_numbers = list(range(len(media_files)))

            print(f"\n📸 Найдено строк с фото: {len(row_numbers)}")

            # Сортируем media_files по имени для соответствия порядку
            media_files.sort(key=lambda x: x.lower())

            # Извлекаем фото и сопоставляем с номерами строк по порядку
            for idx, (img_file, xml_row) in enumerate(zip(media_files, row_numbers)):
                try:
                    img_data = zip_ref.read(img_file)
                    if len(img_data) > 100:
                        converted_data, ext = convert_to_jpg(img_data)

                        # Номер строки в Excel (начиная с 1)
                        excel_row_number = xml_row + 1

                        img_name = f"14.{excel_row_number}.jpg"
                        img_path = PHOTOS_DIR / img_name
                        with open(img_path, 'wb') as f:
                            f.write(converted_data)

                        dest_path = UPLOADS_DIR / img_name
                        shutil.copy2(img_path, dest_path)

                        photo_by_row[excel_row_number] = {
                            'file_name': img_name,
                            'path': f"/uploads/products/{img_name}",
                            'row': excel_row_number,
                            'original': Path(img_file).name,
                            'xml_row': xml_row
                        }
                        print(f"  ✅ Извлечено: фото для строки {excel_row_number} -> {img_name}")
                except Exception as e:
                    print(f"  ❌ Ошибка при извлечении {img_file}: {e}")

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

    return photo_by_row

def load_products_to_db(photo_by_row):
    """Загрузка товаров Elica в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ ELICA В БАЗУ ДАННЫХ")
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
        # Получаем или создаем бренд Elica
        brand = db.query(Brand).filter(Brand.id == ELICA_BRAND_ID).first()
        if not brand:
            brand = Brand(id=ELICA_BRAND_ID, name='Elica')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Elica (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Elica (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам Excel
        for idx, row in df.iterrows():
            # Реальный номер строки в Excel
            excel_row_num = idx + header_row + 2

            # Получаем наименование товара (обязательное поле)
            name = None
            for col_name in ['Название', 'название', 'Name', 'NAME', 'name', 'Наименование']:
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
            for col_name in ['category_id', 'Category ID', 'id_категории', 'ID_категории']:
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

            # Получаем Type of Price
            type_of_price = None
            for col_name in ['Type of Price', 'type_of_price', 'Тип цены']:
                if col_name in row:
                    type_of_price = clean_string(row[col_name])
                    if type_of_price:
                        break

            # Получаем модель
            model = None
            for col_name in ['Model', 'model', 'Модель']:
                if col_name in row:
                    model = clean_string(row[col_name])
                    if model:
                        break

            # Получаем Actual code
            actual_code = None
            for col_name in ['Actual code', 'actual_code', 'Код', 'Артикул']:
                if col_name in row:
                    actual_code = clean_string(row[col_name])
                    if actual_code:
                        break

            # Получаем описание
            description = None
            for col_name in ['Description', 'description', 'Описание']:
                if col_name in row:
                    description = clean_string(row[col_name])
                    if description:
                        break

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'type_of_price': type_of_price,
                'name': name,
                'main_image': photo_path,
                'model': model,
                'actual_code': actual_code,
                'description': description
            }

            # Проверяем, существует ли товар с такой моделью или actual_code
            existing = None
            if product_data['model']:
                existing = db.query(ElicaProduct).filter(
                    ElicaProduct.model == product_data['model']
                ).first()

            if not existing and product_data['actual_code']:
                existing = db.query(ElicaProduct).filter(
                    ElicaProduct.actual_code == product_data['actual_code']
                ).first()

            if not existing and product_data['name']:
                existing = db.query(ElicaProduct).filter(
                    ElicaProduct.name == product_data['name']
                ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {name[:40]}")
            else:
                new_product = ElicaProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:40]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Elica: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено (пустые строки): {skipped_count}")
        print(f"   📷 Всего фото в папке: {len(photo_by_row)}")
        print(f"   📦 Всего товаров Elica в БД: {db.query(ElicaProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(ElicaProduct).filter(ElicaProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ ELICA И ФОТО")
    print("=" * 70)

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем все фото в порядке их следования
    photos_by_row = extract_all_images_with_order()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото для Elica")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены! Проверьте Excel файл.")

    # Загружаем товары в БД
    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)