from sqlalchemy import Column, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
# from uuid import UUID
from database import Base
from datetime import datetime, timedelta, timezone


local_tz = timezone(timedelta(hours=2))


class DBOrderAssignments(Base):
    __tablename__ = "order_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    delivery_personnel_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.now(local_tz), nullable=False) #when the status of order turns to "ASSIGNED"
    delivery_start_time = Column(DateTime, nullable=True) #when the status of orders turns to "IN PROGRESS"
    delivery_end_time = Column(DateTime, nullable=True) #when the status of orders turns to "COMPLETED"

    order = relationship("DBOrder", back_populates="assignments")
    delivery_personnel = relationship("DBUser", back_populates="assignments")
