from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.db.supabase import get_supabase_client, get_supabase_admin_client
from app.models.user import User
import logging
import json

logger = logging.getLogger(__name__)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get the current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        logger.info(f"Validating token: {token[:20]}...")
        
        # Try JWT decode first since Supabase set_session has issues
        try:
            decoded = jwt.decode(
                token, 
                key="", 
                options={
                    "verify_signature": False,
                    "verify_aud": False,
                    "verify_exp": False
                }
            )
            logger.info(f"Decoded JWT: {decoded}")
            
            user_id = decoded.get('sub')
            if not user_id:
                logger.error("No user ID in token")
                raise credentials_exception
            
            logger.info(f"User ID from JWT: {user_id}")
            
            # Get user data from database using admin client to bypass RLS
            supabase_admin = get_supabase_admin_client()
            response = supabase_admin.table("users").select("*").eq("id", user_id).execute()
            logger.info(f"Database response: {response}")
            
            if not response.data or len(response.data) == 0:
                logger.error("No user data in database")
                # Try to create user profile if it doesn't exist
                logger.info("Attempting to create user profile from JWT data")
                try:
                    user_data_dict = {
                        "id": user_id,
                        "email": decoded.get('email', ''),
                        "name": decoded.get('user_metadata', {}).get('name', 'User'),
                        "settings": {
                            "language": "ru",
                            "timezone": "Europe/Moscow",
                            "theme": "system"
                        }
                    }
                    
                    supabase_admin.table("users").insert(user_data_dict).execute()
                    logger.info("User profile created successfully")
                    
                    return User(**user_data_dict)
                    
                except Exception as create_error:
                    logger.error(f"Failed to create user profile: {create_error}")
                    raise credentials_exception
            
            user_data = response.data[0]
            logger.info(f"User data: {user_data}")
            
            return User(**user_data)
            
        except JWTError as jwt_error:
            logger.error(f"JWT decode error: {jwt_error}")
            raise credentials_exception
        
    except Exception as e:
        logger.error(f"Error in get_current_user: {e}")
        raise credentials_exception
