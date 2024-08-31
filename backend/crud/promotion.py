from sqlalchemy.orm import Session
from models.promotion import DBPromotion
from schemas.promotion import PromotionCreate, PromotionUpdate
from datetime import date
from crud.item import crud_toggle_is_promoted, crud_change_price, crud_get_item_by_id
from fastapi import HTTPException


def crud_get_promotion_by_id(db: Session, promotion_id: int):
    return db.query(DBPromotion).filter(DBPromotion.id == promotion_id).first()


def crud_get_all_promotions(db: Session):
    return db.query(DBPromotion).all()


def crud_create_promotion(db: Session, promotion: PromotionCreate):
    existing_promotion = (
        db.query(DBPromotion).filter(DBPromotion.item_id == promotion.item_id).first()
    )

    if existing_promotion:
        # If a promotion already exists, update it instead
        return crud_update_promotion(
            db=db,
            promotion_id=existing_promotion.id,
            promotion_update=PromotionUpdate(
                discount_fraction=promotion.discount_fraction,
                end_date=promotion.end_date,
            ),
        )

    db_promotion = DBPromotion(
        discount_fraction=promotion.discount_fraction,
        start_date=date.today(),
        end_date=promotion.end_date,
        item_id=promotion.item_id,
    )
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)

    crud_toggle_is_promoted(db, promotion.item_id)
    crud_change_price(
        db=db,
        id=promotion.item_id,
        old_discount=0,
        new_discount=promotion.discount_fraction,
    )

    return db_promotion


def crud_update_promotion(
    db: Session, promotion_id: int, promotion_update: PromotionUpdate
):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    old_discount = db_promotion.discount_fraction
    old_end_date = db_promotion.end_date

    db_item = crud_get_item_by_id(db, db_promotion.item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    new_discount = promotion_update.discount_fraction
    new_end_date = promotion_update.end_date

    if new_discount is not None:
        if new_discount == 0:
            crud_delete_promotion(db, promotion_id)
            return db_promotion

        crud_change_price(
            db=db, id=db_item.id, old_discount=old_discount, new_discount=new_discount
        )
        db_promotion.discount_fraction = new_discount

    if new_end_date is not None:
        db_promotion.end_date = new_end_date

    db.commit()
    db.refresh(db_promotion)
    db.refresh(db_item)

    return db_promotion


def crud_delete_promotion(db: Session, promotion_id: int):
    db_promotion = crud_get_promotion_by_id(db, promotion_id)
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")

    db_item = crud_get_item_by_id(db, db_promotion.item_id)
    if db_item:
        crud_toggle_is_promoted(db, db_promotion.item_id)
        crud_change_price(
            db=db,
            id=db_item.id,
            old_discount=db_promotion.discount_fraction,
            new_discount=0,
        )

    db.delete(db_promotion)
    db.commit()

    return {"Promotion deleted successfully."}
