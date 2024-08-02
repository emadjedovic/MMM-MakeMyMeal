# models/restaurant.py

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    ForeignKey,
    Enum as sqlEnum,
    Boolean,
)
from sqlalchemy.orm import relationship
from database import Base
import enum

'''
class RestaurantType(enum.Enum):
    TRADITIONAL = "TRADITIONAL"
    FAST_FOOD = "FAST FOOD"
    PIZZERIA = "PIZZERIA"
    CASUAL_DINING = "CASUAL"
    FINE_DINING = "FINE DINING"
    BAKERY = "BAKERY"
    CAFE = "CAFE"
    PUB = "PUB"
    OTHER = "OTHER"'''

class DBRestaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    street_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    star_rating = Column(Integer, nullable=True, default=None)
    type_name = Column(String, ForeignKey("restaurant_types.name"), nullable=True)
    radius_of_delivery_km = Column(Float, nullable=True, default=0)
    is_archived = Column(Boolean, nullable=True, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # imageUrl

    type = relationship("RestaurantType", primaryjoin="RestaurantType.name == DBRestaurant.type_name")  # Define relationship to RestaurantType
    owner = relationship("DBUser", back_populates="restaurants")
