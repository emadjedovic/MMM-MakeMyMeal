# schemas/token.py
# Pydantic models for token response and token data

from pydantic import BaseModel

class Token(BaseModel):
    """
    Schema for representing a token response.

    Attributes:
    - access_token: The JWT access token as a string.
    - token_type: The type of the token, typically "Bearer".
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Schema for representing the data contained in the token.

    Attributes:
    - email: The email address associated with the token.
    """
    email: str
