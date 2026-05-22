from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class KuppersbuschProduct(Base):
    __tablename__ = "products_kuppersbusch"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    # Поля из Excel
    sku = Column(String(100), nullable=True)  # Артикул
    name = Column(String(255), nullable=False)  # Наименование товара
    price = Column(Numeric(10, 2), nullable=False)  # РРЦ Рубли
    main_image = Column(String(500), nullable=True)  # Фото/Изображение
    status = Column(String(50), nullable=True)  # Статус
    comment = Column(Text, nullable=True)  # Комментарий
    color = Column(String(100), nullable=True)  # Цвет прибора
    description = Column(Text, nullable=True)  # Описание
    series = Column(String(100), nullable=True)  # Серия
    
    # Габариты упаковки
    width = Column(Numeric(10, 2), nullable=True)  # Ширина (м) упаковки
    height = Column(Numeric(10, 2), nullable=True)  # Высота (м) упаковки
    depth = Column(Numeric(10, 2), nullable=True)  # Глубина (м) упаковки
    volume = Column(Numeric(10, 3), nullable=True)  # Объем (м3) упаковки
    net_weight = Column(Numeric(10, 2), nullable=True)  # Вес нетто

    # Отношения
    category = relationship("Category", backref="kuppersbusch_products")
    brand = relationship("Brand", backref="kuppersbusch_products")