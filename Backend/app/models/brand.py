from sqlalchemy import Column, Integer, String
from ..database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False, index=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name