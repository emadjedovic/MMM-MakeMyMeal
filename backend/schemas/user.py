# schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models.user import UserRole
from schemas.restaurant import Restaurant
from schemas.order import Order


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str
    latitude: Optional[float] = None  # Customer only
    longitude: Optional[float] = None  # Customer only
    restaurant_id: Optional[int] = None  # Delivery Personnel only


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    role: UserRole = UserRole.CUSTOMER
    disabled: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    restaurant_id: Optional[int] = None  # Delivery Personnel only
    assigned_orders: List[Order] = []  # Delivery Personnel only

    class Config:
        from_attributes = True


class UserInDB(User):
    hashed_password: str


class UserWithRestaurants(UserInDB):
    restaurants: List[Restaurant] = []  # Restaurant Admin only
