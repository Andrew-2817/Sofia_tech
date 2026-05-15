from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class DedietrichProduct(Base):
    __tablename__ = "products_dedietrich"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Изображение
    main_image = Column(String(500), nullable=True)  # Фото

    # Основные поля
    model = Column(String(100), nullable=True)  # Модель
    name = Column(String(500), nullable=False)  # Наименование
    line = Column(String(255), nullable=True)  # Линейка
    specifications = Column(Text, nullable=True)  # Характеристики
    color = Column(String(100), nullable=True)  # Цвет
    price_public = Column(Numeric(10, 2), nullable=True)  # РРЦ, руб
    comment = Column(Text, nullable=True)  # Комментарий

    # Временные метки
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Отношения
    category = relationship("Category", backref="dedietrich_products")
    brand = relationship("Brand", backref="dedietrich_products")