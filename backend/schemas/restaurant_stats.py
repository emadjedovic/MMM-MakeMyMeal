from pydantic import BaseModel, Field
from datetime import time
from uuid import UUID

class RestaurantStatsBase(BaseModel):
    daily_orders_count: int = 0
    monthly_orders_count: int = 0
    daily_revenue: float = 0.00
    monthly_revenue: float = 0.00
    avg_delivery_time: time = "00:00:00"
    avg_service_rating: float = Field(0.00, ge=0.0, le=5.0)

class RestaurantStatsCreate(RestaurantStatsBase):
    restaurant_id: int

class RestaurantStats(RestaurantStatsBase):
    id: UUID
    restaurant_id: int

    class Config:
        from_attributes = True
