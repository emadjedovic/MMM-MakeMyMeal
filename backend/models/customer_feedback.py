from sqlalchemy import Column, Integer, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from datetime import datetime
from config import local_tz


class DBCustomerFeedback(Base):
    __tablename__ = "customer_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    restaurant_rating = Column(Integer, default=0, nullable=False)
    delivery_rating = Column(Integer, default=0, nullable=False)
    feedback = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.now(local_tz), nullable=False)
    would_recommend = Column(Boolean, default=False, nullable=True)

    order = relationship("DBOrder", back_populates="feedback")
