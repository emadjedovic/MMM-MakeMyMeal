# routers/orders.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from schemas.order import Order, OrderCreate
from models.order import OrderStatus
from crud.order import (
    crud_create_order,
    crud_get_orders_by_customer,
    crud_get_orders_by_delivery_personnel,
    crud_assign_order_to_delivery,
    crud_change_status,
    crud_delete_order
)
from dependencies import (
    get_db,
)

router = APIRouter(prefix="/orders")


# Customer - Create a new order
@router.post("/new", response_model=Order)
def create_new_order(
    order: OrderCreate,
    customer_id: int, # ovo kasnije izbrisati i koristiti id iz depends dole
    db: Session = Depends(get_db),
    #customer: User = Depends(get_customer_user),
):
    return crud_create_order(db, order, customer_id)

@router.delete("/delete")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    return crud_delete_order(db, order_id)


# Customer - Get order history
@router.get("/history", response_model=List[Order])
def get_order_history(
    
    customer_id: int, # ovo kasnije izbrisati i koristiti id iz depends dole
    db: Session = Depends(get_db),
    #customer: User = Depends(get_customer_user)
):
    return crud_get_orders_by_customer(db, customer_id)


# Delivery Personnel - Get assigned orders for the current day
@router.get("/assigned", response_model=List[Order])
def get_assigned_orders(
    
    delivery_personnel_id: int, # ovo kasnije izbrisati i koristiti id iz depends dole
    db: Session = Depends(get_db),
    #delivery_personnel: User = Depends(get_delivery_personnel_user),
):
    current_date = datetime.utcnow()
    return crud_get_orders_by_delivery_personnel(db, delivery_personnel_id, current_date)


# Restaurant Admin - Assign order to delivery personnel
@router.put("/assign/{order_id}", response_model=Order)
def assign_order(
    order_id: int,
    delivery_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    #restaurant_admin: User = Depends(get_restaurant_admin_user)
):
    try:
        db_order = crud_assign_order_to_delivery(db, order_id, delivery_id, background_tasks)
        return db_order
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


# Restaurant Admin
@router.put("/status/{order_id}", response_model=Order)
def change_status(
    order_id: int,
    status: OrderStatus,
    db: Session = Depends(get_db),
    #restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    return crud_change_status(db, order_id, status)
