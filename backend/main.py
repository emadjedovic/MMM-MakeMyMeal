# main.py

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, restaurants
from database import engine, Base
# from routers import menu_items, menus, orders

# from create_users import create_admin, create_customer, create_delivery_personnel, create_restaurant_admin


def create_application():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


app = create_application()


def startup_event():
    Base.metadata.create_all(bind=engine)  # create tables
    # create_admin()
    # create_customer()
    # create_restaurant_admin()
    # create_delivery_personnel()


app.add_event_handler("startup", startup_event)


@app.get("/", tags=["Default"])
def read_root():
    return RedirectResponse(url="/docs")


app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(restaurants.router, prefix="/api", tags=["Restaurants"])
"""
app.include_router(menu_items.router, prefix="/api", tags=["menu items"])
app.include_router(menus.router, prefix="/api", tags=["menus"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
"""
