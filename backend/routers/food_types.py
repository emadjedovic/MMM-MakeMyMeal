from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud.food_type import (
    crud_get_food_type_by_id,
    crud_get_food_types,
    crud_create_food_type,
    crud_delete_food_type,
    crud_rename_food_type,
)
from schemas.food_type import FoodTypeResponse, FoodTypeCreate
from dependencies import get_db

router = APIRouter(prefix="/food_types")


# all users
@router.get("/all", response_model=List[FoodTypeResponse])
def read_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_get_food_types(db, skip, limit)


# all users
@router.get("/{type_id}", response_model=FoodTypeResponse)
def read_type_by_id(type_id: int, db: Session = Depends(get_db)):
    db_type = crud_get_food_type_by_id(db, type_id)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type


# admin
@router.post("/add/{type_name}", response_model=FoodTypeResponse)
def create_type(
    type_name: str,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user)
):
    return crud_create_food_type(db=db, type_name=type_name)


# admin
@router.put("/rename/{old_name}", response_model=FoodTypeResponse)
def rename_food_type(
    old_name: str,
    request: FoodTypeCreate,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user),
):
    db_type = crud_rename_food_type(db=db, old_name=old_name, new_name=request.name)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Food type not found")
    return db_type


# admin
@router.delete("/delete/{type_name}", response_model=FoodTypeResponse)
def delete_type(
    type_name: str,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user)
):
    db_type = crud_delete_food_type(db, type_name)
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type
