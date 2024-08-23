from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db
from schemas.notification import Notification, NotificationCreate
from crud.notification import (
    crud_create_notification,
    crud_get_notification,
    crud_get_all_notifications,
    crud_delete_notification,
    crud_delete_all_notifications,
    crud_get_notifications_by_owner_id,
)

router = APIRouter(prefix="/notifications")


@router.post("/new/", response_model=Notification)
def create_notification_endpoint(
    notification: NotificationCreate, db: Session = Depends(get_db)
):
    return crud_create_notification(db=db, notification=notification)


@router.get("/{notification_id}", response_model=Notification)
def read_notification(notification_id: int, db: Session = Depends(get_db)):
    db_notification = crud_get_notification(db, notification_id=notification_id)
    if db_notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notification


@router.get("/all/", response_model=List[Notification])
def read_all_notifications(db: Session = Depends(get_db)):
    return crud_get_all_notifications(db=db)


@router.get("/owner/{owner_id}", response_model=List[Notification])
def read_owner_notifications(owner_id: int, db: Session = Depends(get_db)):
    return crud_get_notifications_by_owner_id(owner_id=owner_id, db=db)


@router.delete("/delete/{notification_id}")
def delete_notification_endpoint(notification_id: int, db: Session = Depends(get_db)):
    crud_delete_notification(db, notification_id=notification_id)
    return {"detail": "Notification deleted successfully."}


@router.delete("/delete/all/")
def delete_all_notifications_endpoint(db: Session = Depends(get_db)):
    crud_delete_all_notifications(db)
    return {"message": "All notifications deleted"}
