from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, analysis, history, presets

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(presets.router, prefix="/presets", tags=["presets"])
