from fastapi import Depends, HTTPException, status, Request
from database import SessionLocal
from sqlalchemy.orm import Session
from security import decode_jwt, extract_token
from schemas.user import User
from models.user import UserRole
from crud.user import crud_get_user_by_email


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(request: Request, db: Session = Depends(get_db)):
    import logging

    logger = logging.getLogger(__name__)

    logger.info("Request received")

    token = extract_token(request)
    logger.info(f"Token received: {token}")

    if not token:
        logger.error("No token found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Dependencies.py: get_current_user issue.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_jwt(token)
        email = payload.get("sub")
        if email is None:
            logger.error("No email found in token payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        logger.error(f"Error decoding token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = crud_get_user_by_email(db=db, email=email)
    if user is None:
        logger.error(f"User with email {email} not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.disabled:
        logger.error(f"User with email {email} is inactive")
        raise HTTPException(status_code=400, detail="Inactive user")

    logger.info(f"User with email {email} successfully validated")
    return user


def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        error_message = (
            f"Access denied. User with role '{current_user.role}' is not authorized to access this resource. "
            f"Required role: '{UserRole.ADMIN}'."
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_message)
    return current_user


def get_customer_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not Customer."
        )
    return current_user


def get_restaurant_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.RESTAURANT_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not Restaurant Admin."
        )
    return current_user


def get_delivery_personnel_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DELIVERY_PERSONNEL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not Delivery Personnel."
        )
    return current_user


def get_admin_or_restaurant_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.RESTAURANT_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Neither admin nor restaurant admin.",
        )
    return current_user


def get_admin_or_customer(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.CUSTOMER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Neither admin nor customer"
        )
    return current_user
