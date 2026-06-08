import uuid
import json
from sqlalchemy import Column, String, Numeric, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String(50), nullable=True)
    customer_name = Column(String(200), nullable=False)
    customer_email = Column(String(200), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_address = Column(Text, nullable=False)
    items = Column(Text, nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(50), default="pending")
    customer_comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def get_items(self):
        return json.loads(self.items)

    def set_items(self, items):
        self.items = json.dumps(items)

    def __str__(self):
        return f"{self.order_number} - {self.customer_name}"

    def __repr__(self):
        return f"{self.order_number} - {self.customer_name}"