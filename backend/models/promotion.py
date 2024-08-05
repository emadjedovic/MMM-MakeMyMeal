# models/promotion.py

from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class DBPromotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    discount_percentage = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False, unique=True)

    item = relationship("DBItem", back_populates="promotion")
