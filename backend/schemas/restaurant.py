from pydantic import BaseModel, Field, field_validator
from typing import Optional


class RestaurantBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    street_name: str
    city: str
    star_rating: Optional[int] = Field(None, ge=0, le=5)
    type_name: Optional[str] = None
    radius_of_delivery_km: float
    is_recommended: bool

    @field_validator("radius_of_delivery_km", mode="before")
    def validate_radius(cls, value):
        if value < 0:
            raise ValueError("Radius must be positive.")
        return value


class RestaurantCreate(RestaurantBase):
    owner_id: int
    imageUrl: Optional[str] = None


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    street_name: Optional[str] = None
    city: Optional[str] = None
    star_rating: Optional[int] = Field(None, ge=0, le=5)
    type_name: Optional[str] = None
    radius_of_delivery_km: Optional[float] = None
    is_archived: Optional[bool] = None
    imageUrl: Optional[str] = None
    is_recommended: Optional[bool] = None

class Restaurant(RestaurantBase):
    id: int
    owner_id: int
    is_archived: bool
    imageUrl: Optional[str] = None

    class Config:
        from_attributes = True
