from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ElicaProduct(Base):
    __tablename__ = "products_elica"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    type_of_price = Column(String(100), nullable=True)  # Type of Price
    name = Column(String(255), nullable=False)  # Название
    main_image = Column(String(500), nullable=True)  # Изображение
    model = Column(String(100), nullable=True)  # Model
    actual_code = Column(String(100), nullable=True)  # Actual code
    description = Column(Text, nullable=True)  # Description

    # Отношения
    category = relationship("Category", backref="elica_products")
    brand = relationship("Brand", backref="elica_products")