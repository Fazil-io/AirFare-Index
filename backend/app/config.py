import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MoSPI Airfare Price Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "2.4.0"
    METHODOLOGY_VERSION: str = "v2.4-Fisher-Chain"
    WEIGHT_VERSION: str = "DGCA-2024-Q4"
    
    # Database: SQLite default for local zero-config, PostgreSQL/TimescaleDB in prod
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./airfare_intelligence.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mospi-sih26056-airfare-secret-token-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Realtime Scraping Scheduler (seconds between live scrapers)
    SCRAPER_INTERVAL_SECONDS: int = 45
    ENABLE_BACKGROUND_SCRAPER: bool = True
    
    # Reports directory
    REPORTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_reports")

    class Config:
        case_sensitive = True

settings = Settings()
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
