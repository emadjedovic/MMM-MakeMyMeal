# crud/order.py
from sqlalchemy.orm import Session
from models.order import DBOrder, DBOrderItem, OrderStatus
from models.item import DBItem
from schemas.order import OrderCreate
from datetime import datetime, timedelta
from fastapi import HTTPException, BackgroundTasks
from helpers.email import send_email
from crud.user import crud_get_user_by_id
from crud.restaurant import crud_get_restaurant_by_id


def crud_create_order(db: Session, order: OrderCreate, customer_id: int):
    db_order = DBOrder(
        customer_id=customer_id,
        restaurant_id=order.restaurant_id,
        status=OrderStatus.UNASSIGNED,
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

def crud_delete_order_items(db: Session, order_id: int):
    db_order_items = db.query(DBOrderItem).filter(DBOrderItem.order_id == order_id).all() # a list
    for order_item in db_order_items:
        db.delete(order_item)
    
    db.commit()

# for testing purposes only
def crud_delete_order(db: Session, order_id: int):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    crud_delete_order_items(db, order_id)
    db.delete(db_order)
    db.commit()
    
    return {"detail": "Order deleted successfully"}


def crud_change_status(db: Session, order_id: int, status: OrderStatus):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status is not None:
        db_order.status = status

    db.commit()
    db.refresh(db_order)
    return db_order


def crud_get_order_by_id(db: Session, order_id: int):
    return db.query(DBOrder).filter(DBOrder.id == order_id).first()


"""
from sqlalchemy.orm import joinedload

def get_order_by_id(db: Session, order_id: int):
    return db.query(DBOrder).options(joinedload(DBOrder.customer)).filter(DBOrder.id == order_id).first()
"""


def crud_get_orders_by_customer(db: Session, customer_id: int):
    return db.query(DBOrder).filter(DBOrder.customer_id == customer_id).all()


def crud_get_orders_by_delivery_personnel(db: Session, delivery_id: int, current_date: datetime):
    start_of_day = datetime(current_date.year, current_date.month, current_date.day)
    end_of_day = start_of_day + timedelta(days=1)

    return (
        db.query(DBOrder)
        .filter(
            DBOrder.delivery_id == delivery_id,
            DBOrder.created_at >= start_of_day,
            DBOrder.created_at < end_of_day,
        )
        .all()
    )



def crud_assign_order_to_delivery(
    db: Session, order_id: int, delivery_id: int, background_tasks: BackgroundTasks
):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.delivery_id = delivery_id
    db_order.status = OrderStatus.ASSIGNED

    db.commit()
    db.refresh(db_order)

    
    customer = crud_get_user_by_id(db, db_order.customer_id)
    restaurant = crud_get_restaurant_by_id(db, db_order.restaurant_id)
    payment_method = db_order.payment_method

    order_details = {
        "total_price": db_order.total_price,
        "payment_method": payment_method.value,
        "restaurant_name": restaurant.name if restaurant else "Unknown"}


    # Send email in the background
    background_tasks.add_task(
        crud_send_order_assigned_email,
        recipient=customer.email,
        customer_name=customer.first_name,
        order_details=order_details,
    )

    return db_order


def crud_send_order_assigned_email(recipient: str, customer_name: str, order_details: dict):
    subject = "MMM - Make My Meal"
    body = (f"Dear {customer_name},\n\n"
            f"Your order has been assigned to our delivery staff.\n\n"
            f"Total Price: ${order_details['total_price']}\n"
            f"Payment Method: {order_details['payment_method']}\n"
            f"Restaurant: {order_details['restaurant_name']}\n\n"
            "Best regards, Ema.")

    send_email(subject, body, recipient)

'''
def crud_send_order_assigned_email(recipient: str, customer_name: str, order_details: dict):
    subject = "MMM - Make My Meal"
    body = ("špašiošamtemišumali <333333333")

    send_email(subject, body, recipient)'''



