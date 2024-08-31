from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_db
from datetime import timedelta
from security import authenticate_user, create_access_token
from schemas.token import Token
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin
from crud.user import crud_create_customer, crud_get_user_by_email
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from helpers.sending_email import send_email
from pydantic import BaseModel
from models.user import DBUser
from security import decode_jwt, get_password_hash, create_reset_token

router = APIRouter(prefix="/auth")


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(email=user.email, password=user.password, db=db)
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = crud_create_customer(db=db, user=user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
    token: str


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest, db: Session = Depends(get_db)
):
    user = db.query(DBUser).filter(DBUser.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_reset_token(user.email)
    reset_link = (
        f"http://localhost:3000/reset-password?token={token}&email={user.email}"
    )
    send_email(
        "Password Reset Request",
        f"Click here to reset your password: {reset_link}",
        request.email,
    )

    return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decoded_token = decode_jwt(request.token)
    print("decoded_token.get('sub') is ", decoded_token.get("sub"))
    print("request.email is ", request.email)
    if decoded_token.get("sub") != request.email:
        raise HTTPException(status_code=400, detail="Invalid token")

    user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Password has been updated"}
