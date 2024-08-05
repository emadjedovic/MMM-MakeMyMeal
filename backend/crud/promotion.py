from sqlalchemy.orm import Session
from models.promotion import DBPromotion
from schemas.promotion import PromotionCreate, PromotionUpdate
from datetime import datetime

def crud_get_promotion_by_id(db: Session, promotion_id: int):
    return db.query(DBPromotion).filter(DBPromotion.id == promotion_id).first()

def crud_get_all_promotions(db: Session):
    return db.query(DBPromotion).all()

def crud_create_promotion(db: Session, promotion: PromotionCreate):
    db_promotion = DBPromotion(
        discount_percentage=promotion.discount_percentage,
        start_date=datetime.utcnow(),  # Automatically set to current time
        end_date=promotion.end_date,
        item_id=promotion.item_id
    )
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)
    return db_promotion

def crud_update_promotion(db: Session, promotion_id: int, promotion_update: PromotionUpdate):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if db_promotion:
        if promotion_update.discount_percentage is not None:
            db_promotion.discount_percentage = promotion_update.discount_percentage
        if promotion_update.end_date is not None:
            db_promotion.end_date = promotion_update.end_date
        db.commit()
        db.refresh(db_promotion)
    return db_promotion

def crud_delete_promotion(db: Session, promotion_id: int):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if db_promotion:
        db.delete(db_promotion)
        db.commit()
    return db_promotion
