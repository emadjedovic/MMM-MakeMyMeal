# routers/restaurant_type.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud.restaurant_type import (
    get_restaurant_type, 
    get_restaurant_types, 
    create_restaurant_type, 
    delete_restaurant_type, 
    update_restaurant_type
)
from schemas.restaurant_type import RestaurantTypeResponse, RestaurantTypeCreate
from dependencies import get_db

router = APIRouter(prefix="/restaurant_types")

@router.post("/", response_model=RestaurantTypeResponse)
def create_type(type: RestaurantTypeCreate, db: Session = Depends(get_db)):
    return create_restaurant_type(db, type)

@router.get("/{type_id}", response_model=RestaurantTypeResponse)
def read_type(type_id: int, db: Session = Depends(get_db)):
    db_type = get_restaurant_type(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type

@router.get("/", response_model=List[RestaurantTypeResponse])
def read_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_restaurant_types(db, skip, limit)

@router.delete("/{type_id}", response_model=RestaurantTypeResponse)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = delete_restaurant_type(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type

@router.put("/{type_id}", response_model=RestaurantTypeResponse)
def update_type(type_id: int, type: RestaurantTypeCreate, db: Session = Depends(get_db)):
    db_type = update_restaurant_type(db, type_id, type)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type
