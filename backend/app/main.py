import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.services.seed_data import seed_database
from backend.app.services.scraper import run_collection_cycle

# Routers
from backend.app.routers.auth import router as auth_router
from backend.app.routers.dashboard import router as dashboard_router
from backend.app.routers.fares import router as fares_router
from backend.app.routers.routes import router as routes_router
from backend.app.routers.indexes import router as indexes_router
from backend.app.routers.weights import router as weights_router
from backend.app.routers.anomalies import router as anomalies_router
from backend.app.routers.explainability import router as explainability_router
from backend.app.routers.reports import router as reports_router
from backend.app.routers.collection import router as collection_router
from backend.app.routers.health import router as health_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MoSPI-Airfare")

scheduler = AsyncIOScheduler()

async def scheduled_scraper_job():
    """Background recurring task that triggers live collection from OTA and airline adapters."""
    logger.info("Executing scheduled real-time collection cycle...")
    db = SessionLocal()
    try:
        await run_collection_cycle(db)
        logger.info("Scheduled collection cycle completed successfully.")
    except Exception as e:
        logger.error(f"Error in scheduled collection cycle: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize DB tables
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    # 3. Start background live scraper scheduler
    if settings.ENABLE_BACKGROUND_SCRAPER:
        logger.info(f"Starting real-time scraper scheduler (Interval: {settings.SCRAPER_INTERVAL_SECONDS}s)...")
        scheduler.add_job(scheduled_scraper_job, "interval", seconds=settings.SCRAPER_INTERVAL_SECONDS)
        scheduler.start()

    yield

    # Shutdown
    if scheduler.running:
        scheduler.shutdown()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="MoSPI Official Domestic Airfare Price Intelligence Engine - SIH26056 REST API Contract",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api/v1
api_v1 = settings.API_V1_STR
app.include_router(health_router, prefix=api_v1)
app.include_router(auth_router, prefix=api_v1)
app.include_router(dashboard_router, prefix=api_v1)
app.include_router(fares_router, prefix=api_v1)
app.include_router(routes_router, prefix=api_v1)
app.include_router(indexes_router, prefix=api_v1)
app.include_router(weights_router, prefix=api_v1)
app.include_router(anomalies_router, prefix=api_v1)
app.include_router(explainability_router, prefix=api_v1)
app.include_router(reports_router, prefix=api_v1)
app.include_router(collection_router, prefix=api_v1)

# Root health check redirect
@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "OPERATIONAL",
        "api_docs": "/docs",
        "api_base": "/api/v1"
    }
