from pydantic import BaseModel


class RestaurantTypeBase(BaseModel):
    name: str


class RestaurantTypeCreate(RestaurantTypeBase):
    pass


class RestaurantTypeResponse(RestaurantTypeBase):
    id: int

    class Config:
        from_attributes = True
