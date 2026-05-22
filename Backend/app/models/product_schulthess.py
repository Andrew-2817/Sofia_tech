from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class SchulthessProduct(Base):
    __tablename__ = "products_schulthess"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    model = Column(String(100), nullable=True)  # Модель
    door_hinge = Column(String(100), nullable=True)  # Навеска дверцы
    product_group = Column(String(100), nullable=True)  # Группа товара
    name = Column(String(255), nullable=False)  # Наименование товара
    color = Column(String(100), nullable=True)  # Цвет
    main_image = Column(String(500), nullable=True)  # Фото
    programs = Column(Text, nullable=True)  # Программы
    description = Column(Text, nullable=True)  # Описание
    price = Column(Numeric(10, 2), nullable=False)  # РРЦ Рубли
    comment = Column(Text, nullable=True)  # Комментарий
    
    # Габариты упаковки
    width = Column(Numeric(10, 2), nullable=True)  # Ширина упаковки (м)
    height = Column(Numeric(10, 2), nullable=True)  # Высота упаковки (м)
    depth = Column(Numeric(10, 2), nullable=True)  # Глубина упаковки (м)
    volume = Column(Numeric(10, 3), nullable=True)  # Объем (м3) упаковки
    gross_weight = Column(Numeric(10, 2), nullable=True)  # Вес брутто, кг

    # Отношения
    category = relationship("Category", backref="schulthess_products")
    brand = relationship("Brand", backref="schulthess_products")