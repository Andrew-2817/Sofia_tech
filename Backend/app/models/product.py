from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name = Column(String(500), nullable=False)
    sku = Column(String(1000), nullable=True)
    price = Column(Float, nullable=True)
    main_image = Column(String(500), nullable=True)

    description = Column(Text, nullable=True)
    color = Column(String(100), nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    depth = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    brand = relationship("Brand", backref="products")
    category = relationship("Category", backref="products")

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
