from pydantic import BaseModel, Field
from datetime import datetime, timedelta, timezone
from uuid import UUID


local_tz = timezone(timedelta(hours=2))


class CustomerFeedbackBase(BaseModel):
    restaurant_rating: float = Field(
        ..., ge=0.0, le=5.0, description="Rating must be between 0 and 5"
    )
    delivery_rating: float = Field(
        ..., ge=0.0, le=5.0, description="Rating must be between 0 and 5"
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
