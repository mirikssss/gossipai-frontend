from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.models.user import UserCreate, UserLogin, User
from app.services.auth import AuthService
from app.api.deps import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    result = await AuthService.register(user_data)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    response_data = {
        "message": "User registered successfully",
        "user": result["user"]
    }
    
    # Add access token if session is available
    if result.get("session") and hasattr(result["session"], 'access_token'):
        response_data["access_token"] = result["session"].access_token
        response_data["token_type"] = "bearer"
    else:
        response_data["message"] = "User registered successfully. Please check your email to confirm your account."
    
    return response_data

@router.post("/login")
async def login(request: LoginRequest):
    """Login a user with JSON data"""
    credentials = UserLogin(
        email=request.email,
        password=request.password
    )
    
    result = await AuthService.login(credentials)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["error"]
        )
    
    logger.info(f"Login successful for user: {result['user'].email}")
    logger.info(f"Session access_token: {result['session'].access_token[:20]}...")
    
    return {
        "access_token": result["session"].access_token,
        "token_type": "bearer",
        "user": result["user"]
    }

@router.get("/user")
async def get_user(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    logger.info(f"Getting user info for: {current_user.email}")
    return current_user

@router.post("/logout")
async def logout():
    """Logout a user"""
    result = await AuthService.logout("")
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["error"]
        )
    
    return {"message": "Logged out successfully"}
