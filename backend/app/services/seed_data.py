import datetime
import hashlib
from sqlalchemy.orm import Session

from backend.app.models import (
    User, Source, RouteWeight, IndexRun, FareObservation,
    Anomaly, Alert, AuditEvent, ReportJob
)
from backend.app.services.audit_service import record_audit_event

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def seed_database(db: Session):
    """Populates database with initial institutional users, sources, route weights, and baseline data."""
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding institutional database with MoSPI baseline and DGCA route weights...")

    # 1. Users
    users_data = [
        {"email": "admin@mospi.gov.in", "name": "MoSPI System Administrator", "role": "Admin", "pwd": "AdminPassword@2026"},
        {"email": "statistician@mospi.gov.in", "name": "Chief Economic Statistician", "role": "Statistician", "pwd": "StatsPassword@2026"},
        {"email": "analyst@mospi.gov.in", "name": "Airfare Market Analyst", "role": "Analyst", "pwd": "AnalystPassword@2026"},
        {"email": "viewer@mospi.gov.in", "name": "Public Data Observer", "role": "Viewer", "pwd": "ViewerPassword@2026"}
    ]
    for u in users_data:
        user = User(
            email=u["email"],
            full_name=u["name"],
            role=u["role"],
            hashed_password=hash_password(u["pwd"]),
            is_active=True
        )
        db.add(user)

    # 2. Sources Registry
    sources_data = [
        {"id": "MakeMyTrip", "name": "MakeMyTrip OTA Ingestion Adapter", "type": "OTA Aggregator", "success": 99.4, "latency": 340, "obs": 68400},
        {"id": "EaseMyTrip", "name": "EaseMyTrip Scraping Pipeline", "type": "OTA Aggregator", "success": 98.7, "latency": 290, "obs": 41200},
        {"id": "IndiGo Direct", "name": "IndiGo Direct NDC/Direct Channel", "type": "Airline Direct API", "success": 99.8, "latency": 180, "obs": 52100},
        {"id": "Air India Direct", "name": "Air India Direct PSS Channel", "type": "Airline Direct API", "success": 99.2, "latency": 220, "obs": 28900}
    ]
    for s in sources_data:
        src = Source(
            source_id=s["id"],
            name=s["name"],
            type=s["type"],
            status="OPERATIONAL",
            success_rate_24h=s["success"],
            avg_latency_ms=s["latency"],
            observations_24h=s["obs"],
            last_scraped=datetime.datetime.utcnow(),
            error_rate=round(100 - s["success"], 2),
            adapter_version="v2.4.1"
        )
        db.add(src)

    # 3. Route Weights (DGCA 2024 & NSSO Table 7 Passenger Shares)
    weights_data = [
        {"route": "DEL-BOM", "orig": "DEL", "dest": "BOM", "tier": "Metro-Metro", "pax": 3850000, "weight": 0.092},
        {"route": "BLR-DEL", "orig": "BLR", "dest": "DEL", "tier": "Metro-Metro", "pax": 3260000, "weight": 0.078},
        {"route": "BOM-BLR", "orig": "BOM", "dest": "BLR", "tier": "Metro-Metro", "pax": 2840000, "weight": 0.068},
        {"route": "DEL-CCU", "orig": "DEL", "dest": "CCU", "tier": "Metro-Metro", "pax": 2350000, "weight": 0.056},
        {"route": "BOM-GOI", "orig": "BOM", "dest": "GOI", "tier": "Metro-NonMetro", "pax": 1920000, "weight": 0.046},
        {"route": "DEL-HYD", "orig": "DEL", "dest": "HYD", "tier": "Metro-Metro", "pax": 2680000, "weight": 0.064},
        {"route": "MAA-DEL", "orig": "MAA", "dest": "DEL", "tier": "Metro-Metro", "pax": 2210000, "weight": 0.053},
        {"route": "DEL-SXR", "orig": "DEL", "dest": "SXR", "tier": "Metro-NonMetro", "pax": 1380000, "weight": 0.033},
        {"route": "CCU-GAU", "orig": "CCU", "dest": "GAU", "tier": "UDAN-Regional", "pax": 980000, "weight": 0.024}
    ]
    for w in weights_data:
        rw = RouteWeight(
            route_key=w["route"],
            origin=w["orig"],
            destination=w["dest"],
            tier=w["tier"],
            passenger_volume=w["pax"],
            weight_share=w["weight"],
            effective_from="2024-01-01",
            effective_to="2026-12-31",
            source_reference="DGCA City-Pair Traffic Report 2024 & NSSO Table 7",
            version="DGCA-2024-Q4"
        )
        db.add(rw)

    # 4. Historical Index Runs
    historical_runs = [
        {"period": "2025-10", "index": 106.4, "change": 1.8},
        {"period": "2025-11", "index": 111.8, "change": 5.1},
        {"period": "2025-12", "index": 114.2, "change": 2.1},
        {"period": "2026-01", "index": 108.6, "change": -4.9},
        {"period": "2026-02", "index": 107.9, "change": -0.6},
        {"period": "2026-03", "index": 110.4, "change": 2.3},
        {"period": "2026-04", "index": 112.8, "change": 2.2},
        {"period": "2026-05", "index": 117.5, "change": 4.2},
        {"period": "2026-06", "index": 115.9, "change": -1.4},
        {"period": "2026-07", "index": 113.1, "change": -2.4},
        {"period": "2026-08", "index": 114.7, "change": 1.4},
        {"period": "2026-09", "index": 118.42, "change": 3.24}
    ]
    for r in historical_runs:
        run = IndexRun(
            index_run_id=f"RUN-{r['period'].replace('-', '')}",
            index_type="Fisher",
            geography_level="National",
            route_key="ALL",
            period=r["period"],
            base_period="2024-Q4",
            index_value=r["index"],
            percent_change=r["change"],
            methodology_version="v2.4-Fisher-Chain",
            weight_version="DGCA-2024-Q4",
            observation_count=184520,
            status="COMPLETED"
        )
        db.add(run)

    # 5. Baseline Fare Observations
    obs_samples = [
        {"route": "DEL-BOM", "airline": "6E", "fl": "6E-2041", "fare": 6250, "lead": 7, "bucket": "T-7", "src": "MakeMyTrip"},
        {"route": "DEL-BOM", "airline": "AI", "fl": "AI-805", "fare": 6850, "lead": 7, "bucket": "T-7", "src": "Air India Direct"},
        {"route": "DEL-BOM", "airline": "6E", "fl": "6E-5012", "fare": 11400, "lead": 0, "bucket": "T-0", "src": "EaseMyTrip"},
        {"route": "BLR-DEL", "airline": "6E", "fl": "6E-618", "fare": 7100, "lead": 15, "bucket": "T-15", "src": "IndiGo Direct"},
        {"route": "BOM-GOI", "airline": "QP", "fl": "QP-1302", "fare": 3950, "lead": 30, "bucket": "T-30+", "src": "MakeMyTrip"},
        {"route": "DEL-SXR", "airline": "AI", "fl": "AI-825", "fare": 8400, "lead": 7, "bucket": "T-7", "src": "MakeMyTrip"},
        {"route": "DEL-BOM", "airline": "6E", "fl": "6E-902", "fare": 18500, "lead": 1, "bucket": "T-0", "src": "MakeMyTrip", "anomaly": True}
    ]
    for obs in obs_samples:
        orig, dest = obs["route"].split("-")
        is_anom = obs.get("anomaly", False)
        obs_id = f"OBS-INIT-{obs['fl'].replace('-', '')}"
        
        fo = FareObservation(
            id=obs_id,
            source_id=obs["src"],
            airline_code=obs["airline"],
            origin=orig,
            destination=dest,
            route_key=obs["route"],
            travel_date="2026-09-22",
            lead_time_days=obs["lead"],
            lead_time_bucket=obs["bucket"],
            currency="INR",
            base_fare=round(obs["fare"] * 0.82, 2),
            taxes=round(obs["fare"] * 0.12, 2),
            fees=round(obs["fare"] * 0.06, 2),
            total_fare=obs["fare"],
            seat_availability=4 if is_anom else 9,
            cabin="Economy",
            fare_family="Standard",
            flight_number=obs["fl"],
            raw_payload_ref="{\"status\": 200, \"verified\": true}",
            quality_score=0.95,
            anomaly_status="ANOMALY_PENDING" if is_anom else "NORMAL",
            parser_version="v2.4.1"
        )
        db.add(fo)

        if is_anom:
            an = Anomaly(
                anomaly_id="AN-1042",
                observation_id=obs_id,
                detector="Z-Score + IQR Consensus",
                score=3.84,
                expected_min=4800,
                expected_max=12500,
                reason_signals={"z_score": 3.84, "rule": "Extreme peak pricing (+3.84σ)", "median": 6200},
                severity="HIGH",
                status="PENDING_REVIEW"
            )
            db.add(an)

    # 6. Baseline Active Alerts
    alerts_data = [
        {"metric": "Metro-Metro Volatility Spike", "threshold": ">15% 48h shift", "ev": "DEL-BOM surge observed during festival booking window", "sev": "High"},
        {"metric": "Consecutive Outlier Detections", "threshold": ">5 observations in T-0", "ev": "DEL-SXR weather diversion pressure", "sev": "Medium"},
        {"metric": "Source Pipeline Health", "threshold": "Error rate <2%", "ev": "EaseMyTrip latency normalized to 290ms", "sev": "Informational"}
    ]
    for al in alerts_data:
        alert = Alert(
            metric=al["metric"],
            threshold=al["threshold"],
            evidence=al["ev"],
            severity=al["sev"],
            status="ACTIVE"
        )
        db.add(alert)

    # 7. Initial Reports
    reports_data = [
        {"title": "Monthly CPI Airfare Intelligence Bulletin - Sep 2026", "type": "Monthly CPI Airfare Bulletin", "fmt": "PDF", "period": "2026-09", "size": "412 KB"},
        {"title": "Route Volatility & Market Concentration Dossier", "type": "Route Volatility Dossier", "fmt": "XLSX", "period": "2026-09", "size": "184 KB"},
        {"title": "High-Severity Anomaly & Outlier Review Audit", "type": "High-Severity Anomaly Audit", "fmt": "CSV", "period": "2026-09", "size": "65 KB"}
    ]
    for rep in reports_data:
        r_job = ReportJob(
            title=rep["title"],
            report_type=rep["type"],
            format=rep["fmt"],
            period=rep["period"],
            status="READY",
            file_size=rep["size"],
            checksum="sha256:8f4c91a34b22"
        )
        db.add(r_job)

    # 8. Audit Event
    record_audit_event(
        db=db,
        entity_type="System",
        entity_id="SYS-INIT",
        event_type="BOOTSTRAP",
        actor="system_seeder",
        input_data={"version": "2.4.0", "standard": "MoSPI SIH26056"},
        output_data={"users": len(users_data), "weights": len(weights_data)},
        metadata={"timestamp": datetime.datetime.utcnow().isoformat()}
    )

    db.commit()
    print("Database successfully seeded.")
