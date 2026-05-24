from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class GraudeProduct(Base):
    __tablename__ = "products_graude"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Изображение
    main_image = Column(String(500), nullable=True)  # Фото

    # Основные поля
    sku = Column(String(100), nullable=True, index=True)  # Артикул
    name = Column(String(500), nullable=False)  # Наименование
    description = Column(Text, nullable=True)  # Описание
    price_public = Column(Numeric(10, 2), nullable=True)  # РРЦ, руб

    # Временные метки
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Отношения
    category = relationship("Category", backref="graude_products")
    brand = relationship("Brand", backref="graude_products")