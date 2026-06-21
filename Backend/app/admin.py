from sqladmin import ModelView, Admin
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import select
import zoneinfo
from datetime import datetime
import re
import unicodedata
import json
from markupsafe import Markup
from .models import Category, Order, User, Brand
from .auth import authenticate_user

# ========== Вспомогательные функции ==========
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

def slugify(text: str) -> str:
    """Преобразует строку в латиницу, удаляет спецсимволы, заменяет пробелы на дефисы."""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    text = re.sub(r'[-\s]+', '-', text)
    return text

def format_order_items(items_json):
    """Преобразует список товаров в читаемую HTML-таблицу"""
    if not items_json:
        return Markup("<span style='color:gray;'>Нет товаров</span>")

    if isinstance(items_json, str):
        try:
            items = json.loads(items_json)
        except:
            return Markup("<span style='color:red;'>Ошибка данных</span>")
    else:
        items = items_json

    if not isinstance(items, list) or len(items) == 0:
        return Markup("<span style='color:gray;'>Нет товаров</span>")

    html = """
    <table style='border-collapse: collapse; width: 100%; font-size: 12px;'>
        <thead>
            <tr style='background: #f0f0f0;'>
                <th style='padding: 4px 6px; border: 1px solid #ddd; text-align: left;'>Название</th>
                <th style='padding: 4px 6px; border: 1px solid #ddd; text-align: left;'>Артикул</th>
                <th style='padding: 4px 6px; border: 1px solid #ddd; text-align: right;'>Цена (₽)</th>
                <th style='padding: 4px 6px; border: 1px solid #ddd; text-align: center;'>Кол-во</th>
                <th style='padding: 4px 6px; border: 1px solid #ddd; text-align: right;'>Сумма (₽)</th>
            </tr>
        </thead>
        <tbody>
    """
    for item in items:
        name = item.get("product_name", "")
        sku = item.get("product_sku", "")
        price = item.get("product_price", 0)
        qty = item.get("quantity", 0)
        total = item.get("total_price", 0)
        html += f"""
            <tr>
                <td style='padding: 4px 6px; border: 1px solid #ddd;'>{name}</td>
                <td style='padding: 4px 6px; border: 1px solid #ddd;'>{sku}</td>
                <td style='padding: 4px 6px; border: 1px solid #ddd; text-align: right;'>{price:,.0f}</td>
                <td style='padding: 4px 6px; border: 1px solid #ddd; text-align: center;'>{qty}</td>
                <td style='padding: 4px 6px; border: 1px solid #ddd; text-align: right;'>{total:,.0f}</td>
            </tr>
        """
    html += """
        </tbody>
    </table>
    """
    return Markup(html)

# ========== Категории ==========
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
    
    form_columns = [Category.name, Category.parent_id]
    form_widget_args = {
        "name": {"type": "text", "placeholder": "Введите название категории"},
        "parent_id": {"placeholder": "Выберите родительскую категорию (необязательно)"}
    }
    
    create_button_text = "➕ Добавить категорию"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    search_fields = [Category.name]

    async def on_model_change(self, data, model, is_created, request):
        if is_created:
            name = data.get("name")
            if name:
                base_slug = slugify(name)
                timestamp = int(datetime.now().timestamp())
                model.slug = f"{base_slug}-{timestamp}"
            else:
                model.slug = f"category-{int(datetime.now().timestamp())}"

            parent_id = data.get("parent_id")
            if parent_id:
                session = request.state.session
                stmt = select(Category.level).where(Category.id == parent_id)
                result = await session.execute(stmt)
                parent_level = result.scalar()
                model.level = parent_level + 1 if parent_level is not None else 1
            else:
                model.level = 1

            model.sort_order = 0

# ========== Бренды ==========
class BrandAdmin(ModelView, model=Brand):
    name_plural = "Бренды"
    icon = "fa-solid fa-trademark"
    column_list = [Brand.id, Brand.name]
    column_labels = {Brand.id: "ID", Brand.name: "Название бренда"}

    form_columns = [Brand.name]
    form_widget_args = {
        "name": {"type": "text", "placeholder": "Введите название бренда"}
    }

    create_button_text = "➕ Добавить бренд"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"
    search_fields = [Brand.name]

# ========== Заказы (с красивым отображением товаров) ==========
class OrderAdmin(ModelView, model=Order):
    name_plural = "Заказы"
    icon = "fa-solid fa-cart-shopping"
    column_list = [
        Order.order_number,
        Order.customer_name,
        Order.total_amount,
        Order.status,
        Order.created_at,
        Order.items
    ]
    column_labels = {
        Order.order_number: "Номер заказа",
        Order.customer_name: "Клиент",
        Order.customer_email: "Email",
        Order.customer_phone: "Телефон",
        Order.customer_address: "Адрес",
        Order.total_amount: "Сумма (₽)",
        Order.status: "Статус",
        Order.created_at: "Дата создания (МСК)",
        Order.items: "Товары",
    }
    column_formatters = {
        Order.created_at: lambda m, a: moscow_datetime_formatter(m.created_at),
        Order.items: lambda m, a: format_order_items(m.items)
    }
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

# ========== Пользователи ==========
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

# ========== Аутентификация ==========
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
    admin.add_view(CategoryAdmin)
    admin.add_view(BrandAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(UserAdmin)
    return admin