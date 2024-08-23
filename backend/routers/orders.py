# routers/orders.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from schemas.order import Order, OrderCreate
from crud.order import (
    crud_create_order,
    crud_get_orders_by_customer,
    crud_get_deliveries_today,
    crud_assign_order_to_delivery,
    crud_change_status,
    crud_delete_order,
    crud_get_orders_all,
    crud_get_order_by_id,
    crud_get_orders_owner_id,
)
from dependencies import get_db, get_restaurant_admin_user, get_customer_user

router = APIRouter(prefix="/orders")


# new route
@router.get("/all", response_model=List[Order])
def get_all_orders(db: Session = Depends(get_db)):
    return crud_get_orders_all(db)


# all users
@router.get("/{id}", response_model=Order)
def get_order_by_id(id: int, db: Session = Depends(get_db)):
    return crud_get_order_by_id(id=id, db=db)


# restaurant admin
@router.get("/owner/{owner_id}", response_model=List[Order])
def get_orders_of_restaurants_by(
    owner_id: int,
    # restaurant_admin: User = Depends(get_restaurant_admin_user)
    db: Session = Depends(get_db),
):
    return crud_get_orders_owner_id(owner_id=owner_id, db=db)


# Customer - Create a new order
@router.post("/new/{customer_id}", response_model=Order)
def create_new_order(
    customer_id: int,
    order: OrderCreate,
    db: Session = Depends(get_db),
    # customer: User = Depends(get_customer_user),
):
    return crud_create_order(db, order, customer_id)


@router.delete("/delete/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    return crud_delete_order(db, order_id)


# Customer - Get order history
@router.get("/history/{customer_id}", response_model=List[Order])
def get_order_history(
    customer_id: int,
    db: Session = Depends(get_db),
    # customer: User = Depends(get_customer_user)
):
    return crud_get_orders_by_customer(db, customer_id)


# Delivery Personnel - Get assigned orders for the current day
@router.get("/assigned/{delivery_personnel_id}", response_model=List[Order])
def get_assigned_orders(
    delivery_personnel_id: int,
    db: Session = Depends(get_db),
    # delivery_personnel: User = Depends(get_delivery_personnel_user),
):
    return crud_get_deliveries_today(db, delivery_personnel_id)


# Restaurant Admin - Assign order to delivery personnel
@router.put("/assign/{order_id}/{delivery_id}", response_model=Order)
def assign_order(
    order_id: int,
    delivery_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user)
):
    try:
        db_order = crud_assign_order_to_delivery(
            db, order_id, delivery_id, background_tasks
        )
        return db_order
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


# Restaurant Admin and Delivery Personnel (maybe others as well)
@router.put("/status/{order_id}/{status}", response_model=Order)
def change_status(order_id: int, status: str, db: Session = Depends(get_db)):
    return crud_change_status(db, order_id, status)
