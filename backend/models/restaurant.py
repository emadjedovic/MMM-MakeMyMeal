# models/restaurant.py

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    ForeignKey,
    Boolean,
)
from sqlalchemy.orm import relationship
from database import Base


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
    imageUrl = Column(String, nullable=False, default="restDefault.png")

    type = relationship(
        "RestaurantType", primaryjoin="RestaurantType.name == DBRestaurant.type_name"
    )
    owner = relationship("DBUser", back_populates="restaurants")
