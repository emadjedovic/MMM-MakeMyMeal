# models/user.py

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Enum as sqlEnum,
    Boolean,
    Float,
)
from datetime import datetime
from database import Base
import enum
from sqlalchemy.orm import relationship


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    RESTAURANT_ADMIN = "RESTAURANT ADMIN"
    CUSTOMER = "CUSTOMER"
    DELIVERY_PERSONNEL = "DELIVERY PERSONNEL"


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

    restaurants = relationship("DBRestaurant", back_populates="owner")
