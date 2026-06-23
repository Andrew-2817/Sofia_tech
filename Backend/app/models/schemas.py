from pydantic import BaseModel, Field, field_validator, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
import re

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# ==================== Схемы для товаров Elica ====================
class ElicaProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    type_of_price: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=255)
    main_image: Optional[str] = None
    model: Optional[str] = None
    actual_code: Optional[str] = None
    description: Optional[str] = None

class ElicaProductCreate(ElicaProductBase):
    pass

class ElicaProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    type_of_price: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    main_image: Optional[str] = None
    model: Optional[str] = None
    actual_code: Optional[str] = None
    description: Optional[str] = None

class ElicaProductInDB(ElicaProductBase):
    id: int
    class Config:
        from_attributes = True

# ==================== Схемы для товаров Bonkrasher ====================
class BonkrasherProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=255)
    sku: Optional[str] = None
    price: float = Field(..., gt=0)
    main_image: Optional[str] = None
    functionality: Optional[str] = None

class BonkrasherProductCreate(BonkrasherProductBase):
    pass

class BonkrasherProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    main_image: Optional[str] = None
    functionality: Optional[str] = None

class BonkrasherProductInDB(BonkrasherProductBase):
    id: int
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

# ==================== Схемы для товаров Falmec ====================
class FalmecProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=500)
    manufacturer_code: Optional[str] = Field(None, max_length=200)
    mounting_type: Optional[str] = Field(None, max_length=200)
    color: Optional[str] = Field(None, max_length=200)
    width_cm: Optional[float] = Field(None, ge=0)
    performance_m3h: Optional[int] = Field(None, ge=0)
    min_noise_db: Optional[int] = Field(None, ge=0)
    supply_program: Optional[str] = Field(None, max_length=500)
    control_type: Optional[str] = Field(None, max_length=300)
    price_retail: Optional[float] = Field(None, ge=0)

class FalmecProductCreate(FalmecProductBase):
    pass

class FalmecProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=500)
    manufacturer_code: Optional[str] = Field(None, max_length=200)
    mounting_type: Optional[str] = Field(None, max_length=200)
    color: Optional[str] = Field(None, max_length=200)
    width_cm: Optional[float] = Field(None, ge=0)
    performance_m3h: Optional[int] = Field(None, ge=0)
    min_noise_db: Optional[int] = Field(None, ge=0)
    supply_program: Optional[str] = Field(None, max_length=500)
    control_type: Optional[str] = Field(None, max_length=300)
    price_retail: Optional[float] = Field(None, ge=0)

class FalmecProductResponse(FalmecProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# ==================== Схемы для товаров Graude ====================
class GraudeProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=100)
    name: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    price_public: Optional[float] = Field(None, ge=0)

class GraudeProductCreate(GraudeProductBase):
    pass

class GraudeProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    main_image: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    price_public: Optional[float] = Field(None, ge=0)

class GraudeProductResponse(GraudeProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

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

# ==================== Схемы для товаров Ilve ====================
class IlveProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    sku: Optional[str] = Field(None, max_length=100)
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=100)
    name: str = Field(..., min_length=1, max_length=500)
    series: Optional[str] = Field(None, max_length=255)
    group: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, max_length=100)
    decor_color: Optional[str] = Field(None, max_length=100)
    width: Optional[float] = Field(None, ge=0)
    hob: Optional[str] = None
    hob_sketch: Optional[str] = None
    oven: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    ean: Optional[str] = Field(None, max_length=50)
    comment: Optional[str] = None

class IlveProductCreate(IlveProductBase):
    pass

class IlveProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    sku: Optional[str] = Field(None, max_length=100)
    main_image: Optional[str] = None
    model: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    series: Optional[str] = Field(None, max_length=255)
    group: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, max_length=100)
    decor_color: Optional[str] = Field(None, max_length=100)
    width: Optional[float] = Field(None, ge=0)
    hob: Optional[str] = None
    hob_sketch: Optional[str] = None
    oven: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    ean: Optional[str] = Field(None, max_length=50)
    comment: Optional[str] = None

class IlveProductResponse(IlveProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# ==================== Схемы для товаров Kuppersbusch ====================
class KuppersbuschProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    sku: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0)
    main_image: Optional[str] = None
    status: Optional[str] = None
    comment: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    series: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    net_weight: Optional[float] = Field(None, ge=0)

class KuppersbuschProductCreate(KuppersbuschProductBase):
    pass

class KuppersbuschProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    sku: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[float] = Field(None, gt=0)
    main_image: Optional[str] = None
    status: Optional[str] = None
    comment: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    series: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    net_weight: Optional[float] = Field(None, ge=0)

class KuppersbuschProductInDB(KuppersbuschProductBase):
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
    production_start: Optional[int] = Field(None)
    factory: Optional[str] = Field(None, max_length=255)
    warranty: Optional[int] = Field(None, ge=0, le=50)
    price_public: Optional[float] = Field(None, ge=0)
    price_wholesale: Optional[float] = Field(None, ge=0)
    promo_price_public: Optional[float] = Field(None, ge=0)
    promo_price_wholesale: Optional[float] = Field(None, ge=0)
    main_image: Optional[str] = None

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
    production_start: Optional[int] = Field(None)
    factory: Optional[str] = Field(None, max_length=255)
    warranty: Optional[int] = Field(None, ge=0, le=50)
    price_public: Optional[float] = Field(None, ge=0)
    price_wholesale: Optional[float] = Field(None, ge=0)
    promo_price_public: Optional[float] = Field(None, ge=0)
    promo_price_wholesale: Optional[float] = Field(None, ge=0)
    main_image: Optional[str] = None

class LiebherrProductResponse(LiebherrProductBase):
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
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# ==================== Схемы для товаров Schulthess ====================
class SchulthessProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    model: Optional[str] = None
    door_hinge: Optional[str] = None
    product_group: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=255)
    color: Optional[str] = None
    main_image: Optional[str] = None
    programs: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    comment: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    gross_weight: Optional[float] = Field(None, ge=0)

class SchulthessProductCreate(SchulthessProductBase):
    pass

class SchulthessProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    model: Optional[str] = None
    door_hinge: Optional[str] = None
    product_group: Optional[str] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    color: Optional[str] = None
    main_image: Optional[str] = None
    programs: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    comment: Optional[str] = None
    width: Optional[float] = Field(None, ge=0)
    height: Optional[float] = Field(None, ge=0)
    depth: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)
    gross_weight: Optional[float] = Field(None, ge=0)

class SchulthessProductInDB(SchulthessProductBase):
    id: int
    class Config:
        from_attributes = True

# ==================== Схемы для товаров Teka ====================
class TekaProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=500)
    price: float = Field(default=0, ge=0)
    dmd_quantity: Optional[int] = Field(None, ge=0)
    dmd_perup_quantity: Optional[int] = Field(None, ge=0)
    main_image: Optional[str] = None

class TekaProductCreate(TekaProductBase):
    pass

class TekaProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    price: Optional[float] = Field(None, ge=0)
    dmd_quantity: Optional[int] = Field(None, ge=0)
    dmd_perup_quantity: Optional[int] = Field(None, ge=0)
    main_image: Optional[str] = None

class TekaProductResponse(TekaProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# ==================== Другие схема (категории, заказы, пользователи) ====================
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
    password: str = Field(..., min_length=6, max_length=128)
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        pattern = r'^[A-Za-zА-Яа-яЁё0-9\s\-\.]+$'
        if not re.match(pattern, v):
            raise ValueError('Имя может содержать только буквы, цифры, пробелы, дефис и точку')
        forbidden = ['"', "'", '«', '»', '„', '“', '<', '>', '&', '|', ';', '`', '$', '(', ')', '[', ']', '{', '}', '\\', '/']
        for char in forbidden:
            if char in v:
                raise ValueError(f'Имя не может содержать символ: "{char}"')
        sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'EXEC', 'UNION']
        upper_name = v.upper()
        for keyword in sql_keywords:
            if keyword in upper_name:
                raise ValueError('Имя не может содержать SQL команды')
        v = ' '.join(v.split())
        return v
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        pattern = r'^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};:,.?/|\\`~]+$'
        if not re.match(pattern, v):
            raise ValueError('Пароль может содержать только английские буквы, цифры и спецсимволы (!@#$%^&*()_+-=[]{};:,.<>?/|\\`~)')
        forbidden = ['"', "'", '«', '»', '„', '“', ' ', '\t', '\n', '\r', '<', '>', ';', '`', '&', '|']
        for char in forbidden:
            if char in v:
                raise ValueError(f'Пароль не может содержать символ: "{char}"')
        if not re.search(r'\d', v):
            raise ValueError('Пароль должен содержать хотя бы одну цифру')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    @field_validator('password')
    @classmethod
    def validate_login_password(cls, v: str) -> str:
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
    items: List[Dict[str, Any]]
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
    id: UUID
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

# ==================== Схемы для общей таблицы Products ====================
class ProductBase(BaseModel):
    brand_id: int = Field(..., description="ID бренда")
    category_id: Optional[int] = Field(None, description="ID категории")
    name: str = Field(..., min_length=1, max_length=500, description="Название товара")
    sku: Optional[str] = Field(None, max_length=1000, description="Артикул")
    price: Optional[float] = Field(None, ge=0, description="Цена")
    main_image: Optional[str] = Field(None, description="Путь к главному изображению")
    
    # Новые поля
    description: Optional[str] = Field(None, description="Описание товара")
    color: Optional[str] = Field(None, max_length=100, description="Цвет")
    width: Optional[float] = Field(None, ge=0, description="Ширина")
    height: Optional[float] = Field(None, ge=0, description="Высота")
    depth: Optional[float] = Field(None, ge=0, description="Глубина")
    weight: Optional[float] = Field(None, ge=0, description="Вес")


class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    brand_id: Optional[int] = Field(None, description="ID бренда")
    category_id: Optional[int] = Field(None, description="ID категории")
    name: Optional[str] = Field(None, min_length=1, max_length=500, description="Название товара")
    sku: Optional[str] = Field(None, max_length=1000, description="Артикул")
    price: Optional[float] = Field(None, ge=0, description="Цена")
    main_image: Optional[str] = Field(None, description="Путь к главному изображению")
    description: Optional[str] = None
    color: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    depth: Optional[float] = None
    weight: Optional[float] = None

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True
