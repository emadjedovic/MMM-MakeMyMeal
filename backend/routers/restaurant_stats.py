from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from schemas.restaurant_stats import RestaurantStats
from dependencies import get_db
from crud.restaurant_stats import (crud_get_restaurant_stats, crud_create_restaurant_stats, crud_reset_daily_stats, crud_reset_monthly_stats)

router = APIRouter(prefix="/restaurant-stats")

@router.post("/", response_model=RestaurantStats)
def create_restaurant_stats(restaurant_id: int, db: Session = Depends(get_db)):
    db_stats = crud_get_restaurant_stats(db, restaurant_id)
    if db_stats:
        raise HTTPException(status_code=400, detail="RestaurantStats already created")
    return crud_create_restaurant_stats(db=db, restaurant_id=restaurant_id)

@router.post("/reset-daily/")
def reset_daily_stats(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(crud_reset_daily_stats, db)
    return {"msg": "Daily stats reset scheduled"}

@router.post("/reset-monthly/")
def reset_monthly_stats(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(crud_reset_monthly_stats, db)
    return {"msg": "Monthly stats reset scheduled"}

@router.get("/{restaurant_id}", response_model=RestaurantStats)
def read_restaurant_stats(restaurant_id: int, db: Session = Depends(get_db)):
    db_stats = crud_get_restaurant_stats(db, restaurant_id)
    if db_stats is None:
        raise HTTPException(status_code=404, detail="RestaurantStats not found")
    return db_stats
