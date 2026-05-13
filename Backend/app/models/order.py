import uuid
from sqlalchemy import Column, String, Numeric, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import json

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String(50), nullable=True)  # UUID пользователя как строка
    customer_name = Column(String(200), nullable=False)
    customer_email = Column(String(200), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_address = Column(Text, nullable=False)
    items = Column(Text, nullable=False)  # JSON строка
    total_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(50), default="pending")
    customer_comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def get_items(self):
        """Получить items как Python объект"""
        return json.loads(self.items)

    def set_items(self, items):
        """Установить items из Python объекта"""
        self.items = json.dumps(items)