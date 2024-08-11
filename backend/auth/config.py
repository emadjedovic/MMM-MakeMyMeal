# auth/config.py

from decouple import config
from pydantic import BaseModel, EmailStr

SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)

class EmailSettings(BaseModel):
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: EmailStr
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_TLS: bool
    MAIL_SSL: bool
    MAIL_FROM_NAME: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create an instance of EmailSettings with environment variables
email_settings = EmailSettings(
    MAIL_USERNAME=config("MAIL_USERNAME"),
    MAIL_PASSWORD=config("MAIL_PASSWORD"),
    MAIL_FROM=config("MAIL_FROM"),
    MAIL_PORT=config("MAIL_PORT", cast=int),
    MAIL_SERVER=config("MAIL_SERVER"),
    MAIL_TLS=config("MAIL_TLS", cast=bool),
    MAIL_SSL=config("MAIL_SSL", cast=bool),
    MAIL_FROM_NAME=config("MAIL_FROM_NAME")
)
''''''
# Optional: Print to verify values (for debugging)
print(email_settings.MAIL_USERNAME)
print(email_settings.MAIL_PASSWORD)
print(email_settings.MAIL_FROM)
print(email_settings.MAIL_PORT)
print(email_settings.MAIL_SERVER)
print(email_settings.MAIL_TLS)
print(email_settings.MAIL_SSL)
print(email_settings.MAIL_FROM_NAME)
