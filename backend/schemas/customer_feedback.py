from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from config import local_tz


class CustomerFeedbackBase(BaseModel):
    restaurant_rating: int = Field(
        ..., ge=0, le=5, description="Rating must be between 0 and 5"
    )
    delivery_rating: int = Field(
        ..., ge=0, le=5, description="Rating must be between 0 and 5"
    )
    feedback: str = None
    timestamp: datetime = datetime.now(local_tz)
    would_recommend: bool = False


class CustomerFeedbackCreate(CustomerFeedbackBase):
    order_id: int


class CustomerFeedback(CustomerFeedbackBase):
    id: UUID
    order_id: int

    class Config:
        from_attributes = True
