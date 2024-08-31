from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from config import local_tz
from models.order import OrderStatus


class OrderBase(BaseModel):
    restaurant_id: int
    payment_method: str = "CASH"
    preferred_arrival_time: Optional[datetime] = None
    total_price: float = 0.0


class OrderCreate(OrderBase):
    items_ids: List[int] = []


class Order(OrderBase):
    id: int
    customer_id: int
    created_at: datetime = datetime.now(local_tz)
    status: OrderStatus = "UNASSIGNED"
    delivery_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
