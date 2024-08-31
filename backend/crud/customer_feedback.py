from sqlalchemy.orm import Session
from models.customer_feedback import DBCustomerFeedback
from schemas.customer_feedback import CustomerFeedbackCreate
from models.order import DBOrder
from models.restaurant import DBRestaurant


def crud_create_customer_feedback(db: Session, feedback: CustomerFeedbackCreate):
    db_feedback = DBCustomerFeedback(
        order_id=feedback.order_id,
        restaurant_rating=feedback.restaurant_rating,
        delivery_rating=feedback.delivery_rating,
        feedback=feedback.feedback,
        timestamp=feedback.timestamp,
        would_recommend=feedback.would_recommend,
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def crud_get_customer_feedback(db: Session, order_id: int):
    return (
        db.query(DBCustomerFeedback)
        .filter(DBCustomerFeedback.order_id == order_id)
        .first()
    )


def crud_update_customer_feedback(
    db: Session, order_id: int, feedback: CustomerFeedbackCreate
):
    db_feedback = (
        db.query(DBCustomerFeedback)
        .filter(DBCustomerFeedback.order_id == order_id)
        .first()
    )
    if db_feedback:
        db_feedback.restaurant_rating = feedback.restaurant_rating
        db_feedback.delivery_rating = feedback.delivery_rating
        db_feedback.feedback = feedback.feedback
        db_feedback.timestamp = feedback.timestamp
        db_feedback.would_recommend = feedback.would_recommend
        db.commit()
        db.refresh(db_feedback)
    return db_feedback


def crud_get_customer_feedbacks_by_owner_id(db: Session, owner_id: int):
    return (
        db.query(DBCustomerFeedback)
        .join(DBOrder, DBCustomerFeedback.order_id == DBOrder.id)
        .join(DBRestaurant, DBOrder.restaurant_id == DBRestaurant.id)
        .filter(DBRestaurant.owner_id == owner_id)
        .all()
    )
