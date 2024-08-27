from sqlalchemy import Column,Integer, Numeric, Time, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base

class DBDeliveryPersonnelStats(Base):
    __tablename__ = 'delivery_personnel_stats'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    delivery_personnel_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    daily_delivered_count = Column(Integer, default=0, nullable=False)
    monthly_delivered_count = Column(Integer, default=0, nullable=False)
    avg_delivery_time = Column(Time, nullable=False, default="00:00:00")
    avg_service_rating = Column(Numeric(3, 2), default=0.00, nullable=False)

    # Relationship with DeliveryPersonnel
    delivery_personnel = relationship("DBUser", back_populates="stats")
