# crud/user.py

from sqlalchemy.orm import Session
from models.user import DBUser, UserRole
from schemas.user import UserCreate
from auth.security import pwd_context

def crud_get_user_by_email(db: Session, email: str) -> DBUser:
    return db.query(DBUser).filter(DBUser.email == email).first()

def crud_get_users_by_role(db: Session, role: UserRole, skip: int = 0, limit: int = 10):
    return db.query(DBUser).filter(DBUser.role == role).offset(skip).limit(limit).all()

def crud_create_customer(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = DBUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        latitude=user.latitude,
        longitude=user.longitude
    )
    db_user.role = UserRole.CUSTOMER
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

"""
def crud_create_restaurant_admin(db: Session, user: UserCreate) -> DBUser:
    hashed_password = pwd_context.hash(user.password)
    db_user = DBUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        role=UserRole.RESTAURANT_ADMIN
    )
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
        role=UserRole.DELIVERY_PERSONNEL
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
"""
