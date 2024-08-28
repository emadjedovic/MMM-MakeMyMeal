from sqlalchemy.orm import Session
from datetime import timedelta, timezone, datetime
from models.order_assignments import DBOrderAssignments
from models.delivery_personnel_stats import DBDeliveryPersonnelStats
from models.user import DBUser
from schemas.delivery_personnel_stats import DeliveryPersonnelStats
from geopy.distance import geodesic

local_tz = timezone(timedelta(hours=2))


def calculate_suitability_score(stats: DeliveryPersonnelStats):
    # Assuming we want to minimize delivery time, maximize service rating,
    # and consider recent activity but not overload the personnel.

    # Example weights (can be adjusted as needed)
    weight_avg_delivery_time = -0.4  # Negative because we want lower times
    weight_avg_service_rating = 0.4  # Positive because higher is better
    weight_daily_delivered_count = -0.1  # Slight negative to avoid overloading
    weight_monthly_delivered_count = -0.1  # Slight negative to spread work

    # Normalize avg_delivery_time to a scale (e.g., 0 to 1)
    normalized_delivery_time = (
        stats.avg_delivery_time.hour * 3600
        + stats.avg_delivery_time.minute * 60
        + stats.avg_delivery_time.second
    ) / (24 * 3600)

    # Calculate suitability score
    suitability_score = (
        weight_avg_delivery_time * normalized_delivery_time
        + weight_avg_service_rating * float(stats.avg_service_rating)
        + weight_daily_delivered_count * stats.daily_delivered_count
        + weight_monthly_delivered_count * stats.monthly_delivered_count
    )

    return suitability_score


def crud_assign_order_to_delivery_personnel(
    db: Session, order_id: int, order_latitude: float, order_longitude: float
):
    # Maximum allowed distance in kilometers
    max_distance_km = 30

    # Fetch all delivery personnel stats and filter by distance
    delivery_personnel_stats = db.query(DBDeliveryPersonnelStats).all()

    filtered_stats = []
    for stats in delivery_personnel_stats:
        delivery_personnel = (
            db.query(DBUser).filter(DBUser.id == stats.delivery_personnel_id).first()
        )

        # Calculate the distance between the order location and the delivery personnel location
        distance = geodesic(
            (order_latitude, order_longitude),
            (delivery_personnel.latitude, delivery_personnel.longitude),
        ).kilometers

        if distance <= max_distance_km:
            filtered_stats.append(stats)

    if not filtered_stats:
        raise Exception("No suitable delivery personnel found within 30 kilometers.")

    # Calculate suitability score for each remaining delivery personnel
    suitability_scores = {}
    for stats in filtered_stats:
        suitability_scores[stats.delivery_personnel_id] = calculate_suitability_score(
            stats
        )

    # Find the delivery personnel with the highest suitability score
    best_delivery_personnel_id = max(suitability_scores, key=suitability_scores.get)

    # Create the order assignment
    order_assignment = DBOrderAssignments(
        order_id=order_id,
        delivery_personnel_id=best_delivery_personnel_id,
        assigned_at=datetime.now(tz=timezone.utc),  # Current UTC time for `assigned_at`
    )
    db.add(order_assignment)
    db.commit()
    db.refresh(order_assignment)
    return order_assignment


def crud_get_order_assignment(db: Session, order_id: int, delivery_personnel_id: int):
    return (
        db.query(DBOrderAssignments)
        .filter(
            DBOrderAssignments.order_id == order_id,
            DBOrderAssignments.delivery_personnel_id == delivery_personnel_id,
        )
        .first()
    )


def crud_update_delivery_start_time(
    db: Session, order_id: int, delivery_personnel_id: int
):
    db_order_assignment = (
        db.query(DBOrderAssignments)
        .filter(
            DBOrderAssignments.order_id == order_id,
            DBOrderAssignments.delivery_personnel_id == delivery_personnel_id,
        )
        .first()
    )

    if db_order_assignment:
        db_order_assignment.delivery_start_time = datetime.now(
            local_tz
        )  # Set current time
        db.commit()
        db.refresh(db_order_assignment)
        return db_order_assignment
    return None


def crud_update_delivery_end_time(
    db: Session, order_id: int, delivery_personnel_id: int
):
    db_order_assignment = (
        db.query(DBOrderAssignments)
        .filter(
            DBOrderAssignments.order_id == order_id,
            DBOrderAssignments.delivery_personnel_id == delivery_personnel_id,
        )
        .first()
    )

    if db_order_assignment:
        db_order_assignment.delivery_end_time = datetime.now(
            local_tz
        )  # Set current time
        db.commit()
        db.refresh(db_order_assignment)
        return db_order_assignment
    return None
