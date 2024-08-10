# schemas/order.py

from pydantic import BaseModel, Field
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from schemas.item import Item

if TYPE_CHECKING:
    from schemas.item import Item


class OrderBase(BaseModel):
    restaurant_id: int
    payment_method: str = "CASH"
    preferred_arrival_time: Optional[datetime] = None
    items_ids: List[int] = []


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int
    customer_id: int
    created_at: datetime
    status: str #updated later
    total_price: float = 0.0 # calculated after creation
    delivery_id: Optional[int] = None # assigned later by the restaurant admin

    class Config:
        from_attributes = True
