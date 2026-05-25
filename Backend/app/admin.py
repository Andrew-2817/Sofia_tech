from sqladmin import ModelView, Admin
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncEngine
from markupsafe import Markup
import zoneinfo
from datetime import datetime
from .database import async_session_maker
from .models.product_brandt import BrandtProduct
from .models.product_liebherr import LiebherrProduct
from .models.product_dedietrich import DedietrichProduct
from .models.product_falmec import FalmecProduct
from .models.product_graude import GraudeProduct
from .models.product_homeier import HomeierProduct
from .models.product_kuppersbusch import KuppersbuschProduct
from .models.product_nivona import NivonaProduct
from .models.product_schulthess import SchulthessProduct
from .models.product_teka import TekaProduct
from .models.product_bonkrasher import BonkrasherProduct
from .models.order import Order
from .models.user import User
from .models.category import Category
from .auth import authenticate_user


def image_formatter(value):
    if not value:
        return ""
    filename = value.replace("/uploads/products/", "")
    return Markup(
        f'<img src="/uploads/products/{filename}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />'
    )


def moscow_datetime_formatter(value):
    """Форматирует UTC время в московское (UTC+3)"""
    if not value:
        return ""
    if isinstance(value, str):
        value = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if value.tzinfo is None:
        value = value.replace(tzinfo=zoneinfo.ZoneInfo("UTC"))
    moscow_tz = zoneinfo.ZoneInfo("Europe/Moscow")
    moscow_time = value.astimezone(moscow_tz)
    return moscow_time.strftime("%d.%m.%Y %H:%M:%S")


class BaseProductAdmin(ModelView):
    page_size = 50
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    create_button_text = "➕ Добавить товар"
    save_button_text = "💾 Сохранить"
    delete_button_text = "🗑️ Удалить"


class BrandtProductAdmin(BaseProductAdmin, model=BrandtProduct):
    name_plural = "Товары Brandt"
    icon = "fa-solid fa-tag"
    column_list = [BrandtProduct.id, BrandtProduct.name, BrandtProduct.price, BrandtProduct.main_image, BrandtProduct.category_id]
    column_labels = {
        BrandtProduct.id: "ID",
        BrandtProduct.name: "Название",
        BrandtProduct.price: "Цена (₽)",
        BrandtProduct.main_image: "Фото",
        BrandtProduct.category_id: "ID категории",
        BrandtProduct.specifications: "Характеристики",
        BrandtProduct.design: "Дизайн",
        BrandtProduct.comment: "Комментарий",
    }
    column_formatters = {BrandtProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [BrandtProduct.name, BrandtProduct.price]  # поиск по названию и цене


class LiebherrProductAdmin(BaseProductAdmin, model=LiebherrProduct):
    name_plural = "Товары Liebherr"
    icon = "fa-solid fa-tag"
    column_list = [LiebherrProduct.id, LiebherrProduct.name, LiebherrProduct.price_public, LiebherrProduct.model]
    column_labels = {
        LiebherrProduct.id: "ID",
        LiebherrProduct.name: "Название",
        LiebherrProduct.price_public: "Цена (₽)",
        LiebherrProduct.model: "Модель",
        LiebherrProduct.status: "Статус",
    }
    search_fields = [LiebherrProduct.name, LiebherrProduct.model]


class DedietrichProductAdmin(BaseProductAdmin, model=DedietrichProduct):
    name_plural = "Товары De Dietrich"
    icon = "fa-solid fa-tag"
    column_list = [DedietrichProduct.id, DedietrichProduct.name, DedietrichProduct.price_public, DedietrichProduct.main_image, DedietrichProduct.model]
    column_labels = {
        DedietrichProduct.id: "ID",
        DedietrichProduct.name: "Название",
        DedietrichProduct.price_public: "Цена (₽)",
        DedietrichProduct.main_image: "Фото",
        DedietrichProduct.model: "Модель",
        DedietrichProduct.line: "Линейка",
    }
    column_formatters = {DedietrichProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [DedietrichProduct.name, DedietrichProduct.model, DedietrichProduct.line]


class FalmecProductAdmin(BaseProductAdmin, model=FalmecProduct):
    name_plural = "Товары Falmec"
    icon = "fa-solid fa-tag"
    column_list = [FalmecProduct.id, FalmecProduct.model, FalmecProduct.price_retail, FalmecProduct.main_image, FalmecProduct.color]
    column_labels = {
        FalmecProduct.id: "ID",
        FalmecProduct.model: "Модель",
        FalmecProduct.price_retail: "Цена (₽)",
        FalmecProduct.main_image: "Фото",
        FalmecProduct.color: "Цвет",
    }
    column_formatters = {FalmecProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [FalmecProduct.model, FalmecProduct.color]


class GraudeProductAdmin(BaseProductAdmin, model=GraudeProduct):
    name_plural = "Товары Graude"
    icon = "fa-solid fa-tag"
    column_list = [GraudeProduct.id, GraudeProduct.name, GraudeProduct.price_public, GraudeProduct.main_image]
    column_labels = {
        GraudeProduct.id: "ID",
        GraudeProduct.name: "Название",
        GraudeProduct.price_public: "Цена (₽)",
        GraudeProduct.main_image: "Фото",
        GraudeProduct.sku: "Артикул",
    }
    column_formatters = {GraudeProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [GraudeProduct.name, GraudeProduct.sku]


class HomeierProductAdmin(BaseProductAdmin, model=HomeierProduct):
    name_plural = "Товары Homeier"
    icon = "fa-solid fa-tag"
    column_list = [HomeierProduct.id, HomeierProduct.name, HomeierProduct.price, HomeierProduct.main_image]
    column_labels = {
        HomeierProduct.id: "ID",
        HomeierProduct.name: "Название",
        HomeierProduct.price: "Цена (₽)",
        HomeierProduct.main_image: "Фото",
        HomeierProduct.sku: "Артикул",
    }
    column_formatters = {HomeierProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [HomeierProduct.name, HomeierProduct.sku]


class KuppersbuschProductAdmin(BaseProductAdmin, model=KuppersbuschProduct):
    name_plural = "Товары Kuppersbusch"
    icon = "fa-solid fa-tag"
    column_list = [KuppersbuschProduct.id, KuppersbuschProduct.name, KuppersbuschProduct.price, KuppersbuschProduct.main_image]
    column_labels = {
        KuppersbuschProduct.id: "ID",
        KuppersbuschProduct.name: "Название",
        KuppersbuschProduct.price: "Цена (₽)",
        KuppersbuschProduct.main_image: "Фото",
        KuppersbuschProduct.sku: "Артикул",
    }
    column_formatters = {KuppersbuschProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [KuppersbuschProduct.name, KuppersbuschProduct.sku]


class NivonaProductAdmin(BaseProductAdmin, model=NivonaProduct):
    name_plural = "Товары Nivona"
    icon = "fa-solid fa-tag"
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


class SchulthessProductAdmin(BaseProductAdmin, model=SchulthessProduct):
    name_plural = "Товары Schulthess"
    icon = "fa-solid fa-tag"
    column_list = [SchulthessProduct.id, SchulthessProduct.name, SchulthessProduct.price, SchulthessProduct.main_image]
    column_labels = {
        SchulthessProduct.id: "ID",
        SchulthessProduct.name: "Название",
        SchulthessProduct.price: "Цена (₽)",
        SchulthessProduct.main_image: "Фото",
        SchulthessProduct.model: "Модель",
    }
    column_formatters = {SchulthessProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [SchulthessProduct.name, SchulthessProduct.model]


class TekaProductAdmin(BaseProductAdmin, model=TekaProduct):
    name_plural = "Товары Teka"
    icon = "fa-solid fa-tag"
    column_list = [TekaProduct.id, TekaProduct.name, TekaProduct.price]
    column_labels = {
        TekaProduct.id: "ID",
        TekaProduct.name: "Название",
        TekaProduct.price: "Цена (₽)",
    }
    search_fields = [TekaProduct.name]


class BonkrasherProductAdmin(BaseProductAdmin, model=BonkrasherProduct):
    name_plural = "Товары Bonkrasher"
    icon = "fa-solid fa-tag"
    column_list = [BonkrasherProduct.id, BonkrasherProduct.name, BonkrasherProduct.price, BonkrasherProduct.main_image]
    column_labels = {
        BonkrasherProduct.id: "ID",
        BonkrasherProduct.name: "Название",
        BonkrasherProduct.price: "Цена (₽)",
        BonkrasherProduct.main_image: "Фото",
        BonkrasherProduct.sku: "Артикул",
    }
    column_formatters = {BonkrasherProduct.main_image: lambda m, a: image_formatter(m.main_image)}
    search_fields = [BonkrasherProduct.name, BonkrasherProduct.sku]


class CategoryAdmin(ModelView, model=Category):
    name_plural = "Категории"
    icon = "fa-solid fa-folder"
    column_list = [Category.id, Category.name, Category.parent_id, Category.level]
    column_labels = {
        Category.id: "ID",
        Category.name: "Название",
        Category.parent_id: "Родитель",
        Category.level: "Уровень",
    }
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
    column_formatters = {
        Order.created_at: lambda m, a: moscow_datetime_formatter(m.created_at)
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
    admin.add_view(BrandtProductAdmin)
    admin.add_view(LiebherrProductAdmin)
    admin.add_view(DedietrichProductAdmin)
    admin.add_view(FalmecProductAdmin)
    admin.add_view(GraudeProductAdmin)
    admin.add_view(HomeierProductAdmin)
    admin.add_view(KuppersbuschProductAdmin)
    admin.add_view(NivonaProductAdmin)
    admin.add_view(SchulthessProductAdmin)
    admin.add_view(TekaProductAdmin)
    admin.add_view(BonkrasherProductAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(UserAdmin)
    return admin