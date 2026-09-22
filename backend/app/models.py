import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid(prefix=""):
    uid = str(uuid.uuid4())[:8]
    return f"{prefix}{uid}" if prefix else str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("USR-"))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Viewer") # Admin, Statistician, Analyst, Viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FareObservation(Base):
    __tablename__ = "fare_observations"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("OBS-"))
    source_id = Column(String, index=True, nullable=False) # e.g., "MakeMyTrip", "EaseMyTrip", "IndiGo Direct", "Air India Direct"
    airline_code = Column(String, index=True, nullable=False) # 6E, AI, QP, SG
    origin = Column(String, index=True, nullable=False) # DEL, BOM, BLR, MAA, HYD, CCU
    destination = Column(String, index=True, nullable=False)
    route_key = Column(String, index=True, nullable=False) # e.g., DEL-BOM
    travel_date = Column(String, nullable=False) # YYYY-MM-DD
    collection_timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    booking_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    lead_time_days = Column(Integer, nullable=False)
    lead_time_bucket = Column(String, index=True, nullable=False) # T-0, T-7, T-15, T-30+
    currency = Column(String, default="INR")
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, default=0.0)
    fees = Column(Float, default=0.0)
    total_fare = Column(Float, nullable=False)
    seat_availability = Column(Integer, nullable=True, default=9)
    cabin = Column(String, default="Economy")
    fare_family = Column(String, default="Standard")
    flight_number = Column(String, default="")
    raw_payload_ref = Column(Text, nullable=True)
    quality_score = Column(Float, default=1.0) # 0.0 to 1.0
    anomaly_status = Column(String, default="NORMAL") # NORMAL, ANOMALY_PENDING, VALIDATED, REJECTED
    parser_version = Column(String, default="v2.4.1")

class Anomaly(Base):
    __tablename__ = "anomalies"

    anomaly_id = Column(String, primary_key=True, default=lambda: generate_uuid("AN-"))
    observation_id = Column(String, ForeignKey("fare_observations.id"), nullable=False)
    detector = Column(String, nullable=False) # Z-Score, IQR, MAD, Isolation Forest
    score = Column(Float, nullable=False)
    expected_min = Column(Float, nullable=False)
    expected_max = Column(Float, nullable=False)
    reason_signals = Column(JSON, nullable=True) # {"z_score": 3.4, "historical_median": 6200, "rule": "Fare Spike"}
    severity = Column(String, default="HIGH") # HIGH, MEDIUM, LOW
    status = Column(String, default="PENDING_REVIEW") # PENDING_REVIEW, VALIDATED, REJECTED, RESOLVED
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    review_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class IndexRun(Base):
    __tablename__ = "index_runs"

    index_run_id = Column(String, primary_key=True, default=lambda: generate_uuid("RUN-"))
    index_type = Column(String, default="Fisher") # Fisher, Laspeyres, Jevons, Dutot
    geography_level = Column(String, default="National") # National, Metro-Metro, Regional
    route_key = Column(String, default="ALL")
    period = Column(String, nullable=False) # e.g., 2026-09
    base_period = Column(String, default="2024-Q4")
    index_value = Column(Float, nullable=False)
    percent_change = Column(Float, default=0.0)
    methodology_version = Column(String, default="v2.4-Fisher-Chain")
    weight_version = Column(String, default="DGCA-2024-Q4")
    observation_count = Column(Integer, default=0)
    calculation_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="COMPLETED") # RUNNING, COMPLETED, FAILED

class IndexObservation(Base):
    __tablename__ = "index_observations"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("IO-"))
    index_run_id = Column(String, ForeignKey("index_runs.index_run_id"), nullable=False)
    route_key = Column(String, index=True, nullable=False)
    elementary_index = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    weighted_index = Column(Float, nullable=False)
    period = Column(String, nullable=False)

class RouteWeight(Base):
    __tablename__ = "route_weights"

    id = Column(String, primary_key=True, default=lambda: generate_uuid("RW-"))
    route_key = Column(String, unique=True, index=True, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    tier = Column(String, default="Metro-Metro") # Metro-Metro, Metro-NonMetro, UDAN-Regional
    passenger_volume = Column(Integer, nullable=False) # e.g., 3450000 pax/year
    weight_share = Column(Float, nullable=False) # e.g. 0.092
    effective_from = Column(String, default="2024-01-01")
    effective_to = Column(String, default="2026-12-31")
    source_reference = Column(String, default="DGCA City-Pair Traffic Report 2024 & NSSO Table 7")
    version = Column(String, default="DGCA-2024-Q4")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    event_id = Column(String, primary_key=True, default=lambda: generate_uuid("AUD-"))
    entity_type = Column(String, index=True, nullable=False) # IndexRun, Observation, Anomaly, Scraper
    entity_id = Column(String, index=True, nullable=False)
    event_type = Column(String, index=True, nullable=False) # INSERT, UPDATE, CALCULATION, REVIEW, SCRAPE
    event_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    actor = Column(String, default="system_worker")
    service_version = Column(String, default="v2.4.0")
    input_hash = Column(String, nullable=True)
    output_hash = Column(String, nullable=True)
    parent_event_id = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String, primary_key=True, default=lambda: generate_uuid("ALT-"))
    metric = Column(String, nullable=False) # Index Volatility, Anomaly Spike, Data Freshness
    threshold = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    severity = Column(String, default="Medium") # Informational, Low, Medium, High, Critical
    status = Column(String, default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class Source(Base):
    __tablename__ = "sources"

    source_id = Column(String, primary_key=True) # MakeMyTrip, EaseMyTrip, IndiGo Direct, Air India Direct
    name = Column(String, nullable=False)
    type = Column(String, default="OTA Aggregator") # OTA Aggregator, Airline Direct API
    status = Column(String, default="OPERATIONAL") # OPERATIONAL, DEGRADED, MAINTENANCE
    success_rate_24h = Column(Float, default=99.4)
    avg_latency_ms = Column(Integer, default=320)
    observations_24h = Column(Integer, default=45000)
    last_scraped = Column(DateTime, default=datetime.datetime.utcnow)
    error_rate = Column(Float, default=0.6)
    adapter_version = Column(String, default="v2.4.1")

class CollectionJob(Base):
    __tablename__ = "collection_jobs"

    job_id = Column(String, primary_key=True, default=lambda: generate_uuid("JOB-"))
    source_id = Column(String, nullable=False)
    status = Column(String, default="COMPLETED") # RUNNING, COMPLETED, FAILED
    items_collected = Column(Integer, default=0)
    items_valid = Column(Integer, default=0)
    items_anomalous = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

class ReportJob(Base):
    __tablename__ = "report_jobs"

    job_id = Column(String, primary_key=True, default=lambda: generate_uuid("REP-"))
    title = Column(String, nullable=False)
    report_type = Column(String, nullable=False) # Monthly CPI Airfare Bulletin, Route Volatility Dossier, High-Severity Anomaly Audit, Methodology Comparison Report
    format = Column(String, nullable=False) # PDF, XLSX, CSV
    period = Column(String, nullable=False)
    status = Column(String, default="READY") # READY, GENERATING, FAILED
    file_path = Column(String, nullable=True)
    file_size = Column(String, default="0 KB")
    checksum = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
