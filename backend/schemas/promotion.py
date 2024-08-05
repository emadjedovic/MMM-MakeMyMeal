from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PromotionBase(BaseModel):
    discount_percentage: float
    end_date: datetime

class PromotionCreate(PromotionBase):
    item_id: int

class PromotionUpdate(BaseModel):
    discount_percentage: Optional[float] = None
    end_date: Optional[datetime] = None

class Promotion(PromotionBase):
    id: int
    start_date: datetime

    class Config:
        from_attributes = True
