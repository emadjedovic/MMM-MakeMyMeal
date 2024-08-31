from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import (
    get_current_user,
    get_admin_or_restaurant_admin,
    get_admin_user,
    get_db,
)
from schemas.user import User
from schemas.user import UserCreate
from crud.user import (
    crud_create_restaurant_admin,
    crud_create_delivery_personnel,
    crud_delete_user,
    crud_get_users_by_role,
    crud_get_users_all,
)
from typing import List
from models.user import UserRole

router = APIRouter(prefix="/users")


# all users
@router.get("/me", response_model=User)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


# all users
@router.delete("/me/delete")
def delete_current_user(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return crud_delete_user(db=db, id=current_user.id)


# admin
@router.post("/create/restaurant-admin", response_model=User)
async def create_restaurant_admin_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user),
):
    return crud_create_restaurant_admin(db=db, user=user)


# admin, restaurant admin
@router.post("/create/delivery-personnel", response_model=User)
async def create_delivery_personnel_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    # admins: User = Depends(get_admin_or_restaurant_admin),
):
    return crud_create_delivery_personnel(db=db, user=user)


@router.get("/role/{role}", response_model=List[User])
def read_users_by_role(role: UserRole, db: Session = Depends(get_db)):
    users = crud_get_users_by_role(db, role)
    return users


@router.get("/all", response_model=List[User])
def read_users_all(db: Session = Depends(get_db)):
    users = crud_get_users_all(db)
    return users
