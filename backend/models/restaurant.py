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
    star_rating = Column(Integer, nullable=True, default=0)
    type_name = Column(
        String, ForeignKey("restaurant_types.name"), nullable=True, default="Other"
    )
    radius_of_delivery_km = Column(Float, nullable=True, default=0)
    is_archived = Column(Boolean, nullable=True, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    imageUrl = Column(
        String, nullable=True, default="restaurant-images/restDefault.png"
    )
    is_recommended = Column(Boolean, nullable=True, default=False)

    type = relationship(
        "DBRestaurantType",
        primaryjoin="DBRestaurantType.name == DBRestaurant.type_name",
    )

    owner = relationship(
        "DBUser", back_populates="restaurants", foreign_keys=[owner_id]
    )
    items = relationship(
        "DBItem",
        back_populates="restaurant",
        foreign_keys="DBItem.restaurant_id",
        cascade="all, delete-orphan",
    )
    orders = relationship(
        "DBOrder",
        back_populates="restaurant",
        foreign_keys="DBOrder.restaurant_id",
        cascade="all, delete-orphan",
    )
