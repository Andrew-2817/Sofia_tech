from pydantic import BaseModel, Field, field_validator, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
import re

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class CategoryBase(BaseModel):
    id: int
    name: str
    slug: str
    level: int
    sort_order: int
    parent_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryResponse(CategoryBase):
    pass

class CategoryWithChildren(CategoryBase):
    children: List['CategoryWithChildren'] = []

CategoryWithChildren.model_rebuild()

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        pattern = r'^[A-Za-zА-Яа-яЁё0-9\s\-\.]+$'

        if not re.match(pattern, v):
            raise ValueError('Имя может содержать только буквы, цифры, пробелы, дефис и точку')

        # от злодеев
        forbidden = ['"', "'", '«', '»', '„', '“', '<', '>', '&', '|', ';', '`', '$', '(', ')', '[', ']', '{', '}', '\\', '/']
        for char in forbidden:
            if char in v:
                raise ValueError(f'Имя не может содержать символ: "{char}"')

        # Защита от SQL инъекций (ключевые слова)
        sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'EXEC', 'UNION']
        upper_name = v.upper()
        for keyword in sql_keywords:
            if keyword in upper_name:
                raise ValueError('Имя не может содержать SQL команды')

        # Убираем лишние пробелы и приводим к нормальному виду
        v = ' '.join(v.split())

        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        pattern = r'^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};:,.?/|\\`~]+$'

        if not re.match(pattern, v):
            raise ValueError('Пароль может содержать только английские буквы, цифры и спецсимволы (!@#$%^&*()_+-=[]{};:,.<>?/|\\`~)')

        # от злоддеев
        forbidden = ['"', "'", '«', '»', '„', '“', ' ', '\t', '\n', '\r', '<', '>', ';', '`', '&', '|']
        for char in forbidden:
            if char in v:
                raise ValueError(f'Пароль не может содержать символ: "{char}"')

        # Проверка что есть хотя бы одна цифра
        if not re.search(r'\d', v):
            raise ValueError('Пароль должен содержать хотя бы одну цифру')

        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

    @field_validator('password')
    @classmethod
    def validate_login_password(cls, v: str) -> str:
        # от злодеев
        forbidden = ['"', "'", '«', '»', '„', '“', ' ', '\t', '\n', '\r', '<', '>', ';', '`', '&', '|']
        for char in forbidden:
            if char in v:
                raise ValueError(f'Пароль не может содержать символ: "{char}"')
        return v

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


# ==================== Схемы для товаров Homeier ====================
class HomeierProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    group_level_1: Optional[str] = None
    group_level_2: Optional[str] = None
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0)
    main_image: Optional[str] = None
    comment: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    net_weight: Optional[float] = Field(None, ge=0)
    gross_weight: Optional[float] = Field(None, ge=0)

class HomeierProductCreate(HomeierProductBase):
    pass

class HomeierProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    group_level_1: Optional[str] = None
    group_level_2: Optional[str] = None
    sku: Optional[str] = Field(None, min_length=1, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[float] = Field(None, gt=0)
    main_image: Optional[str] = None
    comment: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    net_weight: Optional[float] = Field(None, ge=0)
    gross_weight: Optional[float] = Field(None, ge=0)

class HomeierProductResponse(HomeierProductBase):
    id: int

    class Config:
        from_attributes = True


# ==================== Схемы для заказов ====================
class OrderItemSchema(BaseModel):
    product_name: str
    product_sku: str
    product_price: float
    quantity: int = Field(..., gt=0)
    total_price: float

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_email: str = Field(..., min_length=1, max_length=200)
    customer_phone: str = Field(..., min_length=1, max_length=20)
    customer_address: str = Field(..., min_length=1)
    items: List[Dict[str, Any]]  # Список товаров
    total_amount: float = Field(..., gt=0)
    customer_comment: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    customer_comment: Optional[str] = None

class OrderResponse(BaseModel):
    id: UUID  # измените с str на UUID
    order_number: str
    user_id: Optional[str] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    items: List[Dict[str, Any]]
    total_amount: float
    status: str
    customer_comment: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True

# ==================== Схемы для товаров Brandt ====================
class BrandtProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=255)
    model: Optional[str] = Field(None, max_length=100)
    specifications: Optional[str] = None
    design: Optional[str] = None
    price: float = Field(..., gt=0)
    comment: Optional[str] = None

class BrandtProductCreate(BrandtProductBase):
    pass

class BrandtProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    model: Optional[str] = Field(None, max_length=100)
    specifications: Optional[str] = None
    design: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    comment: Optional[str] = None

class BrandtProductResponse(BrandtProductBase):
    id: int

    class Config:
        from_attributes = True


# ==================== Схемы для товаров Liebherr ====================
class LiebherrProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    model: Optional[str] = Field(None, max_length=100)
    ean: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, max_length=50)
    name: str = Field(..., min_length=1, max_length=500)
    category_name: Optional[str] = Field(None, max_length=255)
    production_start: Optional[int] = Field(None)  # Убираем ограничение ge=1900
    factory: Optional[str] = Field(None, max_length=255)
    warranty: Optional[int] = Field(None, ge=0, le=50)
    price_public: Optional[float] = Field(None, ge=0)
    price_wholesale: Optional[float] = Field(None, ge=0)
    promo_price_public: Optional[float] = Field(None, ge=0)
    promo_price_wholesale: Optional[float] = Field(None, ge=0)

class LiebherrProductCreate(LiebherrProductBase):
    pass

class LiebherrProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    model: Optional[str] = Field(None, max_length=100)
    ean: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    category_name: Optional[str] = Field(None, max_length=255)
    production_start: Optional[int] = Field(None)  # Убираем ограничение ge=1900
    factory: Optional[str] = Field(None, max_length=255)
    warranty: Optional[int] = Field(None, ge=0, le=50)
    price_public: Optional[float] = Field(None, ge=0)
    price_wholesale: Optional[float] = Field(None, ge=0)
    promo_price_public: Optional[float] = Field(None, ge=0)
    promo_price_wholesale: Optional[float] = Field(None, ge=0)

class LiebherrProductResponse(LiebherrProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== Схемы для товаров Dedietrich ====================
class DedietrichProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=100)
    name: str = Field(..., min_length=1, max_length=500)
    line: Optional[str] = Field(None, max_length=255)
    specifications: Optional[str] = None
    color: Optional[str] = Field(None, max_length=100)
    price_public: Optional[float] = Field(None, ge=0)
    comment: Optional[str] = None

class DedietrichProductCreate(DedietrichProductBase):
    pass

class DedietrichProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    line: Optional[str] = Field(None, max_length=255)
    specifications: Optional[str] = None
    color: Optional[str] = Field(None, max_length=100)
    price_public: Optional[float] = Field(None, ge=0)
    comment: Optional[str] = None

class DedietrichProductResponse(DedietrichProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== Схемы для товаров Nivona ====================
class NivonaProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    sku: Optional[str] = None
    model: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    price_public: Optional[float] = Field(None, gt=0)
    comment: Optional[str] = None

class NivonaProductCreate(NivonaProductBase):
    pass

class NivonaProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    sku: Optional[str] = None
    model: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    price_public: Optional[float] = Field(None, gt=0)
    comment: Optional[str] = None

class NivonaProductResponse(NivonaProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True