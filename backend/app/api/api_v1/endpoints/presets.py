from fastapi import APIRouter, Depends
from typing import List
from app.models.preset import ALL_PRESETS, get_preset_by_id, Preset, STANDARD_CARDS
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Preset])
async def get_all_presets():
    """
    Получить список всех доступных пресетов анализа
    """
    return ALL_PRESETS

@router.get("/standard-cards")
async def get_standard_analysis_cards():
    """
    Получить стандартные карточки анализа
    """
    return STANDARD_CARDS

@router.get("/{preset_id}", response_model=Preset)
async def get_preset(preset_id: str):
    """
    Получить конкретный пресет по ID
    """
    preset = get_preset_by_id(preset_id)
    if not preset:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Preset not found")
    return preset
