from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db, get_restaurant_admin_user
from schemas.promotion import Promotion, PromotionCreate, PromotionUpdate
from crud.promotion import (
    crud_create_promotion,
    crud_delete_promotion,
    crud_get_all_promotions,
    crud_get_promotion_by_id,
    crud_update_promotion,
)

router = APIRouter(prefix="/promotions")


# all users
@router.get("/", response_model=List[Promotion])
def read_promotions(db: Session = Depends(get_db)):
    promotions = crud_get_all_promotions(db)
    return promotions


# restaurant admin
@router.post("/create", response_model=Promotion)
def create_promotion(
    promotion: PromotionCreate,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    return crud_create_promotion(db, promotion)


# restaurant admin
@router.put("/update/{promotion_id}", response_model=Promotion)
def update_promotion(
    promotion_id: int,
    promotion_update: PromotionUpdate,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return crud_update_promotion(db, promotion_id, promotion_update)


# restaurant admin
@router.delete("/delete/{promotion_id}")
def delete_promotion(
    promotion_id: int,
    db: Session = Depends(get_db),
    # restaurant_admin: User = Depends(get_restaurant_admin_user),
):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return crud_delete_promotion(db, promotion_id)
