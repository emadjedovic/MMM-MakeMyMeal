from sqlalchemy.orm import Session
from models.notification import DBNotification
from schemas.notification import NotificationCreate, Notification
from typing import List
from models.order import DBOrder
from models.restaurant import DBRestaurant
from datetime import datetime
from config import local_tz


def crud_create_notification(db: Session, notification: NotificationCreate):
    db_notification = DBNotification(
        order_id=notification.order_id,
        type=notification.type,
        message=notification.message,
    )
    db_notification.timestamp = datetime.now(local_tz)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def crud_get_notification(db: Session, notification_id: int):
    return db.query(DBNotification).filter(DBNotification.id == notification_id).first()


def crud_get_all_notifications(db: Session) -> List[Notification]:
    notifs = db.query(DBNotification).all()
    return notifs


def crud_get_notifications_by_owner_id(db: Session, owner_id: int):
    notifications = (
        db.query(DBNotification)
        .join(DBOrder, DBNotification.order_id == DBOrder.id)
        .join(DBRestaurant, DBOrder.restaurant_id == DBRestaurant.id)
        .filter(DBRestaurant.owner_id == owner_id)
        .all()
    )
    return notifications


def crud_delete_notification(db: Session, notification_id: int):
    db_notification = (
        db.query(DBNotification).filter(DBNotification.id == notification_id).first()
    )
    if db_notification:
        db.delete(db_notification)
        db.commit()
    return {"detail": "Notification deleted successfully"}


def crud_delete_all_notifications(db: Session):
    db.query(DBNotification).delete()
    db.commit()
    return {"detail": "All notifications deleted."}
