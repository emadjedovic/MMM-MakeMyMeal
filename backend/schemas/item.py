from pydantic import BaseModel
from typing import Optional


class ItemBase(BaseModel):
    name: str
    description: Optional[str] = "No description"
    price: float
    imageUrl: Optional[str] = "item-images/itemDefault.png"
    is_recommended: bool = False
    food_type_name: str = "Other"


class ItemCreate(ItemBase):
    restaurant_id: int


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    imageUrl: Optional[str] = None
    is_recommended: Optional[bool] = None
    food_type_name: Optional[str] = None


class Item(ItemBase):
    id: int
    is_promoted: bool = False
    restaurant_id: int

    class Config:
        from_attributes = True
