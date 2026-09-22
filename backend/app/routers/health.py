import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.database import get_db
from backend.app.config import settings
from backend.app.schemas import ApiResponse

router = APIRouter(prefix="", tags=["Health & System"])

@router.get("/health")
def basic_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@router.get("/health/ready")
def readiness_check(db: Session = Depends(get_db)):
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    return {
        "status": "ready" if db_ok else "unready",
        "database": "connected" if db_ok else "error",
        "methodology_engine": "ready",
        "scraper_orchestrator": "ready",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@router.get("/health/live")
def liveness_check():
    return {
        "status": "alive",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@router.get("/system/version")
def system_version():
    return ApiResponse(data={
        "system": settings.PROJECT_NAME,
        "api_version": settings.VERSION,
        "methodology_version": settings.METHODOLOGY_VERSION,
        "weight_version": settings.WEIGHT_VERSION,
        "base_period": "2024-Q4",
        "standards_compliance": ["MoSPI TAC 2024", "ILO CPI Manual 2020", "IMF Air Passenger Index"]
    })
