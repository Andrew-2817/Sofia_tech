from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class IlveProduct(Base):
    __tablename__ = "products_ilve"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)
    sku = Column(String(100), unique=True, index=True, nullable=True)

    main_image = Column(String(500), nullable=True)
    model = Column(String(100), nullable=True)
    name = Column(String(500), nullable=False)
    series = Column(String(255), nullable=True)
    group = Column(String(255), nullable=True)
    color = Column(String(100), nullable=True)
    decor_color = Column(String(100), nullable=True)
    width = Column(Numeric(10, 2), nullable=True)
    hob = Column(Text, nullable=True)
    hob_sketch = Column(Text, nullable=True)
    oven = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    status = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    ean = Column(String(50), nullable=True)
    comment = Column(Text, nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="ilve_products")
    brand = relationship("Brand", backref="ilve_products")