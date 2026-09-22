import io
import csv
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from backend.app.database import get_db
from backend.app.models import FareObservation
from backend.app.schemas import (
    ApiResponse, MetaInfo, FareObservationResponse, FareObservationCreate
)
from backend.app.services.normalization import normalize_route, calculate_lead_time, breakdown_fare
from backend.app.services.anomaly_detector import evaluate_fare_anomaly
from backend.app.services.audit_service import record_audit_event

router = APIRouter(prefix="/fares", tags=["Fare Observations"])

@router.get("", response_model=ApiResponse[List[FareObservationResponse]])
def search_fares(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    sort: str = Query("-collection_timestamp"),
    route: Optional[str] = None,
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    airline: Optional[str] = None,
    lead_time: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FareObservation)

    if route:
        query = query.filter(FareObservation.route_key == route.strip().upper())
    if origin:
        query = query.filter(FareObservation.origin == origin.strip().upper())
    if destination:
        query = query.filter(FareObservation.destination == destination.strip().upper())
    if airline:
        query = query.filter(FareObservation.airline_code == airline.strip().upper())
    if lead_time:
        query = query.filter(FareObservation.lead_time_bucket == lead_time.strip())
    if status:
        query = query.filter(FareObservation.anomaly_status == status.strip())

    total = query.count()

    # Sort
    if sort.startswith("-"):
        col_name = sort[1:]
        if hasattr(FareObservation, col_name):
            query = query.order_by(desc(getattr(FareObservation, col_name)))
    else:
        if hasattr(FareObservation, sort):
            query = query.order_by(asc(getattr(FareObservation, sort)))

    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return ApiResponse(
        data=[FareObservationResponse.from_orm(i) for i in items],
        meta=MetaInfo(page=page, page_size=page_size, total=total)
    )

@router.get("/export")
def export_fares(
    route: Optional[str] = None,
    airline: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FareObservation)
    if route:
        query = query.filter(FareObservation.route_key == route)
    if airline:
        query = query.filter(FareObservation.airline_code == airline)

    items = query.order_by(desc(FareObservation.collection_timestamp)).limit(500).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Route", "Carrier", "Flight No", "Travel Date", "Lead Bucket", "Base Fare", "Taxes", "Total Fare", "Source", "Quality Status"])
    for r in items:
        writer.writerow([r.id, r.route_key, r.airline_code, r.flight_number, r.travel_date, r.lead_time_bucket, r.base_fare, r.taxes, r.total_fare, r.source_id, r.anomaly_status])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=fare_observations_export.csv"}
    )

@router.get("/{fare_id}", response_model=ApiResponse[FareObservationResponse])
def get_fare(fare_id: str, db: Session = Depends(get_db)):
    obs = db.query(FareObservation).filter(FareObservation.id == fare_id).first()
    if not obs:
        raise HTTPException(status_code=404, detail=f"Fare observation {fare_id} not found")
    return ApiResponse(data=FareObservationResponse.from_orm(obs))

@router.get("/{fare_id}/raw")
def get_fare_raw(fare_id: str, db: Session = Depends(get_db)):
    obs = db.query(FareObservation).filter(FareObservation.id == fare_id).first()
    if not obs:
        raise HTTPException(status_code=404, detail=f"Fare observation {fare_id} not found")
    return ApiResponse(data={
        "observation_id": obs.id,
        "raw_payload": obs.raw_payload_ref,
        "parser_version": obs.parser_version,
        "source_id": obs.source_id,
        "ingested_at": obs.collection_timestamp.isoformat()
    })

@router.post("", response_model=ApiResponse[FareObservationResponse])
def create_fare(payload: FareObservationCreate, db: Session = Depends(get_db)):
    orig, dest, route_key = normalize_route(payload.origin, payload.destination)
    lead_days, lead_bucket = calculate_lead_time(payload.travel_date)
    base_fare, taxes, fees = breakdown_fare(payload.total_fare)
    
    is_anomaly, severity, score, exp_min, exp_max, signals = evaluate_fare_anomaly(
        route_key=route_key,
        total_fare=payload.total_fare,
        lead_time_bucket=lead_bucket,
        airline_code=payload.airline_code
    )

    obs = FareObservation(
        source_id=payload.source_id,
        airline_code=payload.airline_code,
        origin=orig,
        destination=dest,
        route_key=route_key,
        travel_date=payload.travel_date,
        lead_time_days=lead_days,
        lead_time_bucket=lead_bucket,
        currency="INR",
        base_fare=base_fare,
        taxes=taxes,
        fees=fees,
        total_fare=payload.total_fare,
        seat_availability=payload.seat_availability or 9,
        cabin=payload.cabin,
        fare_family=payload.fare_family,
        flight_number=payload.flight_number or "",
        quality_score=0.98,
        anomaly_status="ANOMALY_PENDING" if is_anomaly else "NORMAL"
    )
    db.add(obs)
    db.commit()
    db.refresh(obs)

    record_audit_event(
        db=db,
        entity_type="Observation",
        entity_id=obs.id,
        event_type="INSERT",
        actor="api_client",
        input_data=payload.dict(),
        output_data={"id": obs.id, "total_fare": obs.total_fare}
    )

    return ApiResponse(data=FareObservationResponse.from_orm(obs))

@router.post("/bulk", response_model=ApiResponse[dict])
def bulk_ingest_fares(payload: List[FareObservationCreate], db: Session = Depends(get_db)):
    created_count = 0
    for p in payload:
        orig, dest, route_key = normalize_route(p.origin, p.destination)
        lead_days, lead_bucket = calculate_lead_time(p.travel_date)
        base_fare, taxes, fees = breakdown_fare(p.total_fare)
        
        obs = FareObservation(
            source_id=p.source_id,
            airline_code=p.airline_code,
            origin=orig,
            destination=dest,
            route_key=route_key,
            travel_date=p.travel_date,
            lead_time_days=lead_days,
            lead_time_bucket=lead_bucket,
            currency="INR",
            base_fare=base_fare,
            taxes=taxes,
            fees=fees,
            total_fare=p.total_fare,
            flight_number=p.flight_number or ""
        )
        db.add(obs)
        created_count += 1
        
    db.commit()
    return ApiResponse(data={"status": "success", "ingested_records": created_count})
