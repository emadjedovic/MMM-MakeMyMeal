from pydantic import BaseModel
from datetime import datetime


class NotificationBase(BaseModel):
    order_id: int
    type: str
    message: str


class NotificationCreate(NotificationBase):
    pass


class Notification(NotificationBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes: True
