from sqlalchemy.orm import Session
from models.restaurant_stats import DBRestaurantStats

def crud_create_restaurant_stats(db: Session, restaurant_id: int):
    db_restaurant_stats = DBRestaurantStats(
        restaurant_id=restaurant_id
    )
    db.add(db_restaurant_stats)
    db.commit()
    db.refresh(db_restaurant_stats)
    return db_restaurant_stats

def crud_reset_daily_stats(db: Session):
    db.query(DBRestaurantStats).update({
        DBRestaurantStats.daily_orders_count: 0,
        DBRestaurantStats.daily_revenue: 0.00
    })
    db.commit()

def crud_reset_monthly_stats(db: Session):
    db.query(DBRestaurantStats).update({
        DBRestaurantStats.monthly_orders_count: 0,
        DBRestaurantStats.monthly_revenue: 0.00
    })
    db.commit()

def crud_get_restaurant_stats(db: Session, restaurant_id: int):
    return db.query(DBRestaurantStats).filter(DBRestaurantStats.restaurant_id == restaurant_id).first()
