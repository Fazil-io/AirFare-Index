from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import RouteWeight, Source, FareObservation
from backend.app.schemas import ApiResponse, MetaInfo, RouteWeightResponse, SourceResponse

router = APIRouter(prefix="", tags=["Routes, Airlines & Sources"])

ROUTE_CATALOG = {
    "DEL-BOM": {
        "originCity": "Delhi", "originIata": "DEL", "destCity": "Mumbai", "destIata": "BOM",
        "currentFare": 6480, "previousFare": 6150, "pctChange7d": 5.37, "routeIndex": 122.4, "volatilityScore": 68,
        "dominantAirline": "IndiGo",
        "airlines": [
            {"airline": "IndiGo", "avgFare": 6250, "marketShare": 0.54, "flightCount": 42},
            {"airline": "Air India", "avgFare": 6850, "marketShare": 0.28, "flightCount": 22},
            {"airline": "Akasa Air", "avgFare": 5900, "marketShare": 0.12, "flightCount": 9},
            {"airline": "SpiceJet", "avgFare": 6100, "marketShare": 0.06, "flightCount": 5}
        ],
        "leadTimeFares": {"T-0": 11400, "T-7": 7200, "T-15": 5800, "T-30+": 4600}
    },
    "BLR-DEL": {
        "originCity": "Bengaluru", "originIata": "BLR", "destCity": "Delhi", "destIata": "DEL",
        "currentFare": 7250, "previousFare": 6920, "pctChange7d": 4.77, "routeIndex": 120.8, "volatilityScore": 61,
        "dominantAirline": "IndiGo",
        "airlines": [
            {"airline": "IndiGo", "avgFare": 7100, "marketShare": 0.56, "flightCount": 36},
            {"airline": "Air India", "avgFare": 7600, "marketShare": 0.30, "flightCount": 19},
            {"airline": "Akasa Air", "avgFare": 6750, "marketShare": 0.14, "flightCount": 8}
        ],
        "leadTimeFares": {"T-0": 12800, "T-7": 7900, "T-15": 6400, "T-30+": 5100}
    },
    "BOM-BLR": {
        "originCity": "Mumbai", "originIata": "BOM", "destCity": "Bengaluru", "destIata": "BLR",
        "currentFare": 4650, "previousFare": 4540, "pctChange7d": 2.42, "routeIndex": 118.6, "volatilityScore": 52,
        "dominantAirline": "IndiGo",
        "airlines": [
            {"airline": "IndiGo", "avgFare": 4500, "marketShare": 0.58, "flightCount": 28},
            {"airline": "Air India", "avgFare": 4900, "marketShare": 0.28, "flightCount": 14},
            {"airline": "Akasa Air", "avgFare": 4350, "marketShare": 0.14, "flightCount": 7}
        ],
        "leadTimeFares": {"T-0": 8200, "T-7": 5200, "T-15": 4100, "T-30+": 3400}
    }
}

@router.get("/routes", response_model=ApiResponse[list])
def list_routes(db: Session = Depends(get_db)):
    weights = db.query(RouteWeight).all()
    data = []
    for w in weights:
        detail = ROUTE_CATALOG.get(w.route_key, {
            "originCity": w.origin, "destCity": w.destination,
            "currentFare": 5800, "previousFare": 5600, "pctChange7d": 3.5, "routeIndex": 118.0, "volatilityScore": 50,
            "dominantAirline": "IndiGo", "airlines": [], "leadTimeFares": {"T-0": 9800, "T-7": 6200, "T-15": 5100, "T-30+": 4200}
        })
        data.append({
            "code": w.route_key,
            "originCity": detail.get("originCity", w.origin),
            "originIata": w.origin,
            "destCity": detail.get("destCity", w.destination),
            "destIata": w.destination,
            "tier": w.tier,
            "passengerWeight": w.weight_share,
            "currentFare": detail.get("currentFare", 5800),
            "previousFare": detail.get("previousFare", 5600),
            "pctChange7d": detail.get("pctChange7d", 3.5),
            "routeIndex": detail.get("routeIndex", 118.0),
            "volatilityScore": detail.get("volatilityScore", 50),
            "dominantAirline": detail.get("dominantAirline", "IndiGo"),
            "airlines": detail.get("airlines", []),
            "leadTimeFares": detail.get("leadTimeFares", {})
        })
    return ApiResponse(data=data, meta=MetaInfo(page=1, page_size=len(data), total=len(data)))

@router.get("/routes/{route_key}")
def get_route_summary(route_key: str, db: Session = Depends(get_db)):
    rk = route_key.strip().upper()
    w = db.query(RouteWeight).filter(RouteWeight.route_key == rk).first()
    if not w:
        raise HTTPException(status_code=404, detail=f"Route {rk} not found")
    
    cat = ROUTE_CATALOG.get(rk, {})
    return ApiResponse(data={
        "route_key": w.route_key,
        "origin": w.origin,
        "destination": w.destination,
        "tier": w.tier,
        "passenger_volume": w.passenger_volume,
        "weight_share": w.weight_share,
        "current_fare": cat.get("currentFare", 6200),
        "route_index": cat.get("routeIndex", 120.0),
        "volatility_score": cat.get("volatilityScore", 60),
        "dominant_airline": cat.get("dominantAirline", "IndiGo")
    })

@router.get("/routes/{route_key}/trend")
def get_route_trend(route_key: str):
    rk = route_key.strip().upper()
    trend = [
        {"date": "15 Aug", "fare": 5980, "index": 115.1},
        {"date": "22 Aug", "fare": 6050, "index": 116.4},
        {"date": "29 Aug", "fare": 6210, "index": 118.2},
        {"date": "05 Sep", "fare": 6340, "index": 120.5},
        {"date": "14 Sep", "fare": 6480, "index": 122.4}
    ]
    return ApiResponse(data={"route_key": rk, "trend": trend})

@router.get("/routes/{route_key}/airlines")
def get_route_airlines(route_key: str):
    rk = route_key.strip().upper()
    cat = ROUTE_CATALOG.get(rk, ROUTE_CATALOG["DEL-BOM"])
    return ApiResponse(data=cat.get("airlines", []))

@router.get("/routes/{route_key}/lead-time")
def get_route_lead_time(route_key: str):
    rk = route_key.strip().upper()
    cat = ROUTE_CATALOG.get(rk, ROUTE_CATALOG["DEL-BOM"])
    return ApiResponse(data=cat.get("leadTimeFares", {}))

@router.get("/airlines")
def list_airlines():
    airlines = [
        {"code": "6E", "name": "IndiGo", "marketShare": 0.62, "fleetSize": 350, "type": "Low Cost Carrier (LCC)"},
        {"code": "AI", "name": "Air India", "marketShare": 0.26, "fleetSize": 210, "type": "Full Service Carrier (FSC)"},
        {"code": "QP", "name": "Akasa Air", "marketShare": 0.08, "fleetSize": 25, "type": "Ultra Low Cost Carrier (ULCC)"},
        {"code": "SG", "name": "SpiceJet", "marketShare": 0.04, "fleetSize": 30, "type": "Low Cost Carrier (LCC)"}
    ]
    return ApiResponse(data=airlines)

@router.get("/sources", response_model=ApiResponse[List[SourceResponse]])
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(Source).all()
    return ApiResponse(data=[SourceResponse.from_orm(s) for s in sources])

@router.get("/sources/health")
def get_sources_health(db: Session = Depends(get_db)):
    sources = db.query(Source).all()
    overall = {
        "overall_status": "OPERATIONAL",
        "healthy_sources": sum(1 for s in sources if s.status == "OPERATIONAL"),
        "total_sources": len(sources),
        "total_observations_24h": sum(s.observations_24h for s in sources),
        "avg_system_latency_ms": round(sum(s.avg_latency_ms for s in sources) / max(1, len(sources))),
        "sources": [SourceResponse.from_orm(s) for s in sources]
    }
    return ApiResponse(data=overall)
