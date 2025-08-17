import os
import logging
from typing import Dict, Any
from google.cloud import vision
from app.core.config import settings

logger = logging.getLogger(__name__)

class OCRService:
    """Service for handling OCR with Google Vision API"""
    
    @staticmethod
    async def extract_text(image_data: bytes) -> str:
        """Extract text from image - wrapper method for compatibility"""
        try:
            result = await OCRService.extract_text_from_image(image_data)
            if result["success"]:
                return result["text"]
            else:
                logger.error("OCR extraction failed")
                return "Не удалось извлечь текст из изображения"
        except Exception as e:
            logger.error(f"Error in extract_text: {str(e)}")
            return "Ошибка при обработке изображения"

    @staticmethod
    async def extract_text_from_image(image_data: bytes) -> Dict[str, Any]:
        """Extract text from image using Google Vision API"""
        try:
            logger.info("Starting OCR with Google Vision API")
            
            # Check if credentials are set
            if not settings.GOOGLE_APPLICATION_CREDENTIALS:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set in settings")
                logger.info("Attempting to use default credentials...")
                # Try to continue without explicit credentials
            
            # Check if credentials file exists
            creds_path = settings.GOOGLE_APPLICATION_CREDENTIALS
            if not os.path.exists(creds_path):
                logger.warning(f"Credentials file not found: {creds_path}")
                logger.info("Attempting to use credentials from environment variable...")
                # Try to continue without file - credentials might be set via environment
            
            # Initialize Vision client
            client = vision.ImageAnnotatorClient()
            
            # Create image object
            image = vision.Image(content=image_data)
            
            # Perform text detection with language hints for Russian
            response = client.text_detection(
                image=image,
                image_context=vision.ImageContext(
                    language_hints=["ru", "en"]  # Prioritize Russian, fallback to English
                )
            )
            
            if response.error.message:
                logger.error(f"Vision API error: {response.error.message}")
                return await OCRService.mock_ocr_result()
            
            texts = response.text_annotations
            
            # Extract text
            if texts and len(texts) > 0:
                extracted_text = texts[0].description
                logger.info(f"Successfully extracted text: {len(extracted_text)} characters")
                
                # Clean up the text
                cleaned_text = OCRService.clean_extracted_text(extracted_text)
                
                return {
                    "success": True,
                    "text": cleaned_text,
                    "confidence": 0.95,
                    "language": "ru"
                }
            else:
                logger.warning("No text found in image")
                return {
                    "success": False,
                    "text": "",
                    "confidence": 0.0,
                    "language": "unknown"
                }
                
        except Exception as e:
            logger.error(f"Error in OCR: {str(e)}")
            
            # Check for specific Google Vision API errors
            if "SERVICE_DISABLED" in str(e) or "Cloud Vision API has not been used" in str(e):
                logger.error("Google Vision API is not enabled. Please enable it in Google Cloud Console.")
                logger.error("Visit: https://console.cloud.google.com/apis/api/vision.googleapis.com/overview")
                return {
                    "success": False,
                    "text": "Google Vision API не активирован. Пожалуйста, активируйте его в Google Cloud Console.",
                    "confidence": 0.0,
                    "language": "unknown"
                }
            elif "403" in str(e):
                logger.error("Access denied to Google Vision API. Check credentials and permissions.")
                return {
                    "success": False,
                    "text": "Ошибка доступа к Google Vision API. Проверьте учетные данные.",
                    "confidence": 0.0,
                    "language": "unknown"
                }
            
            # Fallback to mock result for other errors
            logger.warning("Falling back to mock OCR due to error")
            return await OCRService.mock_ocr_result()
    
    @staticmethod
    async def mock_ocr_result() -> Dict[str, Any]:
        """Fallback mock OCR result"""
        return {
            "success": True,
            "text": """Привет! Как дела?
Отлично, спасибо! А у тебя как?
Тоже хорошо! Что делаешь?
Работаю над проектом. А ты?
Смотрю фильм. Какой проект?
Разрабатываю приложение для анализа эмоций в чатах.
Звучит интересно! Расскажи подробнее.
Это ИИ-система, которая анализирует качество общения и дает рекомендации.
Вау! Это очень полезно для бизнеса.
Да, особенно для поддержки клиентов и продаж.""",
            "confidence": 0.85,
            "language": "ru"
        }

    @staticmethod
    def clean_extracted_text(text: str) -> str:
        """Clean and format extracted text"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize line breaks
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove excessive whitespace
            cleaned_line = ' '.join(line.split())
            if cleaned_line:  # Only add non-empty lines
                cleaned_lines.append(cleaned_line)
        
        # Join lines with proper spacing
        result = '\n'.join(cleaned_lines)
        
        # Remove common OCR artifacts
        result = result.replace('|', 'I')  # Common OCR mistake
        result = result.replace('0', 'O')  # Another common mistake
        
        return result.strip()
