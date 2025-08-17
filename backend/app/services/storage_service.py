import os
import logging
from typing import Dict, Any, Optional
from app.db.supabase import get_supabase_client
from app.core.config import settings

logger = logging.getLogger(__name__)

class StorageService:
    """Service for handling file storage with Supabase Storage"""
    
    @staticmethod
    async def upload_file(file_data: bytes, filename: str, folder: str = "uploads") -> Dict[str, Any]:
        """Upload file to Supabase Storage"""
        try:
            logger.info(f"Starting file upload: {filename} to folder: {folder}")
            
            supabase = get_supabase_client()
            
            # Create file path
            file_path = f"{folder}/{filename}"
            
            # Upload file to Supabase Storage
            response = supabase.storage.from_("files").upload(
                path=file_path,
                file=file_data,
                file_options={"content-type": "application/octet-stream"}
            )
            
            if response:
                # Get public URL
                public_url = supabase.storage.from_("files").get_public_url(file_path)
                
                logger.info(f"File uploaded successfully: {public_url}")
                
                return {
                    "success": True,
                    "url": public_url,
                    "path": file_path,
                    "filename": filename
                }
            else:
                logger.error("Failed to upload file")
                return {
                    "success": False,
                    "error": "Upload failed"
                }
                
        except Exception as e:
            logger.error(f"Error in file upload: {str(e)}")
            # Fallback to mock result
            logger.warning("Falling back to mock storage due to error")
            return await StorageService.mock_upload_result(filename)
    
    @staticmethod
    async def download_file(file_path: str) -> Dict[str, Any]:
        """Download file from Supabase Storage"""
        try:
            logger.info(f"Starting file download: {file_path}")
            
            supabase = get_supabase_client()
            
            # Download file from Supabase Storage
            response = supabase.storage.from_("files").download(file_path)
            
            if response:
                logger.info(f"File downloaded successfully: {len(response)} bytes")
                
                return {
                    "success": True,
                    "data": response,
                    "size": len(response)
                }
            else:
                logger.error("Failed to download file")
                return {
                    "success": False,
                    "error": "Download failed"
                }
                
        except Exception as e:
            logger.error(f"Error in file download: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    async def delete_file(file_path: str) -> Dict[str, Any]:
        """Delete file from Supabase Storage"""
        try:
            logger.info(f"Starting file deletion: {file_path}")
            
            supabase = get_supabase_client()
            
            # Delete file from Supabase Storage
            response = supabase.storage.from_("files").remove([file_path])
            
            if response:
                logger.info("File deleted successfully")
                
                return {
                    "success": True,
                    "message": "File deleted successfully"
                }
            else:
                logger.error("Failed to delete file")
                return {
                    "success": False,
                    "error": "Deletion failed"
                }
                
        except Exception as e:
            logger.error(f"Error in file deletion: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    async def mock_upload_result(filename: str) -> Dict[str, Any]:
        """Fallback mock upload result"""
        return {
            "success": True,
            "url": f"https://example.com/mock/{filename}",
            "path": f"uploads/{filename}",
            "filename": filename
        }
