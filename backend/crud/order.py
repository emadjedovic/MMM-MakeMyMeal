# crud/order.py
from sqlalchemy.orm import Session
from models.order import DBOrder, DBOrderItem, OrderStatus
from models.user import DBUser
from models.item import DBItem
from schemas.order import OrderCreate
from datetime import datetime
from fastapi import HTTPException, BackgroundTasks
from typing import List
from helpers.email import send_email
from crud.user import crud_get_user_by_id


def create_order(db: Session, order: OrderCreate, customer_id: int):
    db_order = DBOrder(
        customer_id=customer_id,
        restaurant_id=order.restaurant_id,
        status="UNASSIGNED",
        payment_method=order.payment_method,
        preferred_arrival_time=order.preferred_arrival_time,
        created_at=datetime.utcnow()
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Add items to the order
    total_price = 0.0
    for item_id in order.items_ids:
        db_item = db.query(DBItem).filter(DBItem.id == item_id).first()
        if not db_item:
            raise HTTPException(
                status_code=404, detail=f"Item with id {item_id} not found"
            )

        db_order_item = DBOrderItem(order_id=db_order.id, item_id=item_id)
        db.add(db_order_item)
        print("db_item.price: ", db_item.price)
        total_price += db_item.price

    # Update total price
    db_order.total_price = total_price
    db.commit()
    db.refresh(db_order)

    return db_order


def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status is not None:
        db_order.status = status

    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_delivery(db: Session, order_id: int, delivery_id: int):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    if delivery_id is not None:
        db_order.delivery_id = delivery_id

    db.commit()
    db.refresh(db_order)
    return db_order


def get_order_by_id(db: Session, order_id: int):
    return db.query(DBOrder).filter(DBOrder.id == order_id).first()


"""
from sqlalchemy.orm import joinedload

def get_order_by_id(db: Session, order_id: int):
    return db.query(DBOrder).options(joinedload(DBOrder.customer)).filter(DBOrder.id == order_id).first()
"""


def get_orders_by_customer(db: Session, customer_id: int):
    return db.query(DBOrder).filter(DBOrder.customer_id == customer_id).all()


def get_orders_by_delivery_personnel(
    db: Session, delivery_id: int, current_date: datetime
):
    return (
        db.query(DBOrder)
        .filter(
            DBOrder.delivery_id == delivery_id,
            DBOrder.created_at.date() == current_date.date(),
        )
        .all()
    )


def assign_order_to_delivery(
    db: Session, order_id: int, delivery_id: int, background_tasks: BackgroundTasks
):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.delivery_id = delivery_id
    db_order.status = OrderStatus.ASSIGNED

    db.commit()
    db.refresh(db_order)

    # Prepare order details for the email
    order_details = {"order_id": db_order.id, "total_price": db_order.total_price}

    # Send email in the background
    background_tasks.add_task(
        send_order_assigned_email,
        recipient=db_order.customer.email,
        order_details=order_details,
    )

    return db_order


from sqlalchemy.orm import joinedload


def send_order_assigned_email(db: Session, order_id: int):
    db_order = (
        db.query(DBOrder)
        .options(joinedload(DBOrder.customer))
        .filter(DBOrder.id == order_id)
        .first()
    )
    customer = crud_get_user_by_id(db_order.customer_id)

    if db_order and customer:
        customer_email = customer.email
        if customer_email:
            subject = "Your Order Has Been Assigned"
            body = f"Dear Customer,\n\nYour order #{order_id} has been assigned to a delivery person.\n\nThank you for using our service!"
            send_email(subject, body, recipient=customer_email)
        else:
            print("Customer email is missing.")
    else:
        print("Order or customer not found.")
