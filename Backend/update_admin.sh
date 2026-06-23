#!/bin/bash
set -e
echo "🔄 Обновление админ-панели..."

cat > Backend/app/admin.py << 'EOF'
from sqladmin import ModelView, Admin
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncEngine
from markupsafe import Markup
import zoneinfo
from datetime import datetime
import os
import shutil
from wtforms import FileField
from .database import async_session_maker
from .models import (
    Product, Category, Order, User, Brand,
    IlveProduct, BrandtProduct, BonkrasherProduct,
    DedietrichProduct, FalmecProduct, GraudeProduct,
    HomeierProduct, KuppersbuschProduct, LiebherrProduct,
    NivonaProduct, SchulthessProduct, TekaProduct, ElicaProduct
)
from .auth import authenticate_user

UPLOAD_DIR = "static/uploads/products"

def image_formatter(value):
    if not value:
        return ""
    filename = value.replace("/uploads/products/", "")
    return Markup(f'<img src="/uploads/products/{filename}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />')

def moscow_datetime_formatter(value):
    if not value:
        return ""
    if isinstance(value, str):
        value = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if value.tzinfo is None:
        value = value.replace(tzinfo=zoneinfo.ZoneInfo("UTC"))
    moscow_tz = zoneinfo.ZoneInfo("Europe/Moscow")
    moscow_time = value.astimezone(moscow_tz)
    return moscow_time.strftime("%d.%m.%Y %H:%M:%S")

def save_uploaded_file(upload_file, product_id=None):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(upload_file.filename)[1]
    if product_id:
        filename = f"{product_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
    else:
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{upload_file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return f"/uploads/products/{filename}"

class ProductAdmin(ModelView, model=Product):
    name_plural = "Все товары"
    icon = "fa-solid fa-box"
    column_list = [
        Product.id, Product.name, Product.brand_id, Product.category_id,
        Product.price, Product.main_image, Product.description, Product.color
    ]
    column_labels = {
        Product.id: "ID",
        Product.name: "Название",
        Product.brand_id: "Бренд",
        Product.category_id: "Категория",
        Product.price: "Цена (₽)",
        Product.main_image: "Фото",
        Product.sku: "Артикул",
        Product.description: "Описание",
        Product.color: "Цвет",
        Product.width: "Ширина (см)",
        Product.height: "Высота (см)",
        Product.depth: "Глубина (см)",
        Product.weight: "Вес (кг)",
    }
    column_formatters = {
        Product.main_image: lambda m, a: image_formatter(m.main_image),
    }
    search_fields = [Product.name, Product.sku, Product.description]
    column_sortable_list = [Product.brand_id, Product.category_id, Product.name, Product.price]
    column_default_sort = [(Product.brand_id, True), (Product.name, True)]
    create_button_text = "➕ Добавить товар"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"

    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        Product.brand_id, Product.category_id, Product.name, Product.sku,
        Product.price, "main_image_file", Product.main_image, Product.description,
        Product.color, Product.width, Product.height, Product.depth, Product.weight
    ]

    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data

    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

    def get_search_query(self, stmt, search_term: str):
        if not search_term:
            return stmt
        from sqlalchemy import or_
        search_pattern = f"%{search_term}%"
        return stmt.where(
            or_(
                Product.name.ilike(search_pattern),
                Product.sku.ilike(search_pattern),
                Product.description.ilike(search_pattern),
            )
        )

class IlveProductAdmin(ModelView, model=IlveProduct):
    name_plural = "Товары ILVE"
    icon = "fa-solid fa-star"
    column_list = [IlveProduct.id, IlveProduct.name, IlveProduct.price, IlveProduct.main_image, IlveProduct.model, IlveProduct.series]
    column_labels = {
        IlveProduct.id: "ID",
        IlveProduct.name: "Название",
        IlveProduct.price: "Цена (₽)",
        IlveProduct.main_image: "Фото",
        IlveProduct.model: "Модель",
        IlveProduct.series: "Серия",
    }
    column_formatters = {IlveProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [IlveProduct.name, IlveProduct.model, IlveProduct.sku]
    column_sortable_list = [IlveProduct.name, IlveProduct.price]
    create_button_text = "➕ Добавить товар ILVE"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        IlveProduct.category_id, IlveProduct.brand_id, IlveProduct.name,
        IlveProduct.sku, IlveProduct.price, "main_image_file", IlveProduct.main_image,
        IlveProduct.model, IlveProduct.series, IlveProduct.color, IlveProduct.description
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class BrandtProductAdmin(ModelView, model=BrandtProduct):
    name_plural = "Товары Brandt"
    icon = "fa-solid fa-tag"
    column_list = [BrandtProduct.id, BrandtProduct.name, BrandtProduct.price, BrandtProduct.main_image, BrandtProduct.model]
    column_labels = {
        BrandtProduct.id: "ID",
        BrandtProduct.name: "Название",
        BrandtProduct.price: "Цена (₽)",
        BrandtProduct.main_image: "Фото",
        BrandtProduct.model: "Модель",
    }
    column_formatters = {BrandtProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [BrandtProduct.name, BrandtProduct.model]
    column_sortable_list = [BrandtProduct.name, BrandtProduct.price]
    create_button_text = "➕ Добавить товар Brandt"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        BrandtProduct.category_id, BrandtProduct.brand_id, BrandtProduct.name,
        BrandtProduct.price, "main_image_file", BrandtProduct.main_image,
        BrandtProduct.model, BrandtProduct.specifications, BrandtProduct.design
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class BonkrasherProductAdmin(ModelView, model=BonkrasherProduct):
    name_plural = "Товары Bonkrasher"
    icon = "fa-solid fa-bolt"
    column_list = [BonkrasherProduct.id, BonkrasherProduct.name, BonkrasherProduct.price, BonkrasherProduct.main_image, BonkrasherProduct.sku]
    column_labels = {
        BonkrasherProduct.id: "ID",
        BonkrasherProduct.name: "Название",
        BonkrasherProduct.price: "Цена (₽)",
        BonkrasherProduct.main_image: "Фото",
        BonkrasherProduct.sku: "Артикул",
    }
    column_formatters = {BonkrasherProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [BonkrasherProduct.name, BonkrasherProduct.sku]
    column_sortable_list = [BonkrasherProduct.name, BonkrasherProduct.price]
    create_button_text = "➕ Добавить товар Bonkrasher"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        BonkrasherProduct.category_id, BonkrasherProduct.brand_id, BonkrasherProduct.name,
        BonkrasherProduct.sku, BonkrasherProduct.price, "main_image_file", BonkrasherProduct.main_image,
        BonkrasherProduct.functionality
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class DedietrichProductAdmin(ModelView, model=DedietrichProduct):
    name_plural = "Товары De Dietrich"
    icon = "fa-solid fa-crown"
    column_list = [DedietrichProduct.id, DedietrichProduct.name, DedietrichProduct.price_public, DedietrichProduct.main_image, DedietrichProduct.model]
    column_labels = {
        DedietrichProduct.id: "ID",
        DedietrichProduct.name: "Название",
        DedietrichProduct.price_public: "Цена (₽)",
        DedietrichProduct.main_image: "Фото",
        DedietrichProduct.model: "Модель",
    }
    column_formatters = {DedietrichProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [DedietrichProduct.name, DedietrichProduct.model]
    column_sortable_list = [DedietrichProduct.name, DedietrichProduct.price_public]
    create_button_text = "➕ Добавить товар De Dietrich"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        DedietrichProduct.category_id, DedietrichProduct.brand_id, DedietrichProduct.name,
        DedietrichProduct.price_public, "main_image_file", DedietrichProduct.main_image,
        DedietrichProduct.model, DedietrichProduct.line, DedietrichProduct.specifications, DedietrichProduct.color
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class FalmecProductAdmin(ModelView, model=FalmecProduct):
    name_plural = "Товары Falmec"
    icon = "fa-solid fa-wind"
    column_list = [FalmecProduct.id, FalmecProduct.name, FalmecProduct.price_retail, FalmecProduct.main_image, FalmecProduct.manufacturer_code]
    column_labels = {
        FalmecProduct.id: "ID",
        FalmecProduct.name: "Название",
        FalmecProduct.price_retail: "Цена (₽)",
        FalmecProduct.main_image: "Фото",
        FalmecProduct.manufacturer_code: "Код производителя",
    }
    column_formatters = {FalmecProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [FalmecProduct.name, FalmecProduct.manufacturer_code]
    column_sortable_list = [FalmecProduct.name, FalmecProduct.price_retail]
    create_button_text = "➕ Добавить товар Falmec"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        FalmecProduct.category_id, FalmecProduct.brand_id, FalmecProduct.name,
        FalmecProduct.manufacturer_code, FalmecProduct.price_retail, "main_image_file", FalmecProduct.main_image,
        FalmecProduct.mounting_type, FalmecProduct.color, FalmecProduct.width_cm, FalmecProduct.performance_m3h
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class GraudeProductAdmin(ModelView, model=GraudeProduct):
    name_plural = "Товары Graude"
    icon = "fa-solid fa-gem"
    column_list = [GraudeProduct.id, GraudeProduct.name, GraudeProduct.price_public, GraudeProduct.main_image, GraudeProduct.sku]
    column_labels = {
        GraudeProduct.id: "ID",
        GraudeProduct.name: "Название",
        GraudeProduct.price_public: "Цена (₽)",
        GraudeProduct.main_image: "Фото",
        GraudeProduct.sku: "Артикул",
    }
    column_formatters = {GraudeProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [GraudeProduct.name, GraudeProduct.sku]
    column_sortable_list = [GraudeProduct.name, GraudeProduct.price_public]
    create_button_text = "➕ Добавить товар Graude"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        GraudeProduct.category_id, GraudeProduct.brand_id, GraudeProduct.name,
        GraudeProduct.sku, GraudeProduct.price_public, "main_image_file", GraudeProduct.main_image,
        GraudeProduct.description
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class HomeierProductAdmin(ModelView, model=HomeierProduct):
    name_plural = "Товары Homeier"
    icon = "fa-solid fa-home"
    column_list = [HomeierProduct.id, HomeierProduct.name, HomeierProduct.price, HomeierProduct.main_image, HomeierProduct.sku]
    column_labels = {
        HomeierProduct.id: "ID",
        HomeierProduct.name: "Название",
        HomeierProduct.price: "Цена (₽)",
        HomeierProduct.main_image: "Фото",
        HomeierProduct.sku: "Артикул",
    }
    column_formatters = {HomeierProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [HomeierProduct.name, HomeierProduct.sku]
    column_sortable_list = [HomeierProduct.name, HomeierProduct.price]
    create_button_text = "➕ Добавить товар Homeier"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        HomeierProduct.category_id, HomeierProduct.brand_id, HomeierProduct.name,
        HomeierProduct.sku, HomeierProduct.price, "main_image_file", HomeierProduct.main_image,
        HomeierProduct.description, HomeierProduct.color,
        HomeierProduct.width, HomeierProduct.height, HomeierProduct.depth
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class KuppersbuschProductAdmin(ModelView, model=KuppersbuschProduct):
    name_plural = "Товары Kuppersbusch"
    icon = "fa-solid fa-kitchen-set"
    column_list = [KuppersbuschProduct.id, KuppersbuschProduct.name, KuppersbuschProduct.price, KuppersbuschProduct.main_image, KuppersbuschProduct.sku]
    column_labels = {
        KuppersbuschProduct.id: "ID",
        KuppersbuschProduct.name: "Название",
        KuppersbuschProduct.price: "Цена (₽)",
        KuppersbuschProduct.main_image: "Фото",
        KuppersbuschProduct.sku: "Артикул",
    }
    column_formatters = {KuppersbuschProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [KuppersbuschProduct.name, KuppersbuschProduct.sku]
    column_sortable_list = [KuppersbuschProduct.name, KuppersbuschProduct.price]
    create_button_text = "➕ Добавить товар Kuppersbusch"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        KuppersbuschProduct.category_id, KuppersbuschProduct.brand_id, KuppersbuschProduct.name,
        KuppersbuschProduct.sku, KuppersbuschProduct.price, "main_image_file", KuppersbuschProduct.main_image,
        KuppersbuschProduct.description, KuppersbuschProduct.color, KuppersbuschProduct.series
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class LiebherrProductAdmin(ModelView, model=LiebherrProduct):
    name_plural = "Товары Liebherr"
    icon = "fa-solid fa-snowflake"
    column_list = [LiebherrProduct.id, LiebherrProduct.name, LiebherrProduct.price_public, LiebherrProduct.main_image, LiebherrProduct.model, LiebherrProduct.ean]
    column_labels = {
        LiebherrProduct.id: "ID",
        LiebherrProduct.name: "Название",
        LiebherrProduct.price_public: "Цена (₽)",
        LiebherrProduct.main_image: "Фото",
        LiebherrProduct.model: "Модель",
        LiebherrProduct.ean: "EAN",
    }
    column_formatters = {LiebherrProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [LiebherrProduct.name, LiebherrProduct.model, LiebherrProduct.ean]
    column_sortable_list = [LiebherrProduct.name, LiebherrProduct.price_public]
    create_button_text = "➕ Добавить товар Liebherr"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        LiebherrProduct.category_id, LiebherrProduct.brand_id, LiebherrProduct.name,
        LiebherrProduct.price_public, "main_image_file", LiebherrProduct.main_image,
        LiebherrProduct.model, LiebherrProduct.ean, LiebherrProduct.status, LiebherrProduct.factory
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class NivonaProductAdmin(ModelView, model=NivonaProduct):
    name_plural = "Товары Nivona"
    icon = "fa-solid fa-mug-saucer"
    column_list = [NivonaProduct.id, NivonaProduct.name, NivonaProduct.price_public, NivonaProduct.main_image, NivonaProduct.model]
    column_labels = {
        NivonaProduct.id: "ID",
        NivonaProduct.name: "Название",
        NivonaProduct.price_public: "Цена (₽)",
        NivonaProduct.main_image: "Фото",
        NivonaProduct.model: "Модель",
    }
    column_formatters = {NivonaProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [NivonaProduct.name, NivonaProduct.model]
    column_sortable_list = [NivonaProduct.name, NivonaProduct.price_public]
    create_button_text = "➕ Добавить товар Nivona"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        NivonaProduct.category_id, NivonaProduct.brand_id, NivonaProduct.name,
        NivonaProduct.price_public, "main_image_file", NivonaProduct.main_image,
        NivonaProduct.model, NivonaProduct.sku, NivonaProduct.description
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class SchulthessProductAdmin(ModelView, model=SchulthessProduct):
    name_plural = "Товары Schulthess"
    icon = "fa-solid fa-washing-machine"
    column_list = [SchulthessProduct.id, SchulthessProduct.name, SchulthessProduct.price, SchulthessProduct.main_image, SchulthessProduct.model]
    column_labels = {
        SchulthessProduct.id: "ID",
        SchulthessProduct.name: "Название",
        SchulthessProduct.price: "Цена (₽)",
        SchulthessProduct.main_image: "Фото",
        SchulthessProduct.model: "Модель",
    }
    column_formatters = {SchulthessProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [SchulthessProduct.name, SchulthessProduct.model]
    column_sortable_list = [SchulthessProduct.name, SchulthessProduct.price]
    create_button_text = "➕ Добавить товар Schulthess"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        SchulthessProduct.category_id, SchulthessProduct.brand_id, SchulthessProduct.name,
        SchulthessProduct.price, "main_image_file", SchulthessProduct.main_image,
        SchulthessProduct.model, SchulthessProduct.product_group, SchulthessProduct.color, SchulthessProduct.description
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class TekaProductAdmin(ModelView, model=TekaProduct):
    name_plural = "Товары Teka"
    icon = "fa-solid fa-utensils"
    column_list = [TekaProduct.id, TekaProduct.name, TekaProduct.price, TekaProduct.main_image, TekaProduct.dmd_quantity]
    column_labels = {
        TekaProduct.id: "ID",
        TekaProduct.name: "Название",
        TekaProduct.price: "Цена (₽)",
        TekaProduct.main_image: "Фото",
        TekaProduct.dmd_quantity: "DMD кол-во",
    }
    column_formatters = {TekaProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [TekaProduct.name]
    column_sortable_list = [TekaProduct.name, TekaProduct.price]
    create_button_text = "➕ Добавить товар Teka"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        TekaProduct.category_id, TekaProduct.brand_id, TekaProduct.name,
        TekaProduct.price, "main_image_file", TekaProduct.main_image,
        TekaProduct.dmd_quantity, TekaProduct.dmd_perup_quantity
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class ElicaProductAdmin(ModelView, model=ElicaProduct):
    name_plural = "Товары Elica"
    icon = "fa-solid fa-fan"
    column_list = [ElicaProduct.id, ElicaProduct.name, ElicaProduct.price, ElicaProduct.main_image, ElicaProduct.model]
    column_labels = {
        ElicaProduct.id: "ID",
        ElicaProduct.name: "Название",
        ElicaProduct.price: "Цена (₽)",
        ElicaProduct.main_image: "Фото",
        ElicaProduct.model: "Модель",
    }
    column_formatters = {ElicaProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [ElicaProduct.name, ElicaProduct.model, ElicaProduct.actual_code]
    column_sortable_list = [ElicaProduct.name, ElicaProduct.price]
    create_button_text = "➕ Добавить товар Elica"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    form_extra_fields = {
        "main_image_file": FileField(label="Выберите фото (загрузить с компьютера)")
    }
    form_columns = [
        ElicaProduct.category_id, ElicaProduct.brand_id, ElicaProduct.name,
        ElicaProduct.price, "main_image_file", ElicaProduct.main_image,
        ElicaProduct.model, ElicaProduct.actual_code, ElicaProduct.description
    ]
    async def on_model_change(self, data, model, is_created, request):
        if request.method == "POST":
            form = await request.form()
            if "main_image_file" in form and form["main_image_file"]:
                upload_file = form["main_image_file"]
                if hasattr(upload_file, "filename") and upload_file.filename:
                    saved_path = save_uploaded_file(upload_file)
                    data["main_image"] = saved_path
        return data
    def after_model_change(self, data, model, is_created, request):
        if is_created and model.main_image:
            old_path = model.main_image.replace("/uploads/products/", "")
            old_full_path = os.path.join(UPLOAD_DIR, old_path)
            if os.path.exists(old_full_path):
                ext = os.path.splitext(old_path)[1]
                new_name = f"{model.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
                new_full_path = os.path.join(UPLOAD_DIR, new_name)
                os.rename(old_full_path, new_full_path)
                model.main_image = f"/uploads/products/{new_name}"
                import asyncio
                async def update_path():
                    async with async_session_maker() as session:
                        session.add(model)
                        await session.commit()
                asyncio.run(update_path())
        return data

class BrandAdmin(ModelView, model=Brand):
    name_plural = "Бренды"
    icon = "fa-solid fa-trademark"
    column_list = [Brand.id, Brand.name]
    column_labels = {Brand.id: "ID", Brand.name: "Название бренда"}
    form_excluded_columns = ["products"]
    create_button_text = "➕ Добавить бренд"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    search_fields = [Brand.name]

class CategoryAdmin(ModelView, model=Category):
    name_plural = "Категории"
    icon = "fa-solid fa-folder"
    column_list = [Category.id, Category.name, Category.parent_id, Category.level, Category.sort_order, Category.created_at]
    column_labels = {
        Category.id: "ID",
        Category.name: "Название",
        Category.parent_id: "Родитель",
        Category.level: "Уровень",
        Category.sort_order: "Sort Order",
        Category.created_at: "Дата создания (МСК)",
        Category.slug: "Slug",
    }
    column_formatters = {Category.created_at: lambda m, a: moscow_datetime_formatter(m.created_at)}
    form_excluded_columns = [
        "children", "products",
        "bonkrasher_products", "brandt_products", "dedietrich_products",
        "falmec_products", "graude_products", "homeier_products",
        "kuppersbusch_products", "liebherr_products", "nivona_products",
        "schulthess_products", "teka_products"
    ]
    create_button_text = "➕ Добавить категорию"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    search_fields = [Category.name]

class OrderAdmin(ModelView, model=Order):
    name_plural = "Заказы"
    icon = "fa-solid fa-cart-shopping"
    column_list = [Order.order_number, Order.customer_name, Order.total_amount, Order.status, Order.created_at]
    column_labels = {
        Order.order_number: "Номер заказа",
        Order.customer_name: "Клиент",
        Order.customer_email: "Email",
        Order.customer_phone: "Телефон",
        Order.customer_address: "Адрес",
        Order.total_amount: "Сумма (₽)",
        Order.status: "Статус",
        Order.created_at: "Дата создания (МСК)",
    }
    column_formatters = {Order.created_at: lambda m, a: moscow_datetime_formatter(m.created_at)}
    search_fields = [Order.order_number, Order.customer_name, Order.customer_email, Order.customer_phone]
    form_choices = {
        Order.status: [
            ('pending', 'Ожидает'),
            ('processing', 'В обработке'),
            ('shipped', 'Отправлен'),
            ('delivered', 'Доставлен'),
            ('cancelled', 'Отменён'),
        ]
    }

class UserAdmin(ModelView, model=User):
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    column_list = [User.id, User.name, User.email, User.is_admin, User.is_active]
    column_labels = {
        User.id: "ID",
        User.name: "Имя",
        User.email: "Email",
        User.is_admin: "Администратор",
        User.is_active: "Активен",
    }
    form_excluded_columns = [User.password_hash]
    search_fields = [User.name, User.email]

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")
        user = await authenticate_user(email, password)
        if user and user.is_admin:
            request.session.update({"user_id": str(user.id), "is_admin": True})
            return True
        return False
    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True
    async def authenticate(self, request: Request) -> bool:
        return request.session.get("is_admin", False)

def setup_admin(app, engine: AsyncEngine):
    auth = AdminAuth(secret_key="your-very-long-secret-key-for-sessions-2025-12345")
    admin = Admin(app, engine, authentication_backend=auth)
    admin.add_view(ProductAdmin)
    admin.add_view(IlveProductAdmin)
    admin.add_view(BrandtProductAdmin)
    admin.add_view(BonkrasherProductAdmin)
    admin.add_view(DedietrichProductAdmin)
    admin.add_view(FalmecProductAdmin)
    admin.add_view(GraudeProductAdmin)
    admin.add_view(HomeierProductAdmin)
    admin.add_view(KuppersbuschProductAdmin)
    admin.add_view(LiebherrProductAdmin)
    admin.add_view(NivonaProductAdmin)
    admin.add_view(SchulthessProductAdmin)
    admin.add_view(TekaProductAdmin)
    admin.add_view(ElicaProductAdmin)
    admin.add_view(BrandAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(UserAdmin)
    return admin
EOF

cat > Backend/app/models/__init__.py << 'EOF'
from .product import Product
from .category import Category
from .order import Order
from .user import User
from .brand import Brand

from .product_ilve import IlveProduct
from .product_brandt import BrandtProduct
from .product_bonkrasher import BonkrasherProduct
from .product_dedietrich import DedietrichProduct
from .product_falmec import FalmecProduct
from .product_graude import GraudeProduct
from .product_homeier import HomeierProduct
from .product_kuppersbusch import KuppersbuschProduct
from .product_liebherr import LiebherrProduct
from .product_nivona import NivonaProduct
from .product_schulthess import SchulthessProduct
from .product_teka import TekaProduct
from .product_elica import ElicaProduct
EOF

cat > Backend/app/models/product.py << 'EOF'
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name = Column(String(500), nullable=False)
    sku = Column(String(1000), nullable=True)
    price = Column(Float, nullable=True)
    main_image = Column(String(500), nullable=True)

    description = Column(Text, nullable=True)
    color = Column(String(100), nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    depth = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    brand = relationship("Brand", backref="products")
    category = relationship("Category", backref="products")

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
EOF

cat > Backend/app/models/product_liebherr.py << 'EOF'
from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class LiebherrProduct(Base):
    __tablename__ = "products_liebherr"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    model = Column(String(100), nullable=True)
    ean = Column(String(50), nullable=True)
    status = Column(String(50), nullable=True)
    name = Column(String(500), nullable=False)
    category_name = Column(String(255), nullable=True)

    production_start = Column(Integer, nullable=True)
    factory = Column(String(255), nullable=True)
    warranty = Column(Integer, nullable=True)

    price_public = Column(Numeric(10, 2), nullable=True)
    price_wholesale = Column(Numeric(10, 2), nullable=True)
    promo_price_public = Column(Numeric(10, 2), nullable=True)
    promo_price_wholesale = Column(Numeric(10, 2), nullable=True)

    main_image = Column(String(500), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="liebherr_products")
    brand = relationship("Brand", backref="liebherr_products")
EOF

cat > Backend/app/models/product_teka.py << 'EOF'
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class TekaProduct(Base):
    __tablename__ = "products_teka"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    name = Column(String(500), nullable=False)
    price = Column(Numeric(10, 2), default=0)
    dmd_quantity = Column(Integer, nullable=True)
    dmd_perup_quantity = Column(Integer, nullable=True)

    main_image = Column(String(500), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="teka_products")
    brand = relationship("Brand", backref="teka_products")
EOF

echo "✅ Файлы обновлены"
echo "🔄 Добавляю колонки main_image в БД..."

cd Backend
python -c "
from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE products_liebherr ADD COLUMN main_image VARCHAR(500);'))
        print('✅ Колонка добавлена в products_liebherr')
    except Exception as e:
        if 'duplicate column' in str(e).lower():
            print('ℹ️ Колонка main_image уже есть в products_liebherr')
        else:
            print('⚠️ Ошибка:', e)
    try:
        conn.execute(text('ALTER TABLE products_teka ADD COLUMN main_image VARCHAR(500);'))
        print('✅ Колонка добавлена в products_teka')
    except Exception as e:
        if 'duplicate column' in str(e).lower():
            print('ℹ️ Колонка main_image уже есть в products_teka')
        else:
            print('⚠️ Ошибка:', e)
    conn.commit()
"
cd ..

echo "✅ Готово! Теперь перезапустите сервер:"
echo "cd Backend && uvicorn app.main:app --reload"
