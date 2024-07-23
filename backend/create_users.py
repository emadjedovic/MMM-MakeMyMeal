from database import SessionLocal
from models.user import DBUser, UserRole
from auth.security import get_password_hash
from schemas.user import UserCreate

def create_customer():
    db = SessionLocal()
    try:
        customer_user = UserCreate(
            email="customer@example.com",
            first_name="Customer",
            last_name="User",
            role=UserRole.CUSTOMER,
            password="customerpass"
        )
        hashed_password = get_password_hash(customer_user.password)
        db_user = DBUser(
            email=customer_user.email,
            first_name=customer_user.first_name,
            last_name=customer_user.last_name,
            hashed_password=hashed_password,
            role=customer_user.role
        )
        db.add(db_user)
        db.commit()
        print("Customer user created successfully")
        print(f"Enum value: {db_user.role}")
    except Exception as e:
        print(f"An error occurred: {e}")
        print(f"Enum value: {db_user.role}")
    finally:
        db.close()

def create_admin():
    db = SessionLocal()
    try:
        admin_user = UserCreate(
            email="admin@example.com",
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
            password="adminpass"
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

def create_restaurant_admin():
    db = SessionLocal()
    try:
        restaurant_admin_user = UserCreate(
            email="restaurantadmin@example.com",
            first_name="Restaurant Admin",
            last_name="User",
            role=UserRole.RESTAURANT_ADMIN,
            password="restaurantadminpass"
        )
        hashed_password = get_password_hash(restaurant_admin_user.password)
        db_user = DBUser(
            email=restaurant_admin_user.email,
            first_name=restaurant_admin_user.first_name,
            last_name=restaurant_admin_user.last_name,
            hashed_password=hashed_password,
            role=restaurant_admin_user.role
        )
        db.add(db_user)
        db.commit()
        print("Restaurant admin user created successfully")
        print(f"Enum value: {db_user.role}")
    except Exception as e:
        print(f"An error occurred: {e}")
        print(f"Enum value: {db_user.role}")
    finally:
        db.close()

def create_delivery_personnel():
    db = SessionLocal()
    try:
        delivery_personnel_user = UserCreate(
            email="deliverypersonnel@example.com",
            first_name="Delivery Personnel",
            last_name="User",
            role=UserRole.DELIVERY_PERSONNEL,
            password="deliverypersonnelpass"
        )
        hashed_password = get_password_hash(delivery_personnel_user.password)
        db_user = DBUser(
            email=delivery_personnel_user.email,
            first_name=delivery_personnel_user.first_name,
            last_name=delivery_personnel_user.last_name,
            hashed_password=hashed_password,
            role=delivery_personnel_user.role
        )
        db.add(db_user)
        db.commit()
        print("Delivery personnel user created successfully")
        print(f"Enum value: {db_user.role}")
    except Exception as e:
        print(f"An error occurred: {e}")
        print(f"Enum value: {db_user.role}")
    finally:
        db.close()