from typing import Optional, Dict, Any
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AnalysisBase(BaseModel):
    user_id: UUID
    content: str
    content_type: str  # 'text', 'file', 'audio'
    preset_id: Optional[UUID] = None
    additional_prompt: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisInDB(AnalysisBase):
    id: UUID
    result: Dict[str, Any]
    created_at: datetime

class Analysis(AnalysisInDB):
    class Config:
        orm_mode = True
