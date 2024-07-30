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


class RestaurantType(enum.Enum):
    TRADITIONAL = "TRADITIONAL"
    FAST_FOOD = "FAST FOOD"
    PIZZERIA = "PIZZERIA"
    CASUAL_DINING = "CASUAL"
    FINE_DINING = "FINE DINING"
    BAKERY = "BAKERY"
    CAFE = "CAFE"
    PUB = "PUB"
    OTHER = "OTHER"


"""
The user with role of "RESTAURANT ADMIN" can be the owner of one or multiple restaurants. Only "ADMIN" can create restaurants and archive them, not "RESTAURANT ADMINS". Both can update restaurants. Admin can create a user with role "RESTAURANT ADMIN" and "DELIVERY PERSONNEL". Restaurant admin can create "DELIVERY PERSONNEL" as well. One delivery personnel is tied to only one restaurant. All users have an option to have listed all restaurant types and to click on the type to see the list of restaurants of that type. Customers have an option to view all the restaurants if the customer is located within the radius of delivery of those restaurants.
"""


class DBRestaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    street_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    star_rating = Column(Integer, nullable=True, default=None)
    type = Column(sqlEnum(RestaurantType), nullable=True, default=RestaurantType.OTHER)
    radius_of_delivery_km = Column(Float, nullable=True, default=0)
    is_archived = Column(Boolean, nullable=True, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("DBUser", back_populates="restaurants")

    # orders = relationship("DBOrder", back_populates="restaurant")
