import datetime
from typing import Tuple

AIRPORT_DIRECTORY = {
    "DEL": {"city": "Delhi", "state": "Delhi", "region": "North"},
    "BOM": {"city": "Mumbai", "state": "Maharashtra", "region": "West"},
    "BLR": {"city": "Bengaluru", "state": "Karnataka", "region": "South"},
    "HYD": {"city": "Hyderabad", "state": "Telangana", "region": "South"},
    "CCU": {"city": "Kolkata", "state": "West Bengal", "region": "East"},
    "MAA": {"city": "Chennai", "state": "Tamil Nadu", "region": "South"},
    "AMD": {"city": "Ahmedabad", "state": "Gujarat", "region": "West"},
    "GOI": {"city": "Goa", "state": "Goa", "region": "West"},
    "PNQ": {"city": "Pune", "state": "Maharashtra", "region": "West"},
    "JAI": {"city": "Jaipur", "state": "Rajasthan", "region": "North"},
    "LKO": {"city": "Lucknow", "state": "Uttar Pradesh", "region": "North"},
    "GAU": {"city": "Guwahati", "state": "Assam", "region": "North-East"},
    "IXB": {"city": "Bagdogra", "state": "West Bengal", "region": "East"},
    "IXC": {"city": "Chandigarh", "state": "Punjab/Haryana", "region": "North"},
    "SXR": {"city": "Srinagar", "state": "Jammu & Kashmir", "region": "North"},
    "PAT": {"city": "Patna", "state": "Bihar", "region": "East"},
    "BBI": {"city": "Bhubaneswar", "state": "Odisha", "region": "East"},
    "COK": {"city": "Kochi", "state": "Kerala", "region": "South"},
    "TRV": {"city": "Thiruvananthapuram", "state": "Kerala", "region": "South"},
    "VNS": {"city": "Varanasi", "state": "Uttar Pradesh", "region": "North"}
}

def normalize_route(origin: str, destination: str) -> Tuple[str, str, str]:
    """Standardizes airport codes and formats route_key as ORIGIN-DESTINATION."""
    orig = origin.strip().upper()
    dest = destination.strip().upper()
    route_key = f"{orig}-{dest}"
    return orig, dest, route_key

def calculate_lead_time(travel_date_str: str, collection_date: datetime.date = None) -> Tuple[int, str]:
    """
    Computes lead_time_days = travel_date - collection_date
    Classifies into canonical MoSPI lead-time buckets:
    - T-0: same day / 0 to 1 days
    - T-7: 2 to 9 days
    - T-15: 10 to 21 days
    - T-30+: 22 or more days
    """
    if collection_date is None:
        collection_date = datetime.date.today()
    
    try:
        travel_date = datetime.datetime.strptime(travel_date_str, "%Y-%m-%d").date()
    except Exception:
        # Fallback if invalid format
        travel_date = collection_date + datetime.timedelta(days=7)
    
    delta = (travel_date - collection_date).days
    lead_time_days = max(0, delta)
    
    if lead_time_days <= 1:
        bucket = "T-0"
    elif lead_time_days <= 9:
        bucket = "T-7"
    elif lead_time_days <= 21:
        bucket = "T-15"
    else:
        bucket = "T-30+"
        
    return lead_time_days, bucket

def breakdown_fare(total_fare: float) -> Tuple[float, float, float]:
    """
    Separates base fare, statutory taxes (GST, UDF, PSF), and airline fuel/convenience fees.
    Standard Indian Domestic breakdown:
    - Base fare: ~82%
    - Statutory taxes: ~12%
    - Fuel / PSF: ~6%
    """
    base_fare = round(total_fare * 0.82, 2)
    taxes = round(total_fare * 0.12, 2)
    fees = round(total_fare - base_fare - taxes, 2)
    return base_fare, taxes, fees

def utc_to_ist(utc_dt: datetime.datetime) -> str:
    """Converts UTC datetime to formatted IST string (UTC+05:30) for display."""
    if not utc_dt:
        return ""
    ist_dt = utc_dt + datetime.timedelta(hours=5, minutes=30)
    return ist_dt.strftime("%d %b %Y, %I:%M %p IST")
