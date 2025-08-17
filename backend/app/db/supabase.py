import os
import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """Get Supabase client with anon key"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations"""
    # Use service role key if available, otherwise use anon key
    service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
    
    if settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.info("Using Service Role Key for admin operations")
    else:
        logger.warning("Service Role Key not found, using Anon Key")
    
    return create_client(settings.SUPABASE_URL, service_role_key)
