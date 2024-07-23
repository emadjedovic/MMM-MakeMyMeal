# schemas/token.py
# Pydantic models for token response and token data

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
