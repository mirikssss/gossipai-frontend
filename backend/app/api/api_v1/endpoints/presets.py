from fastapi import APIRouter, Depends
from typing import List
from app.models.preset import ALL_PRESETS, get_preset_by_id, Preset, STANDARD_CARDS
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Preset])
async def get_all_presets(current_user: User = Depends(get_current_user)):
    """
    Получить список всех доступных пресетов анализа
    """
    return ALL_PRESETS

@router.get("/standard-cards")
async def get_standard_analysis_cards(current_user: User = Depends(get_current_user)):
    """
    Получить список стандартных карточек анализа, которые отображаются для всех пресетов
    """
    return STANDARD_CARDS

@router.get("/{preset_id}", response_model=Preset)
async def get_preset_details(preset_id: str, current_user: User = Depends(get_current_user)):
    """
    Получить детальную информацию о конкретном пресете
    """
    return get_preset_by_id(preset_id)
