# crud/user.py

from sqlalchemy.orm import Session
from models.user import DBUser, UserRole
from schemas.user import UserCreate
from auth.security import pwd_context
from fastapi import HTTPException, status


def crud_get_user_by_id(db: Session, id: int) -> DBUser:
    return db.query(DBUser).filter(DBUser.id == id).first()


def crud_get_user_by_email(db: Session, email: str) -> DBUser:
    return db.query(DBUser).filter(DBUser.email == email).first()


def crud_delete_user(db: Session, id: int):
    user = db.query(DBUser).filter(DBUser.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {"detail": "User deleted successfully"}


def crud_get_users_by_role(db: Session, role: UserRole, skip: int = 0, limit: int = 10):
    return db.query(DBUser).filter(DBUser.role == role).offset(skip).limit(limit).all()


def crud_create_customer(db: Session, user: UserCreate) -> DBUser:
    hashed_password = pwd_context.hash(user.password)
    db_user = DBUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        latitude=user.latitude,
        longitude=user.longitude,
    )
    db_user.role = UserRole.CUSTOMER
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def crud_create_restaurant_admin(db: Session, user: UserCreate) -> DBUser:
    hashed_password = pwd_context.hash(user.password)
    db_user = DBUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
    )
    db_user.role = UserRole.RESTAURANT_ADMIN
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def crud_create_delivery_personnel(db: Session, user: UserCreate) -> DBUser:
    hashed_password = pwd_context.hash(user.password)
    db_user = DBUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        restaurant_id=user.restaurant_id,
    )
    db_user.role = UserRole.DELIVERY_PERSONNEL
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
