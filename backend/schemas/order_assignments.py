from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from uuid import UUID


local_tz = timezone(timedelta(hours=2))

class OrderAssignmentsBase(BaseModel):
    order_id: int
    delivery_personnel_id: int

class OrderAssignmentsCreate(OrderAssignmentsBase):
    pass

class OrderAssignments(OrderAssignmentsBase):
    id: UUID
    assigned_at: datetime = datetime.now(local_tz) # time of creation
    delivery_start_time: datetime = None
    delivery_end_time: datetime = None

    class Config:
        from_attributes = True
