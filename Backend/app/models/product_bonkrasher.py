from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class BonkrasherProduct(Base):
    __tablename__ = "products_bonkrasher"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    name = Column(String(255), nullable=False)  # Наименование
    sku = Column(String(100), nullable=True)  # Артикул
    price = Column(Numeric(10, 2), nullable=False)  # РРЦ
    main_image = Column(String(500), nullable=True)  # Изображение
    functionality = Column(Text, nullable=True)  # Функционал

    # Отношения
    category = relationship("Category", backref="bonkrasher_products")
    brand = relationship("Brand", backref="bonkrasher_products")