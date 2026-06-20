from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class TekaProduct(Base):
    __tablename__ = "products_teka"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)

    name = Column(String(500), nullable=False)
    price = Column(Numeric(10, 2), default=0)
    dmd_quantity = Column(Integer, nullable=True)
    dmd_perup_quantity = Column(Integer, nullable=True)

    main_image = Column(String(500), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", backref="teka_products")
    brand = relationship("Brand", backref="teka_products")
