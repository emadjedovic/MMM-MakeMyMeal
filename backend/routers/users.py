# routers/users.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_active_user

from schemas.user import User
from crud.user import *

router = APIRouter()

# all users
@router.get("/users/me/", response_model = User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

"""
# admin only
@router.post("/users/restaurant_admin", response_model=User, status_code=status.HTTP_201_CREATED)
def create_restaurant_admin_route(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    return crud_create_restaurant_admin(db, user)

# restaurant admin only
@router.post("/users/delivery_personnel", response_model=User, status_code=status.HTTP_201_CREATED)
def create_delivery_personnel_route(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_restaurant_admin_user)):
    return crud_create_delivery_personnel(db, user)
"""
