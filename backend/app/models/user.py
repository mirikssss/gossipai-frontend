from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """User update model"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None

class UserSettings(BaseModel):
    """User settings model"""
    language: str = "ru"
    timezone: str = "Europe/Moscow"
    theme: str = "system"
    
class UserInDB(UserBase):
    id: UUID
    settings: Dict[str, Any]

class User(UserInDB):
    class Config:
        orm_mode = True
