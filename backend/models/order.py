# models/order.py

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Enum as sqlEnum,
    ForeignKey,
    DateTime,
    Text,
)
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime


class OrderStatus(enum.Enum):
    UNASSIGNED = "UNASSIGNED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PaymentMethod(enum.Enum):
    CASH = "CASH"
    CARD = "CARD"


class DBOrder(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    delivery_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(sqlEnum(OrderStatus), default=OrderStatus.UNASSIGNED)
    payment_method = Column(sqlEnum(PaymentMethod), default=PaymentMethod.CASH)
    total_price = Column(Float, default=0.0)
    preferred_arrival_time = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    restaurant = relationship(
        "DBRestaurant", back_populates="orders", foreign_keys=[restaurant_id]
    )

    delivery_personnel = relationship(
        "DBUser", back_populates="assigned_orders", foreign_keys=[delivery_id]
    )
    customer = relationship(
        "DBUser", back_populates="orders", foreign_keys=[customer_id]
    )

    items = relationship(
        "DBOrderItem", back_populates="order", foreign_keys="DBOrderItem.order_id"
    )


# An association table to manage the many-to-many relationship between DBOrder and DBItem, including the quantity of each item.
class DBOrderItem(Base):
    __tablename__ = "order_items"

    order_id = Column(Integer, ForeignKey("orders.id"), primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id"), primary_key=True)
    quantity = Column(Integer, nullable=False, default=1)

    order = relationship("DBOrder", back_populates="items", foreign_keys=[order_id])
    item = relationship("DBItem", back_populates="orders", foreign_keys=[item_id])
