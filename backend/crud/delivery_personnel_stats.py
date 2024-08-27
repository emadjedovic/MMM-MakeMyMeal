from sqlalchemy.orm import Session
from models.delivery_personnel_stats import DBDeliveryPersonnelStats

def crud_create_delivery_personnel_stats(db: Session, delivery_personnel_id: int):
    db_stats = DBDeliveryPersonnelStats(
        delivery_personnel_id=delivery_personnel_id
    )
    db.add(db_stats)
    db.commit()
    db.refresh(db_stats)
    return db_stats

def crud_get_delivery_personnel_stats(db: Session, delivery_personnel_id: int):
    return db.query(DBDeliveryPersonnelStats).filter(DBDeliveryPersonnelStats.delivery_personnel_id == delivery_personnel_id).first()

def crud_reset_daily_stats(db: Session):
    db.query(DBDeliveryPersonnelStats).update({
        DBDeliveryPersonnelStats.daily_delivered_count: 0
    })
    db.commit()

def crud_reset_monthly_stats(db: Session):
    db.query(DBDeliveryPersonnelStats).update({
        DBDeliveryPersonnelStats.monthly_delivered_count: 0
    })
    db.commit()
