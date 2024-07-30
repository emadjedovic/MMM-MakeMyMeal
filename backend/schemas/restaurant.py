from pydantic import BaseModel, Field, field_validator
from typing import Optional
from models.restaurant import RestaurantType


class RestaurantBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    street_name: str
    city: str
    star_rating: Optional[int] = Field(None, ge=0, le=5)
    type: Optional[RestaurantType] = RestaurantType.OTHER
    radius_of_delivery_km: float

    @field_validator("radius_of_delivery_km", mode="before")
    def validate_radius(cls, value):
        if value < 0:
            raise ValueError("Radius must be positive.")
        return value


class RestaurantCreate(RestaurantBase):
    owner_id: int


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    street_name: Optional[str] = None
    city: Optional[str] = None
    star_rating: Optional[int] = Field(None, ge=0, le=5)
    type: Optional[RestaurantType] = RestaurantType.OTHER
    radius_of_delivery_km: Optional[float] = None
    is_archived: Optional[bool] = None


class RestaurantInDBBase(RestaurantBase):
    id: int
    owner_id: int
    is_archived: bool

    class Config:
        from_attributes = True


class Restaurant(RestaurantInDBBase):
    pass


class RestaurantInDB(RestaurantInDBBase):
    pass
