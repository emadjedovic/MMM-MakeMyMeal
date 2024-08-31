from sqlalchemy import (
    Column,
    Integer,
    Float,
    Enum as sqlEnum,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime
from config import local_tz


class OrderStatus(enum.Enum):
    UNASSIGNED = "UNASSIGNED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN PROGRESS"
    COMPLETED = "COMPLETED"


class PaymentMethod(enum.Enum):
    CASH = "CASH"
    CARD = "CARD"


class DBOrder(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)

    status = Column(sqlEnum(OrderStatus), nullable=True, default=OrderStatus.UNASSIGNED)
    delivery_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    payment_method = Column(
        sqlEnum(PaymentMethod), nullable=False, default=PaymentMethod.CASH
    )
    total_price = Column(Float, nullable=True, default=0.0)
    preferred_arrival_time = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, nullable=True, default=datetime.now(local_tz))
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    restaurant = relationship(
        "DBRestaurant", back_populates="orders", foreign_keys=[restaurant_id]
    )

    delivery_personnel = relationship(
        "DBUser", back_populates="assigned_orders", foreign_keys=[delivery_id]
    )
    customer = relationship(
        "DBUser", back_populates="orders", foreign_keys=[customer_id]
    )

    order_items = relationship(
        "DBOrderItem",
        back_populates="order",
        foreign_keys="DBOrderItem.order_id",
        passive_deletes=True,
    )

    notifications = relationship("DBNotification", back_populates="order")
    feedback = relationship("DBCustomerFeedback", back_populates="order", uselist=False)


class DBOrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    order = relationship(
        "DBOrder", back_populates="order_items", foreign_keys=[order_id]
    )
    item = relationship("DBItem", back_populates="order_items", foreign_keys=[item_id])
