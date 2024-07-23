# models/user.py

from sqlalchemy import Column, String, Integer, DateTime, Enum as sqlEnum, Boolean, Float
from datetime import datetime
from database import Base
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    RESTAURANT_ADMIN = "restaurant_admin"
    CUSTOMER = "customer"
    DELIVERY_PERSONNEL = "delivery_personnel"

class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(sqlEnum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow())
    disabled = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationships
    # Example: orders = relationship("Order", back_populates="user")

