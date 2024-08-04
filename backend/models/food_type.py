# models/food_type.py
from sqlalchemy import Column, Integer, String
from database import Base


class DBFoodType(Base):
    __tablename__ = "food_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
