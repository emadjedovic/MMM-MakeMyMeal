# schemas/order.py

from pydantic import BaseModel, Field
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from schemas.item import Item

if TYPE_CHECKING:
    from schemas.item import Item


class OrderBase(BaseModel):
    customer_id: int
    restaurant_id: int
    delivery_id: Optional[int] = None
    status: str = "UNASSIGNED"
    payment_method: str = "cash"
    total_price: float = 0.0
    preferred_arrival_time: Optional[datetime] = None


class OrderCreate(OrderBase):
    items: List[int]  # List of item IDs


class OrderUpdate(BaseModel):
    delivery_id: Optional[int] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None
    preferred_arrival_time: Optional[datetime] = None


class Order(OrderBase):
    id: int
    created_at: datetime
    items: List["Item"] = []  # Use forward declaration

    class Config:
        from_attributes = True
