import math


def to_radians(degrees):
    return degrees * (math.pi / 180)


def calculate_distance(rest_latitude, rest_longitude, user_latitude, user_longitude):
    R = 6371

    d_lat = to_radians(rest_latitude - user_latitude)
    d_lon = to_radians(rest_longitude - user_longitude)
    lat1 = to_radians(user_latitude)
    lat2 = to_radians(rest_latitude)

    a = math.sin(d_lat / 2) ** 2 + math.sin(d_lon / 2) ** 2 * math.cos(lat1) * math.cos(
        lat2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return round(distance, 3)
