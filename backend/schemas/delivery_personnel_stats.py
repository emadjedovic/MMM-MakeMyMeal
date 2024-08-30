from pydantic import BaseModel, Field
from datetime import time
from uuid import UUID

class DeliveryPersonnelStatsBase(BaseModel):
    daily_delivered_count: int = 0
    monthly_delivered_count: int = 0
    avg_delivery_time: time = "00:00:00"
    avg_service_rating: float = Field(0.00, ge=0.0, le=5.0)

class DeliveryPersonnelStatsCreate(DeliveryPersonnelStatsBase):
    delivery_personnel_id: int

class DeliveryPersonnelStats(DeliveryPersonnelStatsBase):
    id: UUID
    delivery_personnel_id: int

    class Config:
        from_attributes = True
