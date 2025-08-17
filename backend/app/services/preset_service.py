from typing import List, Dict, Any, Optional
from uuid import UUID
from app.db.supabase import get_supabase_admin_client
from app.models.preset import Preset, PresetCreate, PresetUpdate, ALL_PRESETS, get_preset_by_id

class PresetService:
    """Service for handling presets"""
    
    @staticmethod
    async def create_default_presets(user_id: UUID) -> List[Preset]:
        """Create default presets for a new user"""
        supabase_admin = get_supabase_admin_client()
        
        default_presets = [
            {
                "user_id": str(user_id),
                "name": "Общий анализ",
                "description": "Стандартный анализ эмоций и тона",
                "icon": "📊",
                "color": "blue",
                "settings": {"temperature": 0.7},
                "is_default": True
            },
            {
                "user_id": str(user_id),
                "name": "Конфликтный анализ",
                "description": "Детальный анализ конфликтных ситуаций",
                "icon": "⚔️",
                "color": "red",
                "settings": {"temperature": 0.8},
                "is_default": True
            },
            {
                "user_id": str(user_id),
                "name": "Деловой анализ",
                "description": "Анализ профессиональной коммуникации",
                "icon": "💼",
                "color": "green",
                "settings": {"temperature": 0.6},
                "is_default": True
            }
        ]
        
        try:
            # Insert all default presets
            response = supabase_admin.table("presets").insert(default_presets).execute()
            
            if response.data:
                return [Preset(**preset) for preset in response.data]
            else:
                return []
                
        except Exception as e:
            print(f"Error creating default presets: {e}")
            return []
    
    @staticmethod
    async def get_user_presets(user_id: UUID) -> List[Preset]:
        """Get all presets for a user"""
        # Return all available presets since they are now predefined
        return ALL_PRESETS
    
    @staticmethod
    async def create_preset(preset_data: PresetCreate) -> Optional[Preset]:
        """Create a new preset"""
        supabase = get_supabase_admin_client()
        
        try:
            response = supabase.table("presets").insert(preset_data.dict()).execute()
            
            if response.data and len(response.data) > 0:
                return Preset(**response.data[0])
            else:
                return None
                
        except Exception as e:
            print(f"Error creating preset: {e}")
            return None
    
    @staticmethod
    async def update_preset(preset_id: UUID, preset_data: PresetUpdate) -> Optional[Preset]:
        """Update an existing preset"""
        supabase = get_supabase_admin_client()
        
        try:
            # Remove None values
            update_data = {k: v for k, v in preset_data.dict().items() if v is not None}
            
            response = supabase.table("presets").update(update_data).eq("id", str(preset_id)).execute()
            
            if response.data and len(response.data) > 0:
                return Preset(**response.data[0])
            else:
                return None
                
        except Exception as e:
            print(f"Error updating preset: {e}")
            return None
    
    @staticmethod
    async def get_preset_by_id(preset_id: str) -> Optional[Preset]:
        """Get a specific preset by ID"""
        return get_preset_by_id(preset_id)
    
    @staticmethod
    async def delete_preset(preset_id: UUID) -> bool:
        """Delete a preset"""
        # Since presets are now predefined, we don't allow deletion
        return False
