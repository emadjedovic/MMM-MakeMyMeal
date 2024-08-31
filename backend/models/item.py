from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    ForeignKey,
    Boolean,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from database import Base


class DBItem(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default="No description")
    is_promoted = Column(Boolean, nullable=False, default=False)
    price = Column(Float, nullable=False)
    imageUrl = Column(String, nullable=False, default="item-images/itemDefault.png")
    is_recommended = Column(Boolean, nullable=False, default=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    food_type_name = Column(
        String, ForeignKey("food_types.name"), nullable=False, default="Other"
    )

    food_type = relationship(
        "DBFoodType", primaryjoin="DBFoodType.name == DBItem.food_type_name"
    )

    restaurant = relationship(
        "DBRestaurant", back_populates="items", foreign_keys=[restaurant_id]
    )
    promotion = relationship(
        "DBPromotion",
        uselist=False,
        back_populates="item",
        cascade="all, delete-orphan",
        foreign_keys="DBPromotion.item_id",
    )
    order_items = relationship(
        "DBOrderItem", back_populates="item", foreign_keys="DBOrderItem.item_id"
    )

    __table_args__ = (
        UniqueConstraint("id", "restaurant_id", name="unique_item_per_restaurant"),
    )
