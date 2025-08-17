from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Dict, Any
from uuid import UUID

from app.models.history import AnalysisHistoryItem, AnalysisHistory
from app.services import history_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[AnalysisHistoryItem])
async def get_history(
    current_user: User = Depends(get_current_user),
):
    """Get analysis history for the current user"""
    history = await history_service.get_user_analysis_history(current_user.id)
    return history

@router.get("/{history_id}", response_model=AnalysisHistory)
async def get_analysis_detail(
    history_id: UUID = Path(..., description="ID of the analysis to retrieve"),
    current_user: User = Depends(get_current_user),
):
    """Get detailed analysis by id"""
    analysis = await history_service.get_analysis_detail(history_id, current_user.id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.delete("/{history_id}")
async def delete_analysis(
    history_id: UUID = Path(..., description="ID of the analysis to delete"),
    current_user: User = Depends(get_current_user),
):
    """Delete an analysis from history"""
    result = await history_service.delete_analysis(history_id, current_user.id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"success": True, "message": "Analysis deleted successfully"}
