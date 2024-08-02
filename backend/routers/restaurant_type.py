# routers/restaurant_type.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud.restaurant_type import (
    get_restaurant_type,
    get_restaurant_types,
    create_restaurant_type,
    delete_restaurant_type,
    update_restaurant_type,
)
from schemas.restaurant_type import RestaurantTypeResponse, RestaurantTypeCreate
from dependencies import get_db, get_admin_user
from schemas.user import User

router = APIRouter(prefix="/restaurant_types")


# admin
@router.post("/", response_model=RestaurantTypeResponse)
def create_type(
    type: RestaurantTypeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return create_restaurant_type(db, type)


# all users
@router.get("/{type_id}", response_model=RestaurantTypeResponse)
def read_type(type_id: int, db: Session = Depends(get_db)):
    db_type = get_restaurant_type(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type


# all users
@router.get("/", response_model=List[RestaurantTypeResponse])
def read_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_restaurant_types(db, skip, limit)


# admin
@router.delete("/{type_id}", response_model=RestaurantTypeResponse)
def delete_type(
    type_id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)
):
    db_type = delete_restaurant_type(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type


# admin
@router.put("/{type_id}", response_model=RestaurantTypeResponse)
def update_type(
    type_id: int,
    type: RestaurantTypeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    db_type = update_restaurant_type(db, type_id, type)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type
