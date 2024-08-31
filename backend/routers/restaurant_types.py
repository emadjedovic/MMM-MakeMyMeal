from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud.restaurant_type import (
    crud_get_restaurant_type_by_id,
    crud_get_restaurant_types,
    crud_create_restaurant_type,
    crud_delete_restaurant_type,
    crud_rename_restaurant_type,
)
from schemas.restaurant_type import RestaurantTypeResponse, RestaurantTypeCreate
from dependencies import get_db, get_admin_user

router = APIRouter(prefix="/restaurant_types")


# all users
@router.get("/all", response_model=List[RestaurantTypeResponse])
def read_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_get_restaurant_types(db, skip, limit)


# all users
@router.get("/{type_id}", response_model=RestaurantTypeResponse)
def read_type_by_id(type_id: int, db: Session = Depends(get_db)):
    db_type = crud_get_restaurant_type_by_id(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type


# admin
@router.post("/add/{type_name}", response_model=RestaurantTypeResponse)
def create_type(
    type_name: str,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user)
):
    return crud_create_restaurant_type(db=db, type_name=type_name)


# admin
@router.put("/rename/{old_name}", response_model=RestaurantTypeResponse)
def rename_restaurant_type(
    old_name: str,
    request: RestaurantTypeCreate,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user),
):
    db_type = crud_rename_restaurant_type(
        db=db, old_name=old_name, new_name=request.name
    )
    if db_type is None:
        raise HTTPException(status_code=404, detail="Restaurant type not found")
    return db_type


# admin
@router.delete("/delete/{type_name}", response_model=RestaurantTypeResponse)
def delete_type(
    type_name: str,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user)
):
    db_type = crud_delete_restaurant_type(db, type_name)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type
