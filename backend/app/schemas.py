from typing import Any, List, Optional, Generic, TypeVar, Dict
from pydantic import BaseModel, Field
import datetime

T = TypeVar("T")

class MetaInfo(BaseModel):
    page: int = 1
    page_size: int = 25
    total: int = 0
    generated_at: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")

class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: Optional[MetaInfo] = None

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "Viewer"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardSummary(BaseModel):
    national_index: float
    mom_change_pct: float
    yoy_change_pct: float
    routes_monitored: int
    observations_24h: int
    open_anomalies: int
    high_alerts: int
    data_freshness_minutes: int

class DashboardTrendPoint(BaseModel):
    date: str
    month: str
    national_index: float
    cpi_baseline: float
    laspeyres: float
    fisher: float
    jevons: float
    dutot: float
    mom_change: float
    yoy_change: float
    metro_metro_sub_index: float
    regional_sub_index: float

class DashboardHeatmapRoute(BaseModel):
    route_key: str
    origin: str
    destination: str
    tier: str
    current_fare: float
    pct_change_7d: float
    route_index: float
    volatility_score: float
    dominant_airline: str
    passenger_weight: float

# Fare Observation schemas
class FareObservationBase(BaseModel):
    source_id: str
    airline_code: str
    origin: str
    destination: str
    route_key: str
    travel_date: str
    lead_time_days: int
    lead_time_bucket: str
    base_fare: float
    taxes: float = 0.0
    fees: float = 0.0
    total_fare: float
    seat_availability: Optional[int] = 9
    cabin: str = "Economy"
    fare_family: str = "Standard"
    flight_number: Optional[str] = ""

class FareObservationCreate(FareObservationBase):
    pass

class FareObservationResponse(FareObservationBase):
    id: str
    collection_timestamp: datetime.datetime
    booking_timestamp: datetime.datetime
    currency: str
    quality_score: float
    anomaly_status: str
    parser_version: str
    class Config:
        from_attributes = True

# Anomaly schemas
class AnomalyReviewRequest(BaseModel):
    status: str # "validated", "rejected", "resolved"
    review_note: Optional[str] = None

class AnomalyResponse(BaseModel):
    anomaly_id: str
    observation_id: str
    detector: str
    score: float
    expected_min: float
    expected_max: float
    reason_signals: Optional[Dict[str, Any]] = None
    severity: str
    status: str
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime.datetime] = None
    review_note: Optional[str] = None
    created_at: datetime.datetime
    # Attached observation detail for display
    route_key: Optional[str] = None
    airline_code: Optional[str] = None
    observed_fare: Optional[float] = None
    travel_date: Optional[str] = None
    source_id: Optional[str] = None
    class Config:
        from_attributes = True

# Index Run schemas
class IndexRunCreate(BaseModel):
    period: str = "2026-09"
    methodology: str = "Fisher" # Fisher, Laspeyres, Jevons, Dutot
    geography_level: str = "National"
    route_key: Optional[str] = "ALL"
    weight_version: Optional[str] = "DGCA-2024-Q4"

class IndexRunResponse(BaseModel):
    index_run_id: str
    index_type: str
    geography_level: str
    route_key: str
    period: str
    base_period: str
    index_value: float
    percent_change: float
    methodology_version: str
    weight_version: str
    observation_count: int
    calculation_timestamp: datetime.datetime
    status: str
    class Config:
        from_attributes = True

# Weights schemas
class RouteWeightResponse(BaseModel):
    id: str
    route_key: str
    origin: str
    destination: str
    tier: str
    passenger_volume: int
    weight_share: float
    effective_from: str
    effective_to: str
    source_reference: str
    version: str
    class Config:
        from_attributes = True

class RouteWeightCreate(BaseModel):
    route_key: str
    origin: str
    destination: str
    tier: str = "Metro-Metro"
    passenger_volume: int
    weight_share: float
    effective_from: str = "2024-01-01"
    effective_to: str = "2026-12-31"
    source_reference: str = "DGCA City-Pair Traffic Report"
    version: str = "DGCA-2024-Q4"

# Alert schemas
class AlertResponse(BaseModel):
    alert_id: str
    metric: str
    threshold: str
    evidence: str
    severity: str
    status: str
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None
    class Config:
        from_attributes = True

# Source schemas
class SourceResponse(BaseModel):
    source_id: str
    name: str
    type: str
    status: str
    success_rate_24h: float
    avg_latency_ms: int
    observations_24h: int
    last_scraped: datetime.datetime
    error_rate: float
    adapter_version: str
    class Config:
        from_attributes = True

# Collection Job schemas
class CollectionJobCreate(BaseModel):
    source_id: str = "ALL"
    routes: Optional[List[str]] = None

class CollectionJobResponse(BaseModel):
    job_id: str
    source_id: str
    status: str
    items_collected: int
    items_valid: int
    items_anomalous: int
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    error_message: Optional[str] = None
    class Config:
        from_attributes = True

# Report schemas
class ReportCreateRequest(BaseModel):
    title: str
    report_type: str # "Monthly CPI Airfare Bulletin", "Route Volatility Dossier", etc.
    format: str = "PDF" # PDF, XLSX, CSV
    period: str = "2026-09"

class ReportJobResponse(BaseModel):
    job_id: str
    title: str
    report_type: str
    format: str
    period: str
    status: str
    file_path: Optional[str] = None
    file_size: str
    checksum: Optional[str] = None
    created_at: datetime.datetime
    class Config:
        from_attributes = True
