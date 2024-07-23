# schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models.user import UserRole

# common fields shared among the other schemas
class UserBase(BaseModel):
    email: EmailStr

# adds the password field for creating new users
class UserCreate(UserBase):
    first_name: str
    last_name: str
    password: str
    email: EmailStr
    role: UserRole = UserRole.CUSTOMER
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserLogin(UserBase):
    email: EmailStr
    password: str
    
# similar to UserCreate but allows the password field to be optional for updates
class UserUpdate(UserBase):
    first_name: str
    last_name: str
    password: str | None = None
    disabled: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    role: UserRole = UserRole.CUSTOMER
    disabled: bool = False
    first_name: str
    last_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True

# for responses
class User(UserInDBBase):
    pass

# for internal use
class UserInDB(UserInDBBase):
    hashed_password: str