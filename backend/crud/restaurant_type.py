from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.restaurant_type import DBRestaurantType


def crud_get_restaurant_type_by_id(db: Session, type_id: int):
    return db.query(DBRestaurantType).filter(DBRestaurantType.id == type_id).first()


def crud_get_restaurant_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DBRestaurantType).offset(skip).limit(limit).all()


def crud_get_restaurant_type_by_name(db: Session, name: str):
    return db.query(DBRestaurantType).filter(DBRestaurantType.name == name).first()


def crud_create_restaurant_type(db: Session, type_name: str):
    db_type = crud_get_restaurant_type_by_name(db=db, name=type_name)
    if db_type:
        raise HTTPException(status_code=400, detail="Type already exists.")
    db_type = DBRestaurantType(name=type_name)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


def crud_rename_restaurant_type(db: Session, old_name: str, new_name: str):
    existing_type = crud_get_restaurant_type_by_name(db=db, name=new_name)
    if existing_type:
        raise HTTPException(status_code=400, detail="New type name already exists.")

    db_type = (
        db.query(DBRestaurantType).filter(DBRestaurantType.name == old_name).first()
    )
    if db_type:
        db_type.name = new_name
        db.commit()
        db.refresh(db_type)
    return db_type


def crud_delete_restaurant_type(db: Session, type_name: str):
    db_type = crud_get_restaurant_type_by_name(db, type_name)
    if not db_type:
        raise HTTPException(status_code=404, detail="Type not found.")
    if db_type:
        db.delete(db_type)
        db.commit()
    return db_type
