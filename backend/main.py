# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users
from database import engine, Base
#from create_users import create_admin, create_customer, create_delivery_personnel, create_restaurant_admin
# from routers import menu_items, menus, orders, other, restaurants, users

# we need to configure CORS to allow our React app to send POST request
def create_application():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins = ["*"],
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"])
    return app

app = create_application()

def startup_event():
    Base.metadata.create_all(bind=engine)  # create tables
    #create_admin()
    #create_customer()
    #create_restaurant_admin()
    #create_delivery_personnel()

app.add_event_handler("startup", startup_event)

@app.get("/")
def read_root():
    return {"hello": "world"}

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(users.router, prefix="/api", tags=["users"])
#app.include_router(other.router, prefix="/api", tags=["other"])
"""
app.include_router(menu_items.router, prefix="/api", tags=["menu items"])
app.include_router(menus.router, prefix="/api", tags=["menus"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(restaurants.router, prefix="/api", tags=["restaurants"])
"""


