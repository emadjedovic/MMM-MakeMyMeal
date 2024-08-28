from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db
from schemas.order_assignments import OrderAssignmentsCreate, OrderAssignments
from models.order import DBOrder
from crud.order_assignments import (crud_assign_order_to_delivery_personnel, crud_get_order_assignment, crud_update_delivery_end_time, crud_update_delivery_start_time)

router = APIRouter(
    prefix="/order-assignments"
)

@router.post("/assign/{order_id}", response_model=OrderAssignments)
def create_order_assignment(order_id: int, db: Session = Depends(get_db)):
    # Fetch the order details
    db_order = db.query(DBOrder).filter(DBOrder.id == order_id).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Ensure that an assignment does not already exist for this order
    db_order_assignment = crud_get_order_assignment(db, order_id, None)
    if db_order_assignment:
        raise HTTPException(status_code=400, detail="Order assignment already exists")

    # Check if order has latitude and longitude
    if db_order.latitude is None or db_order.longitude is None:
        raise HTTPException(status_code=400, detail="Order location is not specified")

    # Automatically assign the best delivery personnel
    try:
        assigned_order = crud_assign_order_to_delivery_personnel(
            db=db, 
            order_id=order_id, 
            order_latitude=db_order.latitude, 
            order_longitude=db_order.longitude
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return assigned_order

@router.get("/{order_id}/{delivery_personnel_id}", response_model=OrderAssignments)
def read_order_assignment(order_id: int, delivery_personnel_id: int, db: Session = Depends(get_db)):
    db_order_assignment = crud_get_order_assignment(db, order_id, delivery_personnel_id)
    if not db_order_assignment:
        raise HTTPException(status_code=404, detail="Order assignment not found")
    return db_order_assignment

@router.put("/{order_id}/{delivery_personnel_id}/start-time", response_model=OrderAssignments)
def update_delivery_start_time(order_id: int, delivery_personnel_id: int, db: Session = Depends(get_db)):
    db_order_assignment = crud_update_delivery_start_time(db, order_id, delivery_personnel_id)
    if not db_order_assignment:
        raise HTTPException(status_code=404, detail="Order assignment not found")
    return db_order_assignment

@router.put("/{order_id}/{delivery_personnel_id}/end-time", response_model=OrderAssignments)
def update_delivery_end_time(order_id: int, delivery_personnel_id: int, db: Session = Depends(get_db)):
    db_order_assignment = crud_update_delivery_end_time(db, order_id, delivery_personnel_id)
    if not db_order_assignment:
        raise HTTPException(status_code=404, detail="Order assignment not found")
    return db_order_assignment
