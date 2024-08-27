from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db
from schemas.order_assignments import OrderAssignmentsCreate, OrderAssignments
from crud.order_assignments import (crud_create_order_assignment, crud_get_order_assignment, crud_update_delivery_end_time, crud_update_delivery_start_time)

router = APIRouter(
    prefix="/order-assignments"
)

@router.post("/", response_model=OrderAssignments)
def create_order_assignment(order_assignment: OrderAssignmentsCreate, db: Session = Depends(get_db)):
    db_order_assignment = crud_get_order_assignment(db, order_assignment.order_id, order_assignment.delivery_personnel_id)
    if db_order_assignment:
        raise HTTPException(status_code=400, detail="Order assignment already exists")
    return crud_create_order_assignment(db, order_assignment)

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
