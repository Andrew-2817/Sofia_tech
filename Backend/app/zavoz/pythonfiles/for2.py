#!/usr/bin/env python3
"""Извлечение изображений из Excel файла и загрузка товаров Schulthess в БД"""

import sys
import re
import zipfile
import shutil
from pathlib import Path
from PIL import Image
import io
import xml.etree.ElementTree as ET

# Пути
BASE_DIR = Path('C:/vs code/Sofia_tech')
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_2.xlsx'
PHOTOS_DIR = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'photos'
UPLOADS_DIR = BASE_DIR / 'Backend' / 'static' / 'uploads' / 'products'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_schulthess import SchulthessProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
from sqlalchemy import text
import pandas as pd

# ID бренда Schulthess
SCHULTHESS_BRAND_ID = 2

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
    """Очистка таблицы products_schulthess перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_schulthess")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(SchulthessProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(SchulthessProduct).delete()
        db.commit()

        # Сброс последовательности для PostgreSQL
        try:
            db.execute(text("ALTER SEQUENCE products_schulthess_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(SchulthessProduct).count()
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
            
            if ('id' in row_values or 'модель' in row_values or 
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
    print("📸 ИЗВЛЕЧЕНИЕ ВСЕХ ИЗОБРАЖЕНИЙ ПО ПОРЯДКУ (SCHULTHESS)")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ ФАЙЛ НЕ НАЙДЕН: {EXCEL_FILE}")
        return {}

    print(f"✅ Файл найден: {EXCEL_FILE.name}")
    print(f"📄 Размер файла: {EXCEL_FILE.stat().st_size / 1024 / 1024:.2f} MB")

    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Очищаем старые фото Schulthess
    for old_file in PHOTOS_DIR.glob("2.*.jpg"):
        old_file.unlink()
    for old_file in UPLOADS_DIR.glob("2.*.jpg"):
        old_file.unlink()
    print("📁 Старые фото Schulthess удалены")

    photo_by_row = {}

    try:
        with zipfile.ZipFile(EXCEL_FILE, 'r') as zip_ref:
            # Выводим все файлы в архиве для отладки
            all_files = zip_ref.namelist()
            print(f"📁 Всего файлов в архиве: {len(all_files)}")
            
            # Ищем все возможные изображения в разных местах
            media_files = [f for f in all_files if 'media' in f.lower()]
            print(f"📸 Найдено файлов в xl/media: {len(media_files)}")
            
            # Также ищем в других местах
            other_images = [f for f in all_files if any(ext in f.lower() for ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp'])]
            print(f"📸 Найдено изображений в других папках: {len(other_images)}")
            
            # Объединяем все изображения
            all_images = list(set(media_files + other_images))
            print(f"📸 Всего уникальных изображений: {len(all_images)}")
            
            if not all_images:
                print("⚠️ В архиве не найдено изображений!")
                print("📋 Первые 20 файлов в архиве:")
                for f in all_files[:20]:
                    print(f"   - {f}")
                return {}

            # Подготавливаем словарь изображений
            image_files = {}
            for file_name in all_images:
                img_name = Path(file_name).stem
                # Извлекаем номер изображения
                img_id = re.search(r'image(\d+)', img_name, re.IGNORECASE)
                img_num = int(img_id.group(1)) if img_id else 0
                image_files[file_name] = {'num': img_num, 'name': file_name}
                print(f"  📸 Найдено изображение: {file_name} (номер: {img_num})")

            # Ищем все drawing файлы (они содержат информацию о позициях фото)
            drawing_files = [f for f in all_files if 'xl/drawings/drawing' in f and f.endswith('.xml')]
            print(f"\n📄 Найдено drawing файлов: {len(drawing_files)}")
            
            if not drawing_files:
                print("⚠️ Drawing файлы не найдены! Фото могут быть вставлены как OLE-объекты.")
                print("📋 Пробуем альтернативный метод извлечения...")

            # Собираем все фото с их позициями
            photos_with_positions = []

            # Метод 1: Из XML drawing файлов
            for drawing_file in drawing_files:
                try:
                    xml_content = zip_ref.read(drawing_file)
                    root = ET.fromstring(xml_content)
                    
                    print(f"\n📄 Обработка {drawing_file}...")
                    
                    namespaces = {
                        'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
                        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
                    }
                    
                    # Ищем все anchors
                    anchors = root.findall('.//xdr:twoCellAnchor', namespaces) + \
                             root.findall('.//xdr:oneCellAnchor', namespaces) + \
                             root.findall('.//xdr:absoluteAnchor', namespaces)
                    
                    print(f"  Найдено anchors: {len(anchors)}")
                    
                    for anchor in anchors:
                        pic = anchor.find('.//xdr:pic', namespaces)
                        if pic is not None:
                            blip = pic.find('.//a:blip', namespaces)
                            if blip is not None:
                                r_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                                
                                # Пытаемся найти информацию о строке
                                row_num = None
                                from_elem = anchor.find('.//xdr:from', namespaces)
                                if from_elem is not None:
                                    row_elem = from_elem.find('.//xdr:row', namespaces)
                                    if row_elem is not None:
                                        row_num = int(row_elem.text)
                                
                                if row_num is not None:
                                    photos_with_positions.append({
                                        'r_id': r_id,
                                        'xml_row': row_num,
                                        'drawing_file': drawing_file
                                    })
                                    print(f"    Найдено фото: row={row_num}, rId={r_id}")
                                    
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {drawing_file}: {e}")
                    import traceback
                    traceback.print_exc()

            # Метод 2: Если нет информации о позициях, пробуем сопоставить по порядку
            if not photos_with_positions and all_images:
                print("\n⚠️ Не удалось определить позиции фото. Используем порядок файлов.")
                # Сортируем изображения по имени
                sorted_images = sorted(all_images, key=lambda x: x.lower())
                for idx, img_file in enumerate(sorted_images):
                    # Предполагаем, что фото идут в том же порядке, что и строки
                    photos_with_positions.append({
                        'r_id': None,
                        'xml_row': idx,  # Используем индекс как номер строки
                        'drawing_file': 'unknown',
                        'img_file': img_file
                    })
                    print(f"  📸 Фото {idx + 1}: {img_file}")

            # Читаем связи rId -> имя файла
            rels_files = [f for f in all_files if '_rels' in f and 'drawing' in f and f.endswith('.rels')]
            rid_to_filename = {}

            for rels_file in rels_files:
                try:
                    xml_content = zip_ref.read(rels_file)
                    root = ET.fromstring(xml_content)
                    for rel in root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                        rel_id = rel.get('Id')
                        target = rel.get('Target')
                        if target and ('media' in target or 'image' in target or any(ext in target.lower() for ext in ['.png', '.jpg', '.jpeg'])):
                            filename = Path(target).name
                            rid_to_filename[rel_id] = filename
                            print(f"  🔗 Связь: {rel_id} -> {filename}")
                except Exception as e:
                    print(f"  ⚠️ Ошибка парсинга {rels_file}: {e}")

            # Извлекаем фото
            print(f"\n📸 Извлечение {len(photos_with_positions)} фото...")
            
            for idx, photo_info in enumerate(photos_with_positions):
                try:
                    # Получаем имя файла изображения
                    img_filename = None
                    
                    if photo_info.get('r_id') and photo_info['r_id'] in rid_to_filename:
                        img_filename = rid_to_filename[photo_info['r_id']]
                    elif photo_info.get('img_file'):
                        img_filename = Path(photo_info['img_file']).name
                    else:
                        # Пробуем найти по индексу
                        if idx < len(all_images):
                            img_filename = Path(all_images[idx]).name
                    
                    if not img_filename:
                        print(f"  ⚠️ Не удалось определить файл для фото {idx}")
                        continue
                    
                    # Находим полный путь к файлу в архиве
                    img_path_in_zip = None
                    for file_path in image_files.keys():
                        if Path(file_path).name == img_filename:
                            img_path_in_zip = file_path
                            break
                    
                    if img_path_in_zip:
                        img_data = zip_ref.read(img_path_in_zip)
                        if len(img_data) > 100:
                            converted_data, ext = convert_to_jpg(img_data)
                            
                            # Номер строки (0-индекс -> 1-индекс)
                            excel_row_number = photo_info['xml_row'] + 1
                            
                            img_name = f"2.{excel_row_number-1}.jpg"
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
                                'xml_row': photo_info['xml_row']
                            }
                            print(f"  ✅ Извлечено: фото для строки {excel_row_number} -> {img_name} (файл: {img_filename})")
                    else:
                        print(f"  ⚠️ Файл не найден в архиве: {img_filename}")
                        
                except Exception as e:
                    print(f"  ❌ Ошибка при извлечении фото {idx}: {e}")

    except Exception as e:
        print(f"❌ Ошибка при обработке: {e}")
        import traceback
        traceback.print_exc()
        return {}

    print(f"\n📊 ИТОГО ИЗВЛЕЧЕНО: {len(photo_by_row)} изображений")
    
    if photo_by_row:
        print("\n📋 Соответствие строк и фото:")
        for row_num in sorted(photo_by_row.keys())[:20]:  # Показываем первые 20
            print(f"   Строка {row_num} -> {photo_by_row[row_num]['file_name']}")
        if len(photo_by_row) > 20:
            print(f"   ... и еще {len(photo_by_row) - 20} фото")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не были извлечены!")
        print("📋 Возможные причины:")
        print("   1. Фото вставлены как ссылки, а не как встроенные объекты")
        print("   2. Файл Excel защищен или имеет特殊ный формат")
        print("   3. Фото находятся в другом месте архива")

    return photo_by_row
def load_products_to_db(photo_by_row):
    """Загрузка товаров Schulthess в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ SCHULTHESS В БАЗУ ДАННЫХ")
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
        # Получаем или создаем бренд Schulthess
        brand = db.query(Brand).filter(Brand.id == SCHULTHESS_BRAND_ID).first()
        if not brand:
            brand = Brand(id=SCHULTHESS_BRAND_ID, name='Schulthess')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Schulthess (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Schulthess (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам Excel
        for idx, row in df.iterrows():
            # Реальный номер строки в Excel
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
            for col_name in ['ID_категории', 'id_категории', 'Category ID', 'category_id']:
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
            for col_name in ['РРЦ Рубли', 'РРЦ', 'Price', 'price']:
                if col_name in row:
                    price = clean_price(row[col_name])
                    if price > 0:
                        break
            
            # Получаем модель
            model = None
            for col_name in ['Модель', 'модель', 'Model', 'model']:
                if col_name in row:
                    model = clean_string(row[col_name])
                    if model:
                        break

            # Получаем навеску дверцы
            door_hinge = None
            for col_name in ['Навеска дверцы', 'навеска дверцы', 'Door hinge', 'door_hinge']:
                if col_name in row:
                    door_hinge = clean_string(row[col_name])
                    if door_hinge:
                        break

            # Получаем группу товара
            product_group = None
            for col_name in ['Группа товара', 'группа товара', 'Product group', 'product_group']:
                if col_name in row:
                    product_group = clean_string(row[col_name])
                    if product_group:
                        break

            # Получаем цвет
            color = None
            for col_name in ['Цвет', 'цвет', 'Color', 'color']:
                if col_name in row:
                    color = clean_string(row[col_name])
                    if color:
                        break

            # Получаем программы
            programs = None
            for col_name in ['Программы', 'программы', 'Programs', 'programs']:
                if col_name in row:
                    programs = clean_string(row[col_name])
                    if programs:
                        break

            # Получаем описание
            description = None
            for col_name in ['Описание', 'описание', 'Description', 'description']:
                if col_name in row:
                    description = clean_string(row[col_name])
                    if description:
                        break

            # Получаем комментарий
            comment = None
            for col_name in ['Комментарий', 'комментарий', 'Comment', 'comment']:
                if col_name in row:
                    comment = clean_string(row[col_name])
                    if comment:
                        break

            # Данные товара
            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'model': model,
                'door_hinge': door_hinge,
                'product_group': product_group,
                'name': name,
                'color': color,
                'main_image': photo_path,
                'programs': programs,
                'description': description,
                'price': price if price > 0 else 0,
                'comment': comment,
                'width': clean_float(row.get('Ширина упаковки (м)')),
                'height': clean_float(row.get('Высота упаковки (м)')),
                'depth': clean_float(row.get('Глубина упаковки (м)')),
                'volume': clean_float(row.get('Объем (м3) упаковки')),
                'gross_weight': clean_float(row.get('Вес брутто, кг'))
            }

            # Проверяем, существует ли товар с такой моделью
            existing = None
            if product_data['model']:
                existing = db.query(SchulthessProduct).filter(
                    SchulthessProduct.model == product_data['model']
                ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {name[:40]}")
            else:
                new_product = SchulthessProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:40]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров Schulthess: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено (пустые строки): {skipped_count}")
        print(f"   📷 Всего фото в папке: {len(photo_by_row)}")
        print(f"   📦 Всего товаров Schulthess в БД: {db.query(SchulthessProduct).count()}")
        print(f"   📷 Фото в БД: {db.query(SchulthessProduct).filter(SchulthessProduct.main_image.isnot(None)).count()}")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ SCHULTHESS И ФОТО")
    print("=" * 70)

    # Очищаем таблицу
    cleanup_products_table()

    # Извлекаем все фото в порядке их следования
    photos_by_row = extract_all_images_with_order()

    if photos_by_row:
        print(f"\n✅ Найдено {len(photos_by_row)} фото для Schulthess")
    else:
        print("\n⚠️ ВНИМАНИЕ: Фото не найдены! Проверьте Excel файл.")

    # Загружаем товары в БД
    load_products_to_db(photos_by_row)

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)