# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users
from database import engine, Base, SessionLocal
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

def create_admin():
    from models.user import DBUser, UserRole

    from auth.security import get_password_hash
    from schemas.user import UserCreate
    db = SessionLocal()
    try:
        admin_user = UserCreate(
            email="admin@example.com",
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
            password="adminpassword"
        )
        hashed_password = get_password_hash(admin_user.password)
        db_user = DBUser(
            email=admin_user.email,
            first_name=admin_user.first_name,
            last_name=admin_user.last_name,
            hashed_password=hashed_password,
            role=admin_user.role
        )
        db.add(db_user)
        db.commit()
        print("Admin user created successfully")
        print(f"Enum value: {db_user.role}")
    except Exception as e:
        print(f"An error occurred: {e}")
        print(f"Enum value: {db_user.role}")
    finally:
        db.close()

def startup_event():
    Base.metadata.create_all(bind=engine)  # create tables
    # create_admin()

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


