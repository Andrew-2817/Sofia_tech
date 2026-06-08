from sqladmin import ModelView, Admin
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncEngine
from markupsafe import Markup
import zoneinfo
from datetime import datetime
from .database import async_session_maker
from .models import Product, Category, Order, User, Brand
from .auth import authenticate_user


def image_formatter(value):
    if not value:
        return ""
    filename = value.replace("/uploads/products/", "")
    return Markup(
        f'<img src="/uploads/products/{filename}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />'
    )


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


class ProductAdmin(ModelView, model=Product):
    name_plural = "Товары"
    icon = "fa-solid fa-box"
    column_list = [Product.id, Product.name, Product.brand_id, Product.category_id, Product.price, Product.main_image]
    column_labels = {
        Product.id: "ID",
        Product.name: "Название",
        Product.brand_id: "Бренд",
        Product.category_id: "Категория",
        Product.price: "Цена (₽)",
        Product.main_image: "Фото",
        Product.sku: "Артикул",
        Product.attributes: "Доп. характеристики",
    }
    column_formatters = {Product.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [Product.name, Product.sku]
    create_button_text = "➕ Добавить товар"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"


class BrandAdmin(ModelView, model=Brand):
    name_plural = "Бренды"
    icon = "fa-solid fa-trademark"
    column_list = [Brand.id, Brand.name]
    column_labels = {
        Brand.id: "ID",
        Brand.name: "Название бренда",
    }
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
    column_formatters = {
        Category.created_at: lambda m, a: moscow_datetime_formatter(m.created_at),
    }
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
    admin.add_view(BrandAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(UserAdmin)
    return admin