# dependencies.py
# to handle database sessions and user authentication

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import SessionLocal
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from auth.config import SECRET_KEY, ALGORITHM
from schemas.user import User
from models.user import UserRole
from crud.user import crud_get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("Token received:", token)  # Debugging print statement
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"})

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded payload:", payload)  # Add this line
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError as e:
        print("JWT Error:", e)  # Add this line
        raise credentials_exception
    
    user = crud_get_user_by_email(db=db, email=email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Admin.")
    return current_user

def get_customer_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Customer.")
    return current_user

def get_restaurant_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.RESTAURANT_ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Restaurant Admin.")
    return current_user

def get_admin_or_restaurant_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.RESTAURANT_ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return current_user

def get_delivery_personnel_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DELIVERY_PERSONNEL:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Delivery Personnel.")
    return current_user