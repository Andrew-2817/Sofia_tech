from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TekaProduct(Base):
    __tablename__ = "products_teka"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    name = Column(String(500), nullable=False)  # Название
    price = Column(Numeric(10, 2), default=0)  # Цена
    dmd_quantity = Column(Integer, nullable=True)  # DMD, кол-во
    dmd_perup_quantity = Column(Integer, nullable=True)  # DMD_PERUP, кол-во

    # Временные метки
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Отношения
    category = relationship("Category", backref="teka_products")
    brand = relationship("Brand", backref="teka_products")


# ==================== Схемы для товаров Teka ====================
class TekaProductBase(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=500)
    price: float = Field(default=0, ge=0)
    dmd_quantity: Optional[int] = Field(None, ge=0)
    dmd_perup_quantity: Optional[int] = Field(None, ge=0)


class TekaProductCreate(TekaProductBase):
    pass


class TekaProductUpdate(BaseModel):
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    price: Optional[float] = Field(None, ge=0)
    dmd_quantity: Optional[int] = Field(None, ge=0)
    dmd_perup_quantity: Optional[int] = Field(None, ge=0)


class TekaProductResponse(TekaProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True