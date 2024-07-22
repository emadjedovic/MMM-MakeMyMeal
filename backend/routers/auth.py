from fastapi import APIRouter, Depends, HTTPException, status
from dependencies import get_db
from datetime import timedelta
from auth.security import authenticate_user, create_access_token
from schemas.token import Token
from sqlalchemy.orm import Session
from schemas.user import User, UserCreate, UserLogin
from models.user import DBUser
from crud.user import crud_create_customer
from auth.config import ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=User)
async def register_customer(user: UserCreate, db: Session = Depends(get_db)):

    # Check if the email already exists
    existing_customer = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    created_customer = crud_create_customer(db=db, user=user)

    return created_customer