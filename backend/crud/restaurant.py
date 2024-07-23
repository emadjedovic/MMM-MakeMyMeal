from sqlalchemy.orm import Session
from sqlalchemy import asc
from models.restaurant import DBRestaurant, RestaurantType
from schemas.restaurant import RestaurantCreate, RestaurantUpdate
from models.user import DBUser
from typing import List
from fastapi import HTTPException


def crud_create_restaurant(
    db: Session, restaurant: RestaurantCreate, owner_id: int
) -> DBRestaurant:
    db_owner = db.query(DBUser).filter(DBUser.id == owner_id).first()
    if not db_owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    db_restaurant = DBRestaurant(
        name=restaurant.name,
        latitude=restaurant.latitude,
        longitude=restaurant.longitude,
        street_name=restaurant.street_name,
        city=restaurant.city,
        star_rating=restaurant.star_rating,
        type=restaurant.type,
        radius_of_delivery_km=restaurant.radius_of_delivery_km,
        owner_id=owner_id,
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def crud_update_restaurant(
    db: Session, id: int, restaurant: RestaurantUpdate
) -> DBRestaurant:
    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if db_restaurant:
        if restaurant.name is not None:
            db_restaurant.name = restaurant.name
        if restaurant.latitude is not None:
            db_restaurant.latitude = restaurant.latitude
        if restaurant.longitude is not None:
            db_restaurant.longitude = restaurant.longitude
        if restaurant.street_name is not None:
            db_restaurant.street_name = restaurant.street_name
        if restaurant.city is not None:
            db_restaurant.city = restaurant.city
        if restaurant.star_rating is not None:
            db_restaurant.star_rating = restaurant.star_rating
        if restaurant.type is not None:
            db_restaurant.type = restaurant.type
        if restaurant.radius_of_delivery_km is not None:
            db_restaurant.radius_of_delivery_km = restaurant.radius_of_delivery_km
        db.commit()
        db.refresh(db_restaurant)
    return db_restaurant


def crud_archive_restaurant(db: Session, id: int) -> DBRestaurant:
    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == id).first()
    if db_restaurant:
        db_restaurant.is_archived = True
        db.commit()
        db.refresh(db_restaurant)
    return db_restaurant


def crud_get_restaurant_types() -> List[str]:
    return [key.value for key in RestaurantType]


def crud_get_restaurants_by_type(
    db: Session, type: RestaurantType
) -> List[DBRestaurant]:
    restaurants_of_type = db.query(DBRestaurant).filter(DBRestaurant.type == type).all()
    return restaurants_of_type


def crud_get_all_restaurants(
    db: Session, skip: int = 0, limit: int = 10
) -> List[DBRestaurant]:
    return (
        db.query(DBRestaurant)
        .order_by(asc(DBRestaurant.name))
        .offset(skip)
        .limit(limit)
        .all()
    )


def crud_get_restaurants_within_radius(db: Session, user: DBUser) -> List[DBRestaurant]:
    nearby_restaurants = (
        db.query(DBRestaurant)
        .filter(
            (DBRestaurant.latitude - user.latitude) ** 2
            + (DBRestaurant.longitude - user.longitude) ** 2
            <= (DBRestaurant.radius_of_delivery_km**2)
        )
        .all()
    )
    return nearby_restaurants
