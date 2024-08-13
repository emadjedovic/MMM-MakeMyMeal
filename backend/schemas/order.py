# schemas/order.py

from pydantic import BaseModel, Field
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, timezone, timedelta
from schemas.item import Item
from models.order import OrderStatus

if TYPE_CHECKING:
    from schemas.item import Item


class OrderBase(BaseModel):
    restaurant_id: int
    payment_method: str = "CASH"
    preferred_arrival_time: Optional[datetime] = None

class OrderCreate(OrderBase):
    items_ids: List[int] = []

local_tz = timezone(timedelta(hours=2))
class Order(OrderBase):
    id: int
    customer_id: int
    created_at: datetime = datetime.now(local_tz)
    status: OrderStatus = "UNASSIGNED" #updated later
    total_price: float = 0.0 # calculated after creation
    delivery_id: Optional[int] = None # assigned later by the restaurant admin

    class Config:
        from_attributes = True
