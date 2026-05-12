# табллица для товаров номер 4 
from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class HomeierProduct(Base):
    __tablename__ = "products_homeier"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Группы
    group_level_1 = Column(String(100), nullable=True)  # Группа I уровня
    group_level_2 = Column(String(100), nullable=True)  # Группа II уровень

    # Основные поля
    sku = Column(String(50), unique=True, nullable=False, index=True)  # Артикул
    name = Column(String(255), nullable=False)  # Название
    price = Column(Numeric(10, 2), nullable=False)  # Цена
    main_image = Column(String(500), nullable=True)  # Фото/Изображение

    # Описание
    comment = Column(Text, nullable=True)  # Комментарий
    description = Column(Text, nullable=True)  # Описание

    # Характеристики
    color = Column(String(50), nullable=True)  # Цвет прибора

    # Габариты упаковки (метры)
    width = Column(Numeric(8, 3), nullable=True)   # Ширина (м) упаковки
    height = Column(Numeric(8, 3), nullable=True)  # Высота (м) упаковки
    depth = Column(Numeric(8, 3), nullable=True)   # Глубина (м) упаковки
    volume = Column(Numeric(10, 3), nullable=True) # Объем (м3) упаковки

    # Вес (кг)
    net_weight = Column(Numeric(8, 2), nullable=True)   # Вес нетто (кг)
    gross_weight = Column(Numeric(8, 2), nullable=True) # Вес брутто (кг)

    # Отношения
    category = relationship("Category", backref="homeier_products")
    brand = relationship("Brand", backref="homeier_products")