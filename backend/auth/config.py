# auth/config.py

from decouple import config

# Retrieve the secret key from environment variables
SECRET_KEY = config("SECRET_KEY")

# Retrieve the algorithm used for encoding/decoding tokens from environment variables
ALGORITHM = config("ALGORITHM")

# Retrieve the access token expiration time (in minutes) from environment variables,
# cast it to an integer since it is stored as a string by default
ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', cast=int)
