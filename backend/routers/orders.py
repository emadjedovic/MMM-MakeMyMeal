# routers/orders.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from schemas.order import Order, OrderCreate, OrderUpdate
from schemas.user import User
from crud.order import (
    create_order,
    update_order,
    get_order_by_id,
    get_orders_by_customer,
    get_orders_by_delivery_personnel,
    assign_order_to_delivery,
)
from dependencies import (
    get_db,
    get_customer_user,
    get_restaurant_admin_user,
    get_delivery_personnel_user,
)

router = APIRouter(prefix="/orders")


# Customer - Create a new order
@router.post("/", response_model=Order)
def create_new_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    customer: User = Depends(get_customer_user),
):
    return create_order(db, order, customer.id)


# Customer - Get order history
@router.get("/history", response_model=List[Order])
def get_order_history(
    db: Session = Depends(get_db), customer: User = Depends(get_customer_user)
):
    return get_orders_by_customer(db, customer.id)


# Delivery Personnel - Get assigned orders for the current day
@router.get("/assigned", response_model=List[Order])
def get_assigned_orders(
    db: Session = Depends(get_db),
    delivery_personnel: User = Depends(get_delivery_personnel_user),
):
    current_date = datetime.utcnow()
    return get_orders_by_delivery_personnel(db, delivery_personnel.id, current_date)


# Restaurant Admin - Assign order to delivery personnel
@router.put("/assign/{order_id}", response_model=Order)
def assign_order(
    order_id: int,
    delivery_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    restaurant_admin: User = Depends(get_restaurant_admin_user)
):
    try:
        db_order = assign_order_to_delivery(db, order_id, delivery_id, background_tasks)
        return db_order
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


# Restaurant Admin - Update order status or delivery personnel
@router.put("/update/{order_id}", response_model=Order)
def update_order_status_or_delivery(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    return update_order(db, order_id, order_update)
