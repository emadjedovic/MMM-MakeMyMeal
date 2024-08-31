from sqlalchemy import Column, Integer, String
from database import Base


class DBRestaurantType(Base):
    __tablename__ = "restaurant_types"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)
