from sqlalchemy import Column, Integer, Numeric, Time, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
# from uuid import UUID
from database import Base
from sqlalchemy.orm import relationship

class DBRestaurantStats(Base):
    __tablename__ = 'restaurant_stats'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'), nullable=False)
    daily_orders_count = Column(Integer, default=0, nullable=False)
    monthly_orders_count = Column(Integer, default=0, nullable=False)
    daily_revenue = Column(Numeric(10, 2), default=0.00, nullable=False)
    monthly_revenue = Column(Numeric(10, 2), default=0.00, nullable=False)
    avg_delivery_time = Column(Time, default="00:00:00", nullable=False)
    avg_service_rating = Column(Numeric(3, 2), default=0.00, nullable=False)

    restaurant = relationship("DBRestaurant", back_populates="stats")