from pydantic import BaseModel, Field, field_validator
from typing import Optional
from models.restaurant import RestaurantType


class RestaurantBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    street_name: str
    city: str
    star_rating: Optional[float] = Field(None, ge=0, le=5)
    type: RestaurantType
    radius_of_delivery_km: float
    is_archived: bool = False

    @field_validator("radius_of_delivery_km", mode="before")
    def validate_radius(cls, value):
        if value <= 0:
            raise ValueError("Radius must be positive.")
        return value


class RestaurantCreate(RestaurantBase):
    owner_id: int


class RestaurantUpdate(RestaurantBase):
    name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    street_name: Optional[str]
    city: Optional[str]
    radius_of_delivery_km: Optional[float]
    type: Optional[RestaurantType]
    star_rating: Optional[float] = Field(None, ge=0, le=5)
    is_archived: Optional[bool]


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
