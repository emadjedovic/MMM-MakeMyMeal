from pydantic import BaseModel
from typing import Optional
from schemas.promotion import Promotion

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = "No description"
    price: float
    imageUrl: Optional[str] = "item-images/itemDefault.png"
    is_promoted: bool
    is_recommended: bool

class ItemCreate(ItemBase):
    restaurant_id: int
    food_type_name: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    imageUrl: Optional[str] = None
    is_promoted: Optional[bool] = None
    is_recommended: Optional[bool] = None
    food_type_name: Optional[str] = None

class Item(ItemBase):
    id: int
    promotion: Optional[Promotion] = None

    class Config:
        from_attributes = True
