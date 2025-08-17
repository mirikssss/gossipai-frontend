from datetime import datetime, timedelta
from typing import Any, Optional

from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: str, expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token for a user
    
    Note: This is a helper function, but actual token creation will be handled by Supabase
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, "secret_key", algorithm="HS256")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storing"""
    return pwd_context.hash(password)
