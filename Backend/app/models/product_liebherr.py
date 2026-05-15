from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class LiebherrProduct(Base):
    __tablename__ = "products_liebherr"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Основные поля
    model = Column(String(100), nullable=True)  # Model
    ean = Column(String(50), nullable=True)  # EAN
    status = Column(String(50), nullable=True)  # Status
    name = Column(String(500), nullable=False)  # Название
    category_name = Column(String(255), nullable=True)  # Категория (текстовое поле)

    # Производство и гарантия
    production_start = Column(Integer, nullable=True)  # Старт производства 2026
    factory = Column(String(255), nullable=True)  # Factory
    warranty = Column(Integer, nullable=True)  # Гарантия 2026 (в годах)

    # Цены
    price_public = Column(Numeric(10, 2), nullable=True)  # РРЦ
    price_wholesale = Column(Numeric(10, 2), nullable=True)  # ОПТ
    promo_price_public = Column(Numeric(10, 2), nullable=True)  # Промо РРЦ
    promo_price_wholesale = Column(Numeric(10, 2), nullable=True)  # Промо ОПТ

    # Временные метки
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Отношения
    category = relationship("Category", backref="liebherr_products")
    brand = relationship("Brand", backref="liebherr_products")