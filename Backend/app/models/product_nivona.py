from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class NivonaProduct(Base):
    __tablename__ = "products_nivona"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    main_image = Column(String(500), nullable=True)
    sku = Column(String(50), nullable=True)
    model = Column(String(100), nullable=True)
    name = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    price_public = Column(Numeric(10, 2), nullable=True)
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Отношения
    category = relationship("Category", backref="nivona_products")
    brand = relationship("Brand", backref="nivona_products")