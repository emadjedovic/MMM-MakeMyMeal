# crud/restaurant_type.py
from sqlalchemy.orm import Session
from models.restaurant_type import RestaurantType
from schemas.restaurant_type import RestaurantTypeCreate


def get_restaurant_type(db: Session, type_id: int):
    return db.query(RestaurantType).filter(RestaurantType.id == type_id).first()


def get_restaurant_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(RestaurantType).offset(skip).limit(limit).all()


def create_restaurant_type(db: Session, type: RestaurantTypeCreate):
    db_type = RestaurantType(name=type.name)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


def delete_restaurant_type(db: Session, type_id: int):
    db_type = db.query(RestaurantType).filter(RestaurantType.id == type_id).first()
    if db_type:
        db.delete(db_type)
        db.commit()
    return db_type


def update_restaurant_type(db: Session, type_id: int, type: RestaurantTypeCreate):
    db_type = db.query(RestaurantType).filter(RestaurantType.id == type_id).first()
    if db_type:
        db_type.name = type.name
        db.commit()
        db.refresh(db_type)
    return db_type
