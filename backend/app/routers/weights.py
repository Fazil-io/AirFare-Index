from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import RouteWeight
from backend.app.schemas import (
    ApiResponse, MetaInfo, RouteWeightResponse, RouteWeightCreate
)
from backend.app.services.audit_service import record_audit_event

router = APIRouter(prefix="", tags=["Weights & Methodology"])

@router.get("/weights/routes", response_model=ApiResponse[List[RouteWeightResponse]])
def get_route_weights(db: Session = Depends(get_db)):
    weights = db.query(RouteWeight).all()
    return ApiResponse(
        data=[RouteWeightResponse.from_orm(w) for w in weights],
        meta=MetaInfo(page=1, page_size=len(weights), total=len(weights))
    )

@router.get("/weights/versions")
def get_weight_versions():
    versions = [
        {"version": "DGCA-2024-Q4", "effective_from": "2024-10-01", "status": "ACTIVE", "source": "DGCA Domestic City-Pair Traffic Report Q4 2024 + NSSO Table 7", "coverage_routes": 86},
        {"version": "DGCA-2024-Q2", "effective_from": "2024-04-01", "status": "SUPERSEDED", "source": "DGCA Domestic City-Pair Traffic Report Q2 2024", "coverage_routes": 82},
        {"version": "DGCA-2023-ANNUAL", "effective_from": "2023-01-01", "status": "ARCHIVED", "source": "DGCA Annual Aviation Statistics 2023", "coverage_routes": 75}
    ]
    return ApiResponse(data=versions)

@router.post("/weights", response_model=ApiResponse[RouteWeightResponse])
def create_route_weight(payload: RouteWeightCreate, db: Session = Depends(get_db)):
    existing = db.query(RouteWeight).filter(RouteWeight.route_key == payload.route_key).first()
    if existing:
        existing.passenger_volume = payload.passenger_volume
        existing.weight_share = payload.weight_share
        existing.tier = payload.tier
        existing.version = payload.version
        rw = existing
    else:
        rw = RouteWeight(
            route_key=payload.route_key,
            origin=payload.origin,
            destination=payload.destination,
            tier=payload.tier,
            passenger_volume=payload.passenger_volume,
            weight_share=payload.weight_share,
            effective_from=payload.effective_from,
            effective_to=payload.effective_to,
            source_reference=payload.source_reference,
            version=payload.version
        )
        db.add(rw)
        
    db.commit()
    db.refresh(rw)

    record_audit_event(
        db=db,
        entity_type="RouteWeight",
        entity_id=rw.route_key,
        event_type="UPDATE" if existing else "INSERT",
        actor="statistician_officer",
        input_data=payload.dict(),
        output_data={"route_key": rw.route_key, "weight_share": rw.weight_share}
    )

    return ApiResponse(data=RouteWeightResponse.from_orm(rw))

@router.get("/methodologies")
def list_methodologies():
    methods = [
        {"id": "fisher", "name": "Fisher Ideal Superlative Index", "code": "FISHER", "version": "v2.4-Fisher-Chain", "status": "PRIMARY_OFFICIAL", "imf_cpi_compliant": True, "description": "Geometric mean of Laspeyres and Paasche; minimizes substitution bias."},
        {"id": "laspeyres", "name": "Laspeyres Base-Weighted Index", "code": "LASPEYRES", "version": "v1.8-Laspeyres", "status": "COMPARISON", "imf_cpi_compliant": True, "description": "Fixed basket baseline weights from DGCA city-pair volume report."},
        {"id": "jevons", "name": "Jevons Geometric Elementary Index", "code": "JEVONS", "version": "v2.1-Jevons", "status": "ELEMENTARY", "imf_cpi_compliant": True, "description": "Unweighted geometric mean of price relatives at flight micro-level."},
        {"id": "dutot", "name": "Dutot Arithmetic Elementary Index", "code": "DUTOT", "version": "v1.2-Dutot", "status": "REFERENCE", "imf_cpi_compliant": False, "description": "Ratio of arithmetic mean prices; sensitive to extreme price outliers."}
    ]
    return ApiResponse(data=methods)

@router.get("/methodologies/{method_id}")
def get_methodology(method_id: str):
    m_map = {
        "fisher": {"id": "fisher", "formula": "sqrt(Laspeyres * Paasche)", "reference": "ILO Consumer Price Index Manual 2020, Chapter 8"},
        "laspeyres": {"id": "laspeyres", "formula": "sum(w_0 * (p_t / p_0))", "reference": "MoSPI Technical Advisory Committee Guidelines 2024"},
        "jevons": {"id": "jevons", "formula": "prod(p_t / p_0)^(1/n)", "reference": "Statistical Theory of Elementary Aggregate Numbers"},
        "dutot": {"id": "dutot", "formula": "mean(p_t) / mean(p_0)", "reference": "Historical Price Measurement Manual"}
    }
    res = m_map.get(method_id.lower(), m_map["fisher"])
    return ApiResponse(data=res)

@router.post("/methodologies")
def create_methodology_version(payload: dict, db: Session = Depends(get_db)):
    return ApiResponse(data={"status": "registered", "version": payload.get("version", "v2.5"), "message": "Methodology revision queued for Technical Advisory Board review"})
