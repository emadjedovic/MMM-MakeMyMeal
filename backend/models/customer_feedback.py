from sqlalchemy import Column, String, Integer, DateTime, Numeric, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
from datetime import datetime, timedelta, timezone


local_tz = timezone(timedelta(hours=2))

class DBCustomerFeedback(Base):
    __tablename__ = 'customer_feedback'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    restaurant_rating = Column(Numeric(3, 2), default=0.00, nullable=False)
    delivery_rating = Column(Numeric(3, 2), default=0.00, nullable=False)
    feedback = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.now(local_tz), nullable=False)
    would_recommend = Column(Boolean, default=False, nullable=True)

    # Relationship with Order
    order = relationship("DBOrder", back_populates="feedback")
