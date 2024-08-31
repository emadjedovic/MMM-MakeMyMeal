from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.user import User
from dependencies import (
    get_db,
    get_customer_user,
)
from schemas.item import Item, ItemCreate, ItemUpdate
from crud.item import (
    crud_create_item,
    crud_get_recommended_items,
    crud_get_recommended_items_within_radius,
    crud_get_items_by_restaurant,
    crud_delete_item,
    crud_get_item_by_id,
    crud_get_items_by_food_type,
    crud_get_items_by_name,
    crud_update_item,
    crud_get_all_items,
    crud_toggle_recommend_item,
    crud_get_promoted_items,
)

router = APIRouter(prefix="/items")


# all users
@router.get("/", response_model=List[Item])
def read_items(db: Session = Depends(get_db)):
    items = crud_get_all_items(db)
    return items


# all users
@router.get("/restaurant/{restaurant_id}", response_model=List[Item])
def read_items_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    items = crud_get_items_by_restaurant(db, restaurant_id)
    return items


# all users
@router.get("/search-name/{restaurant_id}/{item_name}", response_model=List[Item])
def search_items_by_by_name(
    restaurant_id: int, item_name: str, db: Session = Depends(get_db)
):
    items = crud_get_items_by_name(db, item_name, restaurant_id)
    return items


# all users
@router.get("/search-type/{restaurant_id}/{food_type_name}", response_model=List[Item])
def search_items_by_type(
    restaurant_id: int, food_type_name: str, db: Session = Depends(get_db)
):
    items = crud_get_items_by_food_type(db, food_type_name, restaurant_id)
    return items


# all users
@router.get("/recommended", response_model=List[Item])
def read_recommended_items(db: Session = Depends(get_db)):
    items = crud_get_recommended_items(db)
    return items


# customers
@router.get("/recommended_nearby", response_model=List[Item])
def get_recommended_items_within_radius(
    db: Session = Depends(get_db), customer: User = Depends(get_customer_user)
):
    items = crud_get_recommended_items_within_radius(db=db, user=customer)
    return items


# all users
@router.get("/promoted", response_model=List[Item])
def read_promoted_items(db: Session = Depends(get_db)):
    items = crud_get_promoted_items(db)
    return items


# restaurant admin
@router.post("/create", response_model=Item)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    return crud_create_item(db, item)


# restaurant admin
@router.put("/update/{item_id}", response_model=Item)
def update_item(
    item_id: int,
    item_update: ItemUpdate,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    db_item = crud_get_item_by_id(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud_update_item(db, item_id, item_update)


# restaurant admin
@router.delete("/delete/{item_id}", response_model=Item)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    db_item = crud_get_item_by_id(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud_delete_item(db, item_id)


# admin, restaurant admin
@router.put("/toggle_recommend/{id}", response_model=Item)
def toggle_recommend_item(
    id: int,
    db: Session = Depends(get_db),
    # admins: User = Depends(get_admin_or_restaurant_admin),
):
    return crud_toggle_recommend_item(db=db, id=id)
