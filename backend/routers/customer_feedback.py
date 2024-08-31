from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db
from schemas.customer_feedback import CustomerFeedback, CustomerFeedbackCreate
from typing import List
from crud.customer_feedback import (
    crud_get_customer_feedback,
    crud_create_customer_feedback,
    crud_update_customer_feedback,
    crud_get_customer_feedbacks_by_owner_id,
)

router = APIRouter(prefix="/customer-feedback")


@router.post("/new/", response_model=CustomerFeedback)
def create_customer_feedback(
    feedback: CustomerFeedbackCreate, db: Session = Depends(get_db)
):
    db_feedback = crud_get_customer_feedback(db, feedback.order_id)
    if db_feedback:
        # if feedback exists, update it
        updated_feedback = crud_update_customer_feedback(
            db, feedback.order_id, feedback
        )
        if not updated_feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")
        return updated_feedback
    else:
        return crud_create_customer_feedback(db, feedback)


@router.get("/read/{order_id}", response_model=CustomerFeedback)
def read_customer_feedback(order_id: int, db: Session = Depends(get_db)):
    db_feedback = crud_get_customer_feedback(db, order_id)
    if not db_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return db_feedback


@router.put("/update/{order_id}", response_model=CustomerFeedback)
def update_customer_feedback(
    order_id: int, feedback: CustomerFeedbackCreate, db: Session = Depends(get_db)
):
    db_feedback = crud_update_customer_feedback(db, order_id, feedback)
    if not db_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return db_feedback


@router.get("/owner/{owner_id}", response_model=List[CustomerFeedback])
def read_customer_feedbacks_by_owner(owner_id: int, db: Session = Depends(get_db)):
    feedbacks = crud_get_customer_feedbacks_by_owner_id(db, owner_id)
    if not feedbacks:
        raise HTTPException(status_code=404, detail="No feedbacks found for this owner")
    return feedbacks
