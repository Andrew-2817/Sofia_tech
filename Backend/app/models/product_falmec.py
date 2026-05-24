from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FalmecProduct(Base):
    __tablename__ = "products_falmec"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    main_image = Column(String(500), nullable=True)
    model = Column(String(500), nullable=True)  # Увеличено
    manufacturer_code = Column(String(200), nullable=True)  # Увеличено
    mounting_type = Column(String(200), nullable=True)  # Увеличено
    color = Column(String(200), nullable=True)  # Увеличено
    width_cm = Column(Numeric(10, 2), nullable=True)
    performance_m3h = Column(Integer, nullable=True)
    min_noise_db = Column(Integer, nullable=True)
    supply_program = Column(String(500), nullable=True)
    control_type = Column(String(300), nullable=True)  # Увеличено
    price_retail = Column(Numeric(10, 2), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="falmec_products")
    brand = relationship("Brand", backref="falmec_products")


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