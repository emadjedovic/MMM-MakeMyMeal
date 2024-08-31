from pydantic import BaseModel


class FoodTypeBase(BaseModel):
    name: str


class FoodTypeCreate(FoodTypeBase):
    pass


class FoodTypeResponse(FoodTypeBase):
    id: int

    class Config:
        from_attributes = True
