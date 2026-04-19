import os
import json
import re
from pathlib import Path

import django
import pandas as pd
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from catalog.models import (
    Brand, Category, Color, BaseProduct, Product,
    ProductImage, Attribute, ProductAttribute
)


def get_or_create_brand(name):
    if not name:
        return None
    slug = slugify(name)
    obj, created = Brand.objects.get_or_create(slug=slug, defaults={'name': name})
    if not created and obj.name != name:
        obj.name = name
        obj.save()
    return obj


def get_or_create_category(name, parent=None):
    if not name:
        return None
    slug = slugify(name)
    obj, created = Category.objects.get_or_create(slug=slug, defaults={'name': name, 'parent': parent})
    if not created and obj.name != name:
        obj.name = name
        obj.save()
    return obj


def get_or_create_color(name):
    if not name:
        return None
    # Убрано использование slug для Color, т.к. поле slug отсутствует
    obj, created = Color.objects.get_or_create(name=name)
    return obj


def parse_price(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return 0
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        cleaned = re.sub(r'[^\d]', '', value)
        return int(cleaned) if cleaned else 0
    return 0


def clean_sku(sku, max_length=50):
    if not sku:
        return ''
    sku = str(sku).strip()
    sku = re.sub(r'[^\w\s\-]', '', sku)
    if len(sku) > max_length:
        sku = sku[:max_length]
    return sku


def import_from_config(config_path):
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    brand_name = config['brand']
    brand = get_or_create_brand(brand_name)

    file_pattern = config['file_pattern']
    data_dir = Path('data')
    files = list(data_dir.glob(file_pattern))
    if not files:
        print(f"⚠️ Не найден файл по шаблону {file_pattern}")
        return
    file_path = files[0]
    print(f"📂 Обработка файла: {file_path.name} (бренд {brand_name})")

    if config.get('dynamic_sheets'):
        xl = pd.ExcelFile(file_path)
        exclude_sheets = {'аксессуары', 'outlet', 'промо'}
        sheets = [s for s in xl.sheet_names if s.lower() not in exclude_sheets]
    else:
        sheets = [config.get('sheet_name')]

    for sheet in sheets:
        if sheet is None:
            continue
        print(f"   → Лист: {sheet}")
        try:
            # Исправлено: добавлен header=0 для корректного распознавания заголовков
            df = pd.read_excel(
                file_path,
                sheet_name=sheet,
                skiprows=config.get('skip_rows', 0),
                header=0
            )
        except Exception as e:
            print(f"   ❌ Ошибка чтения листа {sheet}: {e}")
            continue

        col_map = config['column_mapping']
        rename_dict = {v: k for k, v in col_map.items() if v in df.columns}
        if rename_dict:
            df.rename(columns=rename_dict, inplace=True)

        # Приводим заголовки к нижнему регистру, предварительно преобразовав в строки
        df.columns = [str(c).lower() for c in df.columns]

        for idx, row in df.iterrows():
            try:
                sku = row.get('sku')
                if pd.isna(sku) or not str(sku).strip():
                    continue
                sku = clean_sku(str(sku).strip())

                name = row.get('name')
                if pd.isna(name):
                    name = f"{brand_name} {sku}"
                else:
                    name = str(name).strip()

                price = parse_price(row.get('price'))
                if price == 0 and 'price_promo' in row:
                    price = parse_price(row.get('price_promo'))

                if 'build_description_from_fields' in config:
                    desc_parts = []
                    for f in config['build_description_from_fields']:
                        val = row.get(f.lower())
                        if not pd.isna(val):
                            desc_parts.append(str(val))
                    description = ' | '.join(desc_parts)
                else:
                    description = row.get('description')
                    if pd.isna(description):
                        description = ''
                    else:
                        description = str(description).strip()

                cat_name = None
                if 'category' in row and not pd.isna(row['category']):
                    cat_name = str(row['category']).strip()
                elif 'category_l1' in row and not pd.isna(row['category_l1']):
                    cat_name = str(row['category_l1']).strip()
                category = get_or_create_category(cat_name) if cat_name else None

                color_name = None
                if 'color' in row and not pd.isna(row['color']):
                    color_name = str(row['color']).strip()
                elif 'color_appliance' in row and not pd.isna(row['color_appliance']):
                    color_name = str(row['color_appliance']).strip()
                color = get_or_create_color(color_name)

                # BaseProduct
                base_product, created = BaseProduct.objects.update_or_create(
                    article_base=sku,
                    defaults={
                        'name': name,
                        'brand': brand,
                        'category': category,
                        'description': description,
                        'is_active': True
                    }
                )
                if created:
                    print(f"      + Добавлен базовый продукт: {sku}")

                variant_sku = sku
                if 'sku_decor' in row and not pd.isna(row['sku_decor']):
                    variant_sku = clean_sku(str(row['sku_decor']).strip())

                decor_color_name = None
                if 'color_decor' in row and not pd.isna(row['color_decor']):
                    decor_color_name = str(row['color_decor']).strip()
                decor_color = get_or_create_color(decor_color_name)

                product, prod_created = Product.objects.update_or_create(
                    base_product=base_product,
                    article=variant_sku,
                    defaults={
                        'article_decor': variant_sku if variant_sku != sku else '',
                        'color': color,
                        'decor_color': decor_color,
                        'price': price,
                        'is_active': True
                    }
                )
                if prod_created:
                    print(f"        → Вариант: {variant_sku}")

                # Характеристики (пример)
                if description:
                    power_match = re.search(r'(\d+)\s*[Вв][Тт]', description)
                    if power_match:
                        attr, _ = Attribute.objects.get_or_create(name='Мощность', unit='Вт')
                        ProductAttribute.objects.update_or_create(
                            product=product, attribute=attr,
                            defaults={'value': power_match.group(1)}
                        )
                    volume_match = re.search(r'(\d+)\s*[Лл]', description)
                    if volume_match:
                        attr, _ = Attribute.objects.get_or_create(name='Объём', unit='л')
                        ProductAttribute.objects.update_or_create(
                            product=product, attribute=attr,
                            defaults={'value': volume_match.group(1)}
                        )

            except Exception as e:
                print(f"      ❌ Ошибка в строке {idx}: {e}")
                continue

    print(f"✅ Импорт для бренда {brand_name} завершён.\n")


if __name__ == '__main__':
    config_dir = Path('import_configs')
    if not config_dir.exists():
        print("❌ Папка import_configs не найдена.")
        exit(1)

    config_files = list(config_dir.glob('*.json'))
    if not config_files:
        print("❌ В папке import_configs нет JSON-файлов.")
        exit(1)

    for config_file in config_files:
        import_from_config(config_file)

    print("🎉 Импорт всех брендов завершён!")