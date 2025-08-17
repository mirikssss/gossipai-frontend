from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AnalysisHistoryBase(BaseModel):
    user_id: UUID
    title: str
    file_type: str  # 'text', 'image', 'audio'
    file_name: str
    file_url: Optional[str] = None
    analysis_results: Dict[str, Any]
    dominant_emotion: str
    overall_score: int
    message_count: int
    participants: int

class AnalysisHistoryCreate(AnalysisHistoryBase):
    pass

class AnalysisHistoryInDB(AnalysisHistoryBase):
    id: UUID
    date: datetime
    created_at: datetime

class AnalysisHistory(AnalysisHistoryInDB):
    class Config:
        orm_mode = True

class AnalysisHistoryItem(BaseModel):
    id: UUID
    title: str
    date: datetime
    dominant_emotion: str
    overall_score: int
    message_count: int
    participants: int
    file_type: str
