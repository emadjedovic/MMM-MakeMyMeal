from database import SessionLocal
from models.user import DBUser, UserRole
from auth.security import get_password_hash
from schemas.user import UserCreate


def create_customer():
    db = SessionLocal()
    try:
        customer_user = UserCreate(
            email="toocoolstretch@gmail.com",
            first_name="Dino",
            last_name="Musić",
            role=UserRole.CUSTOMER,
            password="password",
            # Tuzla
            latitude=44.5384,
            longitude=18.6671,
        )
        hashed_password = get_password_hash(customer_user.password)
        db_user = DBUser(
            email=customer_user.email,
            first_name=customer_user.first_name,
            last_name=customer_user.last_name,
            hashed_password=hashed_password,
            latitude=customer_user.latitude,
            longitude=customer_user.longitude,
        )
        db_user.role = UserRole.CUSTOMER
        db.add(db_user)
        db.commit()
        print("Customer user created successfully: ", db_user)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()


def create_admin():
    db = SessionLocal()
    try:
        admin_user = UserCreate(
            email="ema.djedovic27@gmail.com",
            first_name="Ema",
            last_name="Djedović",
            role=UserRole.ADMIN,
            password="password",
        )
        hashed_password = get_password_hash(admin_user.password)
        db_user = DBUser(
            email=admin_user.email,
            first_name=admin_user.first_name,
            last_name=admin_user.last_name,
            hashed_password=hashed_password,
        )
        db_user.role = UserRole.ADMIN
        db.add(db_user)
        db.commit()
        print("Admin user created successfully: ", db_user)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()


def create_restaurant_admin():
    db = SessionLocal()
    try:
        restaurant_admin_user = UserCreate(
            email="ema.djedovic1@gmail.com",
            first_name="Ema",
            last_name="Djedović",
            role=UserRole.RESTAURANT_ADMIN,
            password="password",
        )
        hashed_password = get_password_hash(restaurant_admin_user.password)
        db_user = DBUser(
            email=restaurant_admin_user.email,
            first_name=restaurant_admin_user.first_name,
            last_name=restaurant_admin_user.last_name,
            hashed_password=hashed_password,
        )
        db_user.role = UserRole.RESTAURANT_ADMIN
        db.add(db_user)
        db.commit()
        print("Restaurant admin user created successfully: ", db_user)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()


def create_delivery_personnel():
    db = SessionLocal()
    try:
        delivery_personnel_user = UserCreate(
            email="agnesounds@gmail.com",
            first_name="Ema",
            last_name="Djedović",
            role=UserRole.DELIVERY_PERSONNEL,
            password="password",
        )
        hashed_password = get_password_hash(delivery_personnel_user.password)
        db_user = DBUser(
            email=delivery_personnel_user.email,
            first_name=delivery_personnel_user.first_name,
            last_name=delivery_personnel_user.last_name,
            hashed_password=hashed_password,
        )
        db_user.role = UserRole.DELIVERY_PERSONNEL
        db.add(db_user)
        db.commit()
        print("Delivery personnel user created successfully: ", db_user)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()
