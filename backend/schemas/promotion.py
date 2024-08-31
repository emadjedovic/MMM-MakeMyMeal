from pydantic import BaseModel
from typing import Optional
from datetime import date


class PromotionBase(BaseModel):
    discount_fraction: float
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class PromotionCreate(PromotionBase):
    item_id: int

    def __init__(self, **data):
        super().__init__(**data)
        if self.start_date is None:
            self.start_date = date.today()


class PromotionUpdate(BaseModel):
    discount_fraction: Optional[float] = None
    end_date: Optional[date] = None


class Promotion(PromotionBase):
    id: int
    item_id: int

    class Config:
        from_attributes = True
