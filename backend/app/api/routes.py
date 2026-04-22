from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/alerts")
async def get_alerts():
    # Thực tế sẽ gọi app.services.wazuh_connector
    return {
        "status": "success", 
        "data": [{"id": 1, "level": 10, "description": "SSH Brute Force Detected"}]
    }

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}