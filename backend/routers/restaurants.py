from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependencies import (
    get_db,
    get_customer_user,
    get_admin_user,
    get_admin_or_restaurant_admin,
    get_admin_or_customer,
)
from schemas.restaurant import (
    RestaurantCreate,
    RestaurantUpdate,
    Restaurant
)
from crud.restaurant import (
    crud_create_restaurant,
    crud_update_restaurant,
    crud_toggle_archive_restaurant,
    crud_get_restaurants_by_type,
    crud_get_all_restaurants,
    crud_get_restaurants_within_radius,
    crud_delete_restaurant,
    crud_get_restaurants_by_owner,
    crud_get_restaurants_by_type_within_radius,
    crud_get_restaurant_by_id,
)
from schemas.user import User

router = APIRouter(prefix="/restaurants")


# admin
@router.post("/new", response_model=Restaurant)
def create_restaurant(
    restaurant: RestaurantCreate,
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user),
):
    return crud_create_restaurant(db=db, restaurant=restaurant)

# admin and restaurant admin
@router.put("/update/{id}", response_model=Restaurant)
def update_restaurant(
    id: int,
    restaurant: RestaurantUpdate,
    db: Session = Depends(get_db),
    # admin_or_restaurant_admin: User = Depends(get_admin_or_restaurant_admin),
):
    return crud_update_restaurant(db=db, id=id, restaurant=restaurant)

# admin
@router.delete("/{id}", response_model=Restaurant)
def delete_restaurant(
    id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)
):
    try:
        return crud_delete_restaurant(db=db, id=id)
    except HTTPException as e:
        raise e


# all users
@router.get("/crazy_route/{id}", response_model=Restaurant)
def get_restaurant_by_id(id: int, db: Session = Depends(get_db)):
    return crud_get_restaurant_by_id(id=id, db=db)




# admin
@router.put("/{id}/toggle_archive", response_model=Restaurant)
def toggle_archive_restaurant(
    id: int, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)
):
    return crud_toggle_archive_restaurant(db=db, id=id)


# admin
@router.get("/all", response_model=List[Restaurant])
def list_all_restaurants(
    db: Session = Depends(get_db),
    # admin: User = Depends(get_admin_user),
):
    return crud_get_all_restaurants(db=db)


# admin
@router.get("/all/{type}", response_model=List[Restaurant])
def list_restaurants_by_type(
    type: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return crud_get_restaurants_by_type(db=db, type=type)



# customer
@router.get("/nearby", response_model=List[Restaurant])
def nearby_restaurants(
    db: Session = Depends(get_db),
    customer: User = Depends(get_customer_user),
):
    return crud_get_restaurants_within_radius(db=db, user=customer)


# customer
@router.get("/nearby/{type}", response_model=List[Restaurant])
def nearby_restaurants_by_type(
    type: str,
    db: Session = Depends(get_db),
    customer: User = Depends(get_customer_user),
):
    return crud_get_restaurants_by_type_within_radius(db=db, user=customer, type=type)


# admin, restaurant admin
@router.get("/owner/{owner_id}", response_model=List[Restaurant])
def list_restaurants_by_owner(
    owner_id: int,
    db: Session = Depends(get_db),
    admin_or_restaurant_admin: User = Depends(get_admin_or_restaurant_admin),
):
    return crud_get_restaurants_by_owner(db=db, owner_id=owner_id)
