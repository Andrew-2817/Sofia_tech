#!/usr/bin/env python3
"""Загрузка товаров Teka в БД (без фото)"""

import sys
import re
from pathlib import Path

# Пути
BASE_DIR = Path('/home/raul/projects/sofa2/Sofia_tech')
EXCEL_FILE = BASE_DIR / 'Backend' / 'app' / 'zavoz' / 'exelfiles' / 'файл_товары_9.xlsx'

# Добавляем путь для импорта
sys.path.insert(0, str(BASE_DIR))

from Backend.app.database import SessionLocal
from Backend.app.models.product_teka import TekaProduct
from Backend.app.models.brand import Brand
from Backend.app.models.category import Category
from sqlalchemy import text
import pandas as pd

# ID бренда Teka
TEKA_BRAND_ID = 9


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


def clean_int(value):
    """Очистка целочисленных значений"""
    if pd.isna(value):
        return None
    try:
        return int(float(value))
    except:
        return None


def clean_string(value):
    if pd.isna(value):
        return None
    return str(value).strip()


def cleanup_products_table():
    """Очистка таблицы products_teka перед загрузкой"""
    print("=" * 70)
    print("🗑️ ОЧИСТКА ТАБЛИЦЫ products_teka")
    print("=" * 70)

    db = SessionLocal()
    try:
        count_before = db.query(TekaProduct).count()
        print(f"📊 Записей до очистки: {count_before}")

        deleted = db.query(TekaProduct).delete()
        db.commit()

        # Сброс последовательности
        try:
            db.execute(text("ALTER SEQUENCE products_teka_id_seq RESTART WITH 1"))
            db.commit()
        except:
            pass

        print(f"✅ Удалено записей: {deleted}")

        count_after = db.query(TekaProduct).count()
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
                'цена' in row_values or 'dmd' in row_values):
                print(f"📌 Найдена строка с заголовками: {idx}")
                return idx

        print("⚠️ Строка с заголовками не найдена, используем первую строку")
        return 0
    except Exception as e:
        print(f"⚠️ Ошибка поиска заголовков: {e}")
        return 0


def load_products_to_db():
    """Загрузка товаров Teka в базу данных"""
    print("\n" + "=" * 70)
    print("📦 ЗАГРУЗКА ТОВАРОВ TEKA В БАЗУ ДАННЫХ")
    print("=" * 70)

    if not EXCEL_FILE.exists():
        print(f"❌ Файл не найден: {EXCEL_FILE}")
        return

    # Находим строку с заголовками
    header_row = find_header_row(EXCEL_FILE)

    # Читаем Excel файл
    df = pd.read_excel(EXCEL_FILE, header=header_row)

    print(f"📊 Строка заголовков: {header_row}")
    print(f"📊 Найдено строк данных в Excel: {len(df)}")
    print(f"📊 Доступные колонки: {list(df.columns)}")

    # Выводим первые несколько строк
    print("\n📋 Первые 3 строки данных:")
    for i in range(min(3, len(df))):
        print(f"  Строка {i+1}: {df.iloc[i].to_dict()}")

    db = SessionLocal()

    try:
        # Получаем или создаем бренд Teka
        brand = db.query(Brand).filter(Brand.id == TEKA_BRAND_ID).first()
        if not brand:
            brand = Brand(id=TEKA_BRAND_ID, name='Teka')
            db.add(brand)
            db.commit()
            db.refresh(brand)
            print(f"✅ Создан бренд: Teka (id: {brand.id})")
        else:
            print(f"✅ Бренд найден: Teka (id: {brand.id})")

        new_count = 0
        updated_count = 0
        skipped_count = 0

        # Проходим по всем строкам Excel
        for idx, row in df.iterrows():
            # Получаем название (обязательное поле)
            name = None
            for col_name in ['Название', 'название', 'Name', 'name', 'Наименование', 'наименование']:
                if col_name in row:
                    name = clean_string(row[col_name])
                    if name:
                        break

            if not name:
                print(f"⚠️ Строка {idx + header_row + 2}: пропущено (нет названия)")
                skipped_count += 1
                continue

            # Получаем category_id
            category_id = None
            for col_name in ['category_id', 'Category ID', 'ID_категории', 'id_категории']:
                if col_name in row:
                    val = clean_int(row[col_name])
                    if val:
                        category_id = int(val)
                        break

            # Получаем цену
            price = 0
            for col_name in ['Цена', 'цена', 'Price', 'price', 'РРЦ', 'ррц']:
                if col_name in row:
                    price = clean_price(row[col_name])
                    if price > 0:
                        break

            # Получаем DMD количество
            dmd_quantity = None
            for col_name in ['DMD,кол-во', 'DMD кол-во', 'dmd_quantity', 'DMD']:
                if col_name in row:
                    dmd_quantity = clean_int(row[col_name])
                    if dmd_quantity:
                        break

            # Получаем DMD_PERUP количество
            dmd_perup_quantity = None
            for col_name in ['DMD_PERUP,кол-во', 'DMD_PERUP кол-во', 'dmd_perup_quantity', 'DMD_PERUP']:
                if col_name in row:
                    dmd_perup_quantity = clean_int(row[col_name])
                    if dmd_perup_quantity:
                        break

            product_data = {
                'category_id': category_id,
                'brand_id': brand.id,
                'name': name,
                'price': price,
                'dmd_quantity': dmd_quantity,
                'dmd_perup_quantity': dmd_perup_quantity
            }

            # Проверяем, существует ли товар с таким названием
            existing = db.query(TekaProduct).filter(
                TekaProduct.name == name
            ).first()

            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                updated_count += 1
                print(f"  🔄 Обновлен: {name[:50]}")
            else:
                new_product = TekaProduct(**product_data)
                db.add(new_product)
                new_count += 1
                print(f"  ➕ Добавлен: {name[:50]}")

        db.commit()

        print("\n" + "=" * 70)
        print("📊 РЕЗУЛЬТАТ:")
        print(f"   ✅ Добавлено новых товаров: {new_count}")
        print(f"   🔄 Обновлено товаров: {updated_count}")
        print(f"   ⏭️ Пропущено: {skipped_count}")
        print(f"   📦 Всего товаров Teka в БД: {db.query(TekaProduct).count()}")

        # Показываем примеры
        print("\n📋 Примеры загруженных товаров:")
        samples = db.query(TekaProduct).limit(5).all()
        for sample in samples:
            print(f"   ID: {sample.id}, Название: {sample.name[:50]}...")

    except Exception as e:
        print(f"❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


def ensure_table_exists():
    """Проверяет существование таблицы"""
    from sqlalchemy import inspect

    print("\n" + "=" * 70)
    print("🔧 ПРОВЕРКА ТАБЛИЦЫ products_teka")
    print("=" * 70)

    db = SessionLocal()
    try:
        inspector = inspect(db.bind)
        if not inspector.has_table('products_teka'):
            print("⚠️ Таблица products_teka не найдена!")
            print("📦 Пожалуйста, создайте таблицу в БД")
            return False
        else:
            print("✅ Таблица products_teka существует")
            return True
    except Exception as e:
        print(f"❌ Ошибка проверки: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🚀 ЗАПУСК ЗАГРУЗКИ ТОВАРОВ TEKA")
    print("=" * 70)

    if not ensure_table_exists():
        sys.exit(1)

    cleanup_products_table()
    load_products_to_db()

    print("\n" + "=" * 70)
    print("🏁 ЗАВЕРШЕНО")
    print("=" * 70)