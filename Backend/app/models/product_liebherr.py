from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class LiebherrProduct(Base):
    __tablename__ = "products_liebherr"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    model = Column(String(100), nullable=True)
    ean = Column(String(50), nullable=True)
    status = Column(String(50), nullable=True)
    name = Column(String(500), nullable=False)
    category_name = Column(String(255), nullable=True)

    production_start = Column(Integer, nullable=True)
    factory = Column(String(255), nullable=True)
    warranty = Column(Integer, nullable=True)

    price_public = Column(Numeric(10, 2), nullable=True)
    price_wholesale = Column(Numeric(10, 2), nullable=True)
    promo_price_public = Column(Numeric(10, 2), nullable=True)
    promo_price_wholesale = Column(Numeric(10, 2), nullable=True)

    main_image = Column(String(500), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="liebherr_products")
    brand = relationship("Brand", backref="liebherr_products")
