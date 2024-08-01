# schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models.user import UserRole
from schemas.restaurant import Restaurant


# common fields shared among the other schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


# adds the password field for creating new users
class UserCreate(UserBase):
    password: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


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

    class Config:
        from_attributes = True

# for internal use
class UserInDB(User):
    hashed_password: str


# Extended response schema with related restaurants for RESTAURANT_ADMIN
class UserWithRestaurants(UserInDB):
    restaurants: List[Restaurant] = []
