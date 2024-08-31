from sqlalchemy.orm import Session
from sqlalchemy import select
from models.order import DBOrder, DBOrderItem, OrderStatus
from models.restaurant import DBRestaurant
from schemas.order import OrderCreate
from datetime import datetime, timedelta
from fastapi import HTTPException, BackgroundTasks
from helpers.sending_email import send_email
from crud.user import crud_get_user_by_id, crud_get_customer_location
from crud.restaurant import crud_get_restaurant_by_id
from typing import List, Optional
from config import local_tz


# .scalars().all() extracts the results into a list of DBOrder objects
def crud_get_orders_owner_id(owner_id: int, db: Session) -> List[DBOrder]:
    return (
        db.execute(
            select(DBOrder)
            .join(DBRestaurant, DBOrder.restaurant_id == DBRestaurant.id)
            .where(DBRestaurant.owner_id == owner_id)
        )
        .scalars()
        .all()
    )


def crud_get_orders_all(db: Session) -> List[DBOrder]:
    orders = db.query(DBOrder).all()
    return orders


def crud_get_order_by_id(db: Session, id: int) -> DBOrder:
    db_order = db.query(DBOrder).filter(DBOrder.id == id).first()
    return db_order


def crud_create_order(db: Session, order: OrderCreate, customer_id: int):
    db_order = DBOrder(
        customer_id=customer_id,
        restaurant_id=order.restaurant_id,
        status=OrderStatus.UNASSIGNED,
        payment_method=order.payment_method,
        total_price=order.total_price,
        preferred_arrival_time=order.preferred_arrival_time,
        created_at=datetime.now(local_tz),
    )

    if (
        not db_order.preferred_arrival_time
        or db_order.preferred_arrival_time < db_order.created_at
    ):
        db_order.preferred_arrival_time = db_order.created_at

    location = crud_get_customer_location(db, customer_id)
    db_order.latitude = location["latitude"]
    db_order.longitude = location["longitude"]

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    db.commit()
    db.refresh(db_order)

    return db_order


def crud_delete_order_items(db: Session, order_id: int):
    db_order_items = (
        db.query(DBOrderItem).filter(DBOrderItem.order_id == order_id).all()
    )
    for order_item in db_order_items:
        db.delete(order_item)

    db.commit()


def crud_delete_order(db: Session, order_id: int):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    crud_delete_order_items(db, order_id)
    db.delete(db_order)
    db.commit()

    return {"detail": "Order deleted successfully"}


def crud_change_status(db: Session, order_id: int, status: str):
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    if status is not None:
        try:
            db_order.status = status
        except ValueError:
            print("status:", status)
            raise HTTPException(status_code=400, detail="Invalid order status")

    db.commit()
    db.refresh(db_order)
    return db_order


def crud_get_orders_by_customer(db: Session, customer_id: int):
    return db.query(DBOrder).filter(DBOrder.customer_id == customer_id).all()


def crud_get_deliveries_today(db: Session, delivery_id: int):
    current_time = datetime.now(local_tz)
    start_of_day = datetime(
        current_time.year, current_time.month, current_time.day, tzinfo=local_tz
    )
    end_of_day = start_of_day + timedelta(days=1)

    return (
        db.query(DBOrder)
        .filter(
            DBOrder.delivery_id == delivery_id,
            DBOrder.preferred_arrival_time < end_of_day,
            DBOrder.status.in_([OrderStatus.ASSIGNED, OrderStatus.IN_PROGRESS]),
        )
        .all()
    )


def crud_get_orders_by_date_and_status(
    db: Session,
    restaurant_id: int,
    delivery_id: Optional[int],
    date: datetime,
    statuses: Optional[List[str]] = None,
):
    start_date = datetime(date.year, date.month, date.day)
    end_date = start_date + timedelta(days=1)
    today = datetime.now(local_tz).date()

    # filter by restaurant and date (mandatory)
    query = db.query(DBOrder).filter(DBOrder.restaurant_id == restaurant_id)

    if date.date() == today:
        # Today's orders: include orders in the past, but exclude COMPLETED if in the past
        query = query.filter(
            DBOrder.preferred_arrival_time >= start_date,
            DBOrder.preferred_arrival_time < end_date,
        ).filter(
            (DBOrder.preferred_arrival_time >= start_date)
            | (DBOrder.status != "COMPLETED")
        )
    elif date.date() < today:
        # Past orders: only include COMPLETED orders
        query = query.filter(
            DBOrder.preferred_arrival_time >= start_date,
            DBOrder.preferred_arrival_time < end_date,
            DBOrder.status == "COMPLETED",
        )
    else:
        # Future orders: include all statuses
        query = query.filter(
            DBOrder.preferred_arrival_time >= start_date,
            DBOrder.preferred_arrival_time < end_date,
        )

    # filter by delivery staff
    if delivery_id:
        query = query.filter(DBOrder.delivery_id == delivery_id)

    if statuses:
        query = query.filter(DBOrder.status.in_(statuses))

    return query.all()


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
        "restaurant_name": restaurant.name if restaurant else "Unknown",
    }

    # Send email in the background
    background_tasks.add_task(
        crud_send_order_assigned_email,
        recipient=customer.email,
        customer_name=customer.first_name,
        order_details=order_details,
    )

    return db_order


def crud_send_order_assigned_email(
    recipient: str, customer_name: str, order_details: dict
):
    subject = "MMM - Make My Meal"
    body = (
        f"Dear {customer_name},\n\n"
        f"Your order has been assigned to our delivery staff.\n\n"
        f"Total Price: ${order_details['total_price']}\n"
        f"Payment Method: {order_details['payment_method']}\n"
        f"Restaurant: {order_details['restaurant_name']}\n\n"
        "Best regards, Ema."
    )

    send_email(subject, body, recipient)
