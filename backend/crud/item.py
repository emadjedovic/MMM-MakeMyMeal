from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.item import DBItem
from schemas.item import ItemCreate, ItemUpdate
from helpers.math import round_up
from models.restaurant import DBRestaurant
from typing import List
from models.user import DBUser
from helpers.math import calculate_distance


def crud_get_all_items(db: Session):
    return db.query(DBItem).all()


def crud_get_recommended_items(db: Session):
    return db.query(DBItem).filter(DBItem.is_recommended == True).all()


def crud_get_item_by_id(db: Session, item_id: int):
    return db.query(DBItem).filter(DBItem.id == item_id).first()


def crud_get_promoted_items(db: Session):
    return db.query(DBItem).filter(DBItem.is_promoted == True).all()


def crud_get_items_by_restaurant(db: Session, restaurant_id: int):
    return db.query(DBItem).filter(DBItem.restaurant_id == restaurant_id).all()


def crud_get_items_by_food_type(db: Session, food_type_name: str, restaurant_id: int):
    return (
        db.query(DBItem)
        .filter(DBItem.food_type_name == food_type_name)
        .filter(DBItem.restaurant_id == restaurant_id)
        .all()
    )


def crud_get_items_by_name(db: Session, name: str, restaurant_id: int):
    return (
        db.query(DBItem)
        .filter(DBItem.name == name)
        .filter(DBItem.restaurant_id == restaurant_id)
        .all()
    )


def crud_create_item(db: Session, item: ItemCreate):
    db_item = DBItem(
        name=item.name,
        description=item.description or "No description",
        price=round_up(item.price, 2),
        imageUrl=item.imageUrl or "item-images/itemDefault.png",
        is_recommended=item.is_recommended,
        restaurant_id=item.restaurant_id,
        food_type_name=item.food_type_name,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def crud_update_item(db: Session, item_id: int, item_update: ItemUpdate):
    db_item = crud_get_item_by_id(db, item_id)
    if db_item:
        if item_update.name is not None:
            db_item.name = item_update.name
        if item_update.description is not None:
            db_item.description = item_update.description
        if item_update.price is not None:
            db_item.price = round_up(item_update.price, 2)
        if item_update.imageUrl is not None:
            db_item.imageUrl = item_update.imageUrl
        if item_update.is_recommended is not None:
            db_item.is_recommended = item_update.is_recommended
        if item_update.food_type_name is not None:
            db_item.food_type_name = item_update.food_type_name
        db.commit()
        db.refresh(db_item)
    return db_item


def crud_delete_item(db: Session, item_id: int):
    db_item = crud_get_item_by_id(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item


def crud_toggle_is_promoted(db: Session, id: int):
    db_item = db.query(DBItem).filter(DBItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.is_promoted = not db_item.is_promoted
    db.commit()
    db.refresh(db_item)
    return db_item


def crud_change_price(db: Session, id: int, old_discount: float, new_discount: float):
    db_item = db.query(DBItem).filter(DBItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    original_price = db_item.price / (
        1 - old_discount
    )  # old_discount = 0 for original price
    new_price = original_price * (1 - new_discount)

    db_item.price = round_up(new_price, 2)

    db.commit()
    db.refresh(db_item)
    return db_item


def crud_toggle_recommend_item(db: Session, id: int) -> DBItem:
    db_item = crud_get_item_by_id(db, id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.is_recommended = not db_item.is_recommended
    db.commit()
    db.refresh(db_item)
    return db_item


def crud_get_recommended_items_within_radius(db: Session, user: DBUser) -> List[DBItem]:
    user_latitude = user.latitude
    user_longitude = user.longitude

    all_restaurants = (
        db.query(DBRestaurant).filter(DBRestaurant.is_archived == False).all()
    )

    nearby_restaurants_ids = []

    for restaurant in all_restaurants:
        distance = calculate_distance(
            restaurant.latitude, restaurant.longitude, user_latitude, user_longitude
        )
        if distance <= restaurant.radius_of_delivery_km:
            nearby_restaurants_ids.append(restaurant.id)

    recommended_items = (
        db.query(DBItem)
        .filter(
            DBItem.is_recommended == True,
            DBItem.restaurant_id.in_(nearby_restaurants_ids),
        )
        .all()
    )

    return recommended_items
