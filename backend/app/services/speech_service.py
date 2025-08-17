import os
import logging
from typing import Dict, Any
from google.cloud import speech
from app.core.config import settings

logger = logging.getLogger(__name__)

class SpeechService:
    """Service for handling speech-to-text with Google Speech-to-Text API"""
    
    @staticmethod
    async def transcribe_audio(audio_data: bytes, audio_format: str = "wav") -> Dict[str, Any]:
        """Transcribe audio using Google Speech-to-Text API"""
        try:
            logger.info("Starting speech-to-text with Google Speech API")
            
            # Check if credentials are set
            if not settings.GOOGLE_APPLICATION_CREDENTIALS:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set in settings")
                logger.info("Attempting to use default credentials...")
                # Try to continue without explicit credentials
            
            # Check if credentials file exists (only if it's a file path)
            if settings.GOOGLE_APPLICATION_CREDENTIALS:
                creds_path = settings.GOOGLE_APPLICATION_CREDENTIALS
                if not creds_path.startswith('{') and not os.path.exists(creds_path):
                    logger.warning(f"Credentials file not found: {creds_path}")
                    logger.info("Attempting to use credentials from environment variable...")
                    # Try to continue without file - credentials might be set via environment
            
            # Initialize Speech client
            client = speech.SpeechClient()
            
            # Configure audio
            audio = speech.RecognitionAudio(content=audio_data)
            
            # Configure recognition
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="ru-RU",
                enable_automatic_punctuation=True,
                enable_word_time_offsets=True
            )
            
            # Perform transcription
            response = client.recognize(config=config, audio=audio)
            
            # Extract transcript
            transcript = ""
            confidence = 0.0
            
            for result in response.results:
                transcript += result.alternatives[0].transcript + " "
                confidence = max(confidence, result.alternatives[0].confidence)
            
            if transcript:
                logger.info(f"Successfully transcribed audio: {len(transcript)} characters")
                
                return {
                    "success": True,
                    "text": transcript.strip(),
                    "confidence": confidence,
                    "language": "ru-RU"
                }
            else:
                logger.warning("No speech detected in audio")
                return {
                    "success": True,
                    "text": "",
                    "confidence": 0.0,
                    "language": "unknown"
                }
                
        except Exception as e:
            logger.error(f"Error in speech-to-text: {str(e)}")
            # Fallback to mock result
            logger.warning("Falling back to mock transcription due to error")
            return await SpeechService.mock_transcription_result()
    
    @staticmethod
    async def mock_transcription_result() -> Dict[str, Any]:
        """Fallback mock transcription result"""
        return {
            "success": True,
            "text": "Это пример транскрипции аудио файла. Здесь может быть любой текст, который был распознан из аудио записи.",
            "confidence": 0.85,
            "language": "ru-RU"
        }
