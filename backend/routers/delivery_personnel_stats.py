from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db
from crud.delivery_personnel_stats import (
    crud_create_delivery_personnel_stats,
    crud_get_delivery_personnel_stats,
    crud_reset_daily_stats,
    crud_reset_monthly_stats,
)
from schemas.delivery_personnel_stats import DeliveryPersonnelStats

router = APIRouter(prefix="/delivery-personnel-stats")


@router.post("/", response_model=DeliveryPersonnelStats)
def create_delivery_personnel_stats(
    delivery_personnel_id: int, db: Session = Depends(get_db)
):
    db_stats = crud_get_delivery_personnel_stats(db, delivery_personnel_id)
    if db_stats:
        raise HTTPException(
            status_code=400, detail="DeliveryPersonnelStats already created"
        )
    return crud_create_delivery_personnel_stats(
        db=db, delivery_personnel_id=delivery_personnel_id
    )


@router.post("/reset-daily/")
def reset_daily_stats(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(crud_reset_daily_stats, db)
    return {"msg": "Daily stats reset scheduled"}


@router.post("/reset-monthly/")
def reset_monthly_stats(
    background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    background_tasks.add_task(crud_reset_monthly_stats, db)
    return {"msg": "Monthly stats reset scheduled"}


@router.get("/{delivery_personnel_id}", response_model=DeliveryPersonnelStats)
def read_delivery_personnel_stats(
    delivery_personnel_id: int, db: Session = Depends(get_db)
):
    db_stats = crud_get_delivery_personnel_stats(db, delivery_personnel_id)
    if db_stats is None:
        raise HTTPException(status_code=404, detail="DeliveryPersonnelStats not found")
    return db_stats
