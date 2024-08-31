from pydantic import BaseModel, Field
from typing import Optional, List
from schemas.item import Item
from schemas.order import Order


class RestaurantBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    street_name: str
    city: str
    star_rating: int
    type_name: str
    radius_of_delivery_km: float
    is_recommended: bool
    imageUrl: str


class RestaurantCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    street_name: str
    city: str
    star_rating: Optional[int] = Field(0, ge=0, le=5)
    type_name: Optional[str] = "Other"
    radius_of_delivery_km: Optional[float] = Field(0, ge=0)
    is_recommended: Optional[bool] = False
    owner_id: int
    imageUrl: Optional[str] = "restaurant-images/restDefault.png"


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    street_name: Optional[str] = None
    city: Optional[str] = None
    star_rating: Optional[int] = Field(None, ge=0, le=5)
    type_name: Optional[str] = None
    radius_of_delivery_km: Optional[float] = Field(None, ge=0)
    is_archived: Optional[bool] = None
    imageUrl: Optional[str] = None
    is_recommended: Optional[bool] = None


class Restaurant(RestaurantBase):
    id: int
    owner_id: int
    is_archived: bool
    items: List[Item] = []
    orders: List[Order] = []

    class Config:
        from_attributes = True
