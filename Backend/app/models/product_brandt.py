from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class BrandtProduct(Base):
    __tablename__ = "products_brandt"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    main_image = Column(String(500), nullable=True)  # Фото
    name = Column(String(255), nullable=False)  # Наименование
    model = Column(String(100), nullable=True)  # Модель
    specifications = Column(Text, nullable=True)  # Характеристики
    design = Column(Text, nullable=True)  # Дизайн
    price = Column(Numeric(10, 2), nullable=False)  # РРЦ, руб
    comment = Column(Text, nullable=True)  # Комментарий

    # Отношения
    category = relationship("Category", backref="brandt_products")
    brand = relationship("Brand", backref="brandt_products")