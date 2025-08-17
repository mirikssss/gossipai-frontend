from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, List
from pydantic import BaseModel
from app.models.user import User
from app.services.ai_service import AIService
from app.services.ocr_service import OCRService
from app.services.speech_service import SpeechService
from app.services.storage_service import StorageService
from app.services import history_service
from app.models.history import AnalysisHistoryCreate
from app.api.deps import get_current_user
import json
import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class TextAnalysisRequest(BaseModel):
    text: str
    additional_prompt: Optional[str] = None
    preset_id: Optional[str] = None
    temperature: Optional[float] = None

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class SuggestedResponsesRequest(BaseModel):
    conversation_text: str
    context: Optional[str] = None

@router.post("/text")
async def analyze_text(
    request: TextAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """Analyze text for emotional content"""
    try:
        analysis_result = await AIService.analyze_text(
            text=request.text, 
            additional_prompt=request.additional_prompt,
            preset_id=request.preset_id,
            temperature=request.temperature
        )
        
        # Create history entry
        result = analysis_result["result"]
        
        # Save analysis to history
        history_data = AnalysisHistoryCreate(
            user_id=current_user.id,
            title=f"Анализ текста {datetime.now().strftime('%d.%m.%Y')}",
            file_type="text",
            file_name="text_input.txt",
            analysis_results=result,
            dominant_emotion=result.get("emotionTimeline", {}).get("dominantEmotion", "Не определено"),
            overall_score=result.get("aiJudgeScore", {}).get("overallScore", 0),
            message_count=result.get("summary", {}).get("messageCount", 0),
            participants=result.get("summary", {}).get("participants", 0)
        )
        await history_service.save_analysis_history(history_data)
        
        # Явно возвращаем с полем result для совместимости
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def analyze_file(
    file: UploadFile = File(...),
    additional_prompt: Optional[str] = Form(None),
    preset_id: Optional[str] = Form(None),
    temperature: Optional[float] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """Analyze uploaded file (text, image, or audio)"""
    try:
        # Determine file type and process accordingly
        file_extension = file.filename.split(".")[-1].lower() if file.filename else ""
        content_type = file.content_type or ""
        
        logger.info(f"Processing file: {file.filename}, extension: {file_extension}, content_type: {content_type}")
        
        if file_extension in ["txt", "md", "doc", "docx"] or content_type.startswith("text/"):
            # Text file
            content = await file.read()
            text = content.decode("utf-8")
            logger.info(f"Extracted text from file: {len(text)} characters")
            analysis_result = await AIService.analyze_text(text, additional_prompt, preset_id, temperature)
        elif file_extension in ["jpg", "jpeg", "png", "gif", "bmp", "webp"] or content_type.startswith("image/"):
            # Image file - use OCR
            content = await file.read()
            logger.info(f"Processing image file: {len(content)} bytes")
            text = await OCRService.extract_text(content)
            logger.info(f"Extracted text from image: {len(text)} characters")
            
            # Check if OCR failed
            if not text or text.strip() == "" or text.startswith("Google Vision API не активирован") or text.startswith("Ошибка доступа"):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Ошибка OCR: {text}. Убедитесь, что Google Vision API активирован в проекте."
                )
            
            analysis_result = await AIService.analyze_text(text, additional_prompt, preset_id, temperature)
        elif file_extension in ["mp3", "wav", "m4a", "ogg", "aac"] or content_type.startswith("audio/"):
            # Audio file - use speech-to-text
            content = await file.read()
            logger.info(f"Processing audio file: {len(content)} bytes")
            text = await SpeechService.transcribe_audio(content)
            logger.info(f"Transcribed audio: {len(text)} characters")
            analysis_result = await AIService.analyze_text(text, additional_prompt, preset_id, temperature)
        elif file_extension == "pdf":
            # PDF file - for now, treat as unsupported
            raise HTTPException(status_code=400, detail="PDF файлы пока не поддерживаются. Пожалуйста, конвертируйте в изображение или текст.")
        else:
            raise HTTPException(status_code=400, detail=f"Неподдерживаемый тип файла: {file_extension}. Поддерживаются: изображения (jpg, png, gif, bmp), аудио (mp3, wav, m4a, ogg), текст (txt, md)")
        
        # Create history entry
        result = analysis_result["result"]
        
        # Determine file type from content type
        file_type = "text"
        if content_type.startswith("image/"):
            file_type = "image"
        elif content_type.startswith("audio/"):
            file_type = "audio"
            
        # Save analysis to history
        history_data = AnalysisHistoryCreate(
            user_id=current_user.id,
            title=f"Анализ файла {file.filename}",
            file_type=file_type,
            file_name=file.filename,
            analysis_results=result,
            dominant_emotion=result.get("emotionTimeline", {}).get("dominantEmotion", "Не определено"),
            overall_score=result.get("aiJudgeScore", {}).get("overallScore", 0),
            message_count=result.get("summary", {}).get("messageCount", 0),
            participants=result.get("summary", {}).get("participants", 0)
        )
        await history_service.save_analysis_history(history_data)
        
        # Явно возвращаем с полем result для совместимости
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке файла: {str(e)}")

@router.post("/upload-multiple")
async def analyze_multiple_files(
    files: List[UploadFile] = File(...),
    file_order: List[str] = Form(...),
    additional_prompt: Optional[str] = Form(None),
    preset_id: Optional[str] = Form(None),
    temperature: Optional[float] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """Analyze multiple uploaded files (images) in order"""
    try:
        if len(files) > 4:
            raise HTTPException(status_code=400, detail="Максимальное количество файлов: 4")
        
        if len(files) == 0:
            raise HTTPException(status_code=400, detail="Не загружено ни одного файла")
        
        logger.info(f"Processing {len(files)} files in order: {file_order}")
        
        # Sort files by order
        file_order_ints = [int(order) for order in file_order]
        sorted_files = [files[i] for i in file_order_ints]
        
        # Extract text from all images
        all_texts = []
        for i, file in enumerate(sorted_files):
            file_extension = file.filename.split(".")[-1].lower() if file.filename else ""
            content_type = file.content_type or ""
            
            logger.info(f"Processing file {i+1}/{len(sorted_files)}: {file.filename}")
            
            if file_extension in ["jpg", "jpeg", "png", "gif", "bmp", "webp"] or content_type.startswith("image/"):
                content = await file.read()
                logger.info(f"Processing image file {i+1}: {len(content)} bytes")
                text = await OCRService.extract_text(content)
                logger.info(f"Extracted text from image {i+1}: {len(text)} characters")
                
                # Check if OCR failed
                if not text or text.strip() == "" or text.startswith("Google Vision API не активирован") or text.startswith("Ошибка доступа"):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Ошибка OCR в файле {i+1}: {text}. Убедитесь, что Google Vision API активирован в проекте."
                    )
                
                all_texts.append(text)
            else:
                raise HTTPException(status_code=400, detail=f"Неподдерживаемый тип файла {i+1}: {file_extension}. Поддерживаются только изображения.")
        
        # Combine all texts with separators
        combined_text = "\n\n--- НОВАЯ ЧАСТЬ РАЗГОВОРА ---\n\n".join(all_texts)
        logger.info(f"Combined text from {len(all_texts)} files: {len(combined_text)} characters")
        
        # Analyze combined text
        analysis_result = await AIService.analyze_text(combined_text, additional_prompt, preset_id, temperature)
        
        # Create history entry
        result = analysis_result["result"]
        
        # Save analysis to history
        history_data = AnalysisHistoryCreate(
            user_id=current_user.id,
            title=f"Анализ {len(files)} изображений",
            file_type="multi-image",
            file_name=f"{len(files)} files",
            analysis_results=result,
            dominant_emotion=result.get("emotionTimeline", {}).get("dominantEmotion", "Не определено"),
            overall_score=result.get("aiJudgeScore", {}).get("overallScore", 0),
            message_count=result.get("summary", {}).get("messageCount", 0),
            participants=result.get("summary", {}).get("participants", 0)
        )
        await history_service.save_analysis_history(history_data)
        
        # Явно возвращаем с полем result для совместимости
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing multiple files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке файлов: {str(e)}")

@router.post("/chat")
async def chat_with_ai(
    request: ChatMessageRequest,
    current_user: User = Depends(get_current_user)
):
    """Chat with AI about the analyzed conversation"""
    try:
        result = await AIService.chat_with_ai(request.message, request.conversation_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggested-responses")
async def get_suggested_responses(
    request: SuggestedResponsesRequest,
    current_user: User = Depends(get_current_user)
):
    """Get suggested responses based on conversation analysis"""
    try:
        result = await AIService.get_suggested_responses(request.conversation_text, request.context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))