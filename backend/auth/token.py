# auth/token.py
# signing, encoding, decoding and returning JWTs

import jwt
import time
from typing import Dict
from auth.config import SECRET_KEY, ALGORITHM
from fastapi import HTTPException, status

def token_response(token: str) -> Dict[str, str]:
    return {
        "access_token": token
    }

def sign_jwt(email: str) -> Dict[str, str]:
    payload = {
        "sub": email,
        "exp": time.time() + 600
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token_response(token)

def decode_jwt(token: str) -> dict:
    try:
        decoded_token: dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if decoded_token.get("exp", 0) < time.time():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
