from sqlalchemy.orm import Session
from datetime import timedelta,timezone, datetime
from schemas.order_assignments import OrderAssignmentsCreate
from models.order_assignments import DBOrderAssignments

local_tz = timezone(timedelta(hours=2))

def crud_create_order_assignment(db: Session, order_assignment: OrderAssignmentsCreate):
    db_order_assignment = DBOrderAssignments(
        order_id=order_assignment.order_id,
        delivery_personnel_id=order_assignment.delivery_personnel_id,
        assigned_at=datetime.now(tz=timezone.utc)  # Current UTC time for `assigned_at`
    )
    db.add(db_order_assignment)
    db.commit()
    db.refresh(db_order_assignment)
    return db_order_assignment

def crud_get_order_assignment(db: Session, order_id: int, delivery_personnel_id: int):
    return db.query(DBOrderAssignments).filter(
        DBOrderAssignments.order_id == order_id,
        DBOrderAssignments.delivery_personnel_id == delivery_personnel_id
    ).first()

def crud_update_delivery_start_time(db: Session, order_id: int, delivery_personnel_id: int):
    db_order_assignment = db.query(DBOrderAssignments).filter(
        DBOrderAssignments.order_id == order_id,
        DBOrderAssignments.delivery_personnel_id == delivery_personnel_id
    ).first()
    
    if db_order_assignment:
        db_order_assignment.delivery_start_time = datetime.now(local_tz)  # Set current time
        db.commit()
        db.refresh(db_order_assignment)
        return db_order_assignment
    return None

def crud_update_delivery_end_time(db: Session, order_id: int, delivery_personnel_id: int):
    db_order_assignment = db.query(DBOrderAssignments).filter(
        DBOrderAssignments.order_id == order_id,
        DBOrderAssignments.delivery_personnel_id == delivery_personnel_id
    ).first()
    
    if db_order_assignment:
        db_order_assignment.delivery_end_time = datetime.now(local_tz)  # Set current time
        db.commit()
        db.refresh(db_order_assignment)
        return db_order_assignment
    return None