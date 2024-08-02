from sqlalchemy.orm import Session
from models.restaurant import DBRestaurant
from schemas.restaurant import RestaurantCreate, RestaurantUpdate
from models.user import DBUser
from typing import List
from fastapi import HTTPException
from models.user import UserRole
from distance import calculate_distance


def crud_get_restaurant_by_id(db: Session, id: int) -> DBRestaurant:
    return db.query(DBRestaurant).filter(DBRestaurant.id == id).first()


def crud_create_restaurant(db: Session, restaurant: RestaurantCreate) -> DBRestaurant:
    db_owner = db.query(DBUser).filter(DBUser.id == restaurant.owner_id).first()
    if not db_owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    if db_owner.role != UserRole.RESTAURANT_ADMIN:
        raise HTTPException(status_code=404, detail="User is not a restaurant owner!")
    db_restaurant = DBRestaurant(
        name=restaurant.name,
        latitude=restaurant.latitude,
        longitude=restaurant.longitude,
        street_name=restaurant.street_name,
        city=restaurant.city,
        star_rating=restaurant.star_rating,
        type_name=restaurant.type_name,
        radius_of_delivery_km=restaurant.radius_of_delivery_km,
        owner_id=restaurant.owner_id,
        imageUrl=restaurant.imageUrl
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
    if restaurant.type_name is not None:
        db_restaurant.type_name = restaurant.type_name
    if restaurant.radius_of_delivery_km is not None:
        db_restaurant.radius_of_delivery_km = restaurant.radius_of_delivery_km
    if restaurant.is_archived is not None:
        db_restaurant.is_archived = restaurant.is_archived
    if restaurant.imageUrl is not None:
        db_restaurant.imageUrl = restaurant.imageUrl

    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def crud_delete_restaurant(db: Session, id: int) -> DBRestaurant:
    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    db.delete(db_restaurant)
    db.commit()

    return db_restaurant


def crud_toggle_archive_restaurant(db: Session, id: int) -> DBRestaurant:
    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    db_restaurant.is_archived = not db_restaurant.is_archived
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def crud_get_restaurants_by_type(db: Session, type: str) -> List[DBRestaurant]:
    restaurants_of_type = (
        db.query(DBRestaurant).filter(DBRestaurant.type_name == type).all()
    )
    return restaurants_of_type


def crud_get_all_restaurants(db: Session) -> List[DBRestaurant]:
    return db.query(DBRestaurant).all()


def crud_get_restaurants_within_radius(db: Session, user: DBUser) -> List[DBRestaurant]:
    user_latitude = user.latitude
    user_longitude = user.longitude

    all_restaurants = db.query(DBRestaurant).all()

    nearby_restaurants = []

    for restaurant in all_restaurants:
        distance = calculate_distance(
            restaurant.latitude, restaurant.longitude, user_latitude, user_longitude
        )
        if distance <= restaurant.radius_of_delivery_km:
            nearby_restaurants.append(restaurant)

    return nearby_restaurants


def crud_get_restaurants_by_type_within_radius(
    db: Session, user: DBUser, type: str
) -> List[DBRestaurant]:
    user_lat = user.latitude
    user_long = user.longitude

    all_restaurants_of_type = (
        db.query(DBRestaurant).filter(DBRestaurant.type_name == type).all()
    )

    nearby_restaurants_of_type = []

    for restaurant in all_restaurants_of_type:
        distance = calculate_distance(
            restaurant.latitude, restaurant.longitude, user_lat, user_long
        )
        if distance <= restaurant.radius_of_delivery_km:
            nearby_restaurants_of_type.append(restaurant)

    return nearby_restaurants_of_type


def crud_get_restaurants_by_owner(db: Session, owner_id: int) -> List[DBRestaurant]:
    return db.query(DBRestaurant).filter(DBRestaurant.owner_id == owner_id).all()
