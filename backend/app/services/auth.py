from typing import Optional, Dict, Any
import logging
from app.db.supabase import get_supabase_client, get_supabase_admin_client
from app.models.user import UserCreate, UserLogin, User, UserInDB
from app.services.preset_service import PresetService

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AuthService:
    """Service for handling authentication with Supabase"""
    
    @staticmethod
    async def register(user_data: UserCreate) -> Dict[str, Any]:
        """Register a new user with Supabase Auth"""
        logger.info(f"Attempting to register user: {user_data.email}")
        
        try:
            supabase = get_supabase_client()
            supabase_admin = get_supabase_admin_client()
            logger.info("Supabase clients created successfully")
            
            # Check if user already exists
            logger.info("Checking if user already exists")
            try:
                existing_user = supabase_admin.table("users").select("*").eq("email", user_data.email).execute()
                if existing_user.data and len(existing_user.data) > 0:
                    logger.warning(f"User with email {user_data.email} already exists")
                    # Try to sign in instead
                    logger.info("Attempting to sign in existing user")
                    try:
                        auth_response = supabase.auth.sign_in(
                            email=user_data.email,
                            password=user_data.password
                        )
                        return {
                            "success": True,
                            "user": auth_response.user,
                            "session": auth_response
                        }
                    except Exception as sign_in_error:
                        logger.error(f"Sign in failed: {sign_in_error}")
                        return {
                            "success": False,
                            "error": "User already exists. Please use login instead."
                        }
            except Exception as e:
                logger.info(f"Error checking existing user (might be first registration): {e}")
            
            # Register user with Supabase Auth
            logger.info("Calling Supabase auth.sign_up")
            auth_response = supabase.auth.sign_up(
                email=user_data.email,
                password=user_data.password
            )
            logger.info(f"Auth response received: {auth_response}")
            
            # Create user profile in the database
            if auth_response.user:
                user_id = str(auth_response.user.id)  # Convert UUID to string
                logger.info(f"User created with ID: {user_id}")
                
                # Create default user settings
                default_settings = {
                    "language": "ru",
                    "timezone": "Europe/Moscow",
                    "theme": "system"
                }
                
                # Insert user data into the users table using admin client
                user_data_dict = {
                    "id": user_id,
                    "email": user_data.email,
                    "name": user_data.name,
                    "settings": default_settings
                }
                
                logger.info("Inserting user data into database using admin client")
                try:
                    supabase_admin.table("users").insert(user_data_dict).execute()
                    logger.info("User data inserted successfully")
                except Exception as db_error:
                    logger.error(f"Database insertion error: {db_error}")
                    # If user already exists in database, try to get existing user
                    if "duplicate key" in str(db_error) or "already exists" in str(db_error):
                        logger.info("User already exists in database, getting existing user")
                        existing_user_response = supabase_admin.table("users").select("*").eq("id", user_id).execute()
                        if existing_user_response.data:
                            logger.info("Found existing user in database")
                        else:
                            return {
                                "success": False,
                                "error": "Failed to create user profile"
                            }
                    else:
                        return {
                            "success": False,
                            "error": f"Database error: {str(db_error)}"
                        }
                
                # Create default presets for the new user (skip if fails)
                logger.info("Creating default presets")
                try:
                    await PresetService.create_default_presets(auth_response.user.id)  # Pass UUID object
                    logger.info("Default presets created")
                except Exception as preset_error:
                    logger.warning(f"Failed to create default presets: {preset_error}")
                
                # Get session from auth_response
                session = auth_response
                
                return {
                    "success": True,
                    "user": auth_response.user,
                    "session": session
                }
            
            logger.error("No user returned from auth.sign_up")
            return {
                "success": False,
                "error": "Failed to create user"
            }
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    async def login(credentials: UserLogin) -> Dict[str, Any]:
        """Login a user with Supabase Auth"""
        supabase = get_supabase_client()
        
        try:
            # Login with Supabase Auth (using sign_in for version 0.7.1)
            auth_response = supabase.auth.sign_in(
                email=credentials.email,
                password=credentials.password
            )
            
            return {
                "success": True,
                "user": auth_response.user,
                "session": auth_response
            }
            
        except Exception as e:
            error_message = str(e)
            logger.error(f"Login error: {error_message}")
            
            # Provide more specific error messages
            if "Email not confirmed" in error_message:
                return {
                    "success": False,
                    "error": "Please check your email and confirm your account before logging in."
                }
            elif "Invalid login credentials" in error_message:
                return {
                    "success": False,
                    "error": "Invalid email or password."
                }
            else:
                return {
                    "success": False,
                    "error": "Login failed. Please try again."
                }
    
    @staticmethod
    async def logout(jwt: str) -> Dict[str, Any]:
        """Logout a user with Supabase Auth"""
        supabase = get_supabase_client()
        
        try:
            # Logout with Supabase Auth
            supabase.auth.sign_out()
            
            return {
                "success": True
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    async def get_current_user(jwt: str) -> Optional[User]:
        """Get current user from Supabase Auth"""
        supabase = get_supabase_client()
        
        try:
            # Get user from Supabase Auth
            user = supabase.auth.get_user(jwt)
            
            if user:
                # Get user profile from database
                response = supabase.table("users").select("*").eq("id", user.id).execute()
                
                if response.data and len(response.data) > 0:
                    user_data = response.data[0]
                    return User(**user_data)
            
            return None
            
        except Exception:
            return None
