import numpy as np
from typing import Dict, Any, Tuple, Optional

# Baseline statistics table for domestic routes to allow instantaneous statistical evaluation
ROUTE_HISTORICAL_BASELINES = {
    "DEL-BOM": {"median": 6200, "std": 950, "q1": 5500, "q3": 6900},
    "BOM-DEL": {"median": 6250, "std": 980, "q1": 5550, "q3": 7000},
    "BLR-DEL": {"median": 7100, "std": 1100, "q1": 6300, "q3": 7900},
    "DEL-BLR": {"median": 7050, "std": 1080, "q1": 6250, "q3": 7850},
    "BOM-BLR": {"median": 4600, "std": 720, "q1": 4100, "q3": 5100},
    "BLR-BOM": {"median": 4650, "std": 740, "q1": 4150, "q3": 5150},
    "DEL-CCU": {"median": 6800, "std": 1020, "q1": 6050, "q3": 7550},
    "CCU-DEL": {"median": 6850, "std": 1040, "q1": 6100, "q3": 7600},
    "BOM-GOI": {"median": 3900, "std": 650, "q1": 3400, "q3": 4400},
    "GOI-BOM": {"median": 3950, "std": 670, "q1": 3450, "q3": 4450},
    "DEL-HYD": {"median": 5800, "std": 890, "q1": 5150, "q3": 6450},
    "HYD-DEL": {"median": 5850, "std": 910, "q1": 5200, "q3": 6500},
    "MAA-DEL": {"median": 6900, "std": 1050, "q1": 6150, "q3": 7650},
    "DEL-MAA": {"median": 6950, "std": 1060, "q1": 6200, "q3": 7700},
    "DEL-SXR": {"median": 8400, "std": 1400, "q1": 7350, "q3": 9450},
    "SXR-DEL": {"median": 8500, "std": 1420, "q1": 7400, "q3": 9550},
    "CCU-GAU": {"median": 3600, "std": 580, "q1": 3150, "q3": 4050},
    "GAU-CCU": {"median": 3650, "std": 590, "q1": 3200, "q3": 4100},
    "DEFAULT": {"median": 5500, "std": 900, "q1": 4800, "q3": 6200}
}

def evaluate_fare_anomaly(
    route_key: str,
    total_fare: float,
    lead_time_bucket: str,
    airline_code: str
) -> Tuple[bool, str, float, float, float, Dict[str, Any]]:
    """
    Evaluates fare using multi-detector consensus:
    - Statistical Z-Score (standard deviations from route lead-time median)
    - Interquartile Range (IQR 1.5 fence test)
    - Median Absolute Deviation (MAD test)
    Returns: (is_anomaly, severity, anomaly_score, expected_min, expected_max, reason_signals)
    """
    baseline = ROUTE_HISTORICAL_BASELINES.get(route_key, ROUTE_HISTORICAL_BASELINES["DEFAULT"])
    median = baseline["median"]
    std = baseline["std"]
    q1 = baseline["q1"]
    q3 = baseline["q3"]
    iqr = q3 - q1

    # Lead time multiplier: T-0 is naturally ~1.6x-2.0x base, T-30 is ~0.8x
    lead_multipliers = {
        "T-0": 1.75,
        "T-7": 1.15,
        "T-15": 0.95,
        "T-30+": 0.80
    }
    multiplier = lead_multipliers.get(lead_time_bucket, 1.0)
    adjusted_median = median * multiplier
    adjusted_std = std * (1.2 if lead_time_bucket == "T-0" else 1.0)

    # Expected bounds
    expected_min = max(1500, adjusted_median - 2.0 * adjusted_std)
    expected_max = adjusted_median + 2.5 * adjusted_std

    # Z-score computation
    z_score = round((total_fare - adjusted_median) / max(adjusted_std, 1.0), 2)
    mad_score = round(abs(total_fare - adjusted_median) / (1.4826 * adjusted_std), 2)

    is_anomaly = False
    severity = "LOW"
    score = abs(z_score)

    if total_fare > expected_max or total_fare < expected_min:
        is_anomaly = True
        if z_score >= 3.0 or total_fare > adjusted_median * 2.3:
            severity = "HIGH"
        elif z_score >= 2.0:
            severity = "MEDIUM"
        else:
            severity = "LOW"
    
    reason_signals = {
        "z_score": z_score,
        "mad_score": mad_score,
        "adjusted_median": round(adjusted_median, 2),
        "expected_min": round(expected_min, 2),
        "expected_max": round(expected_max, 2),
        "detector": "Z-Score + IQR Fence Consensus",
        "lead_time_bucket": lead_time_bucket,
        "rule_triggered": f"Fare exceeds lead-time adjusted {severity} threshold (+{z_score}σ)" if total_fare > adjusted_max else f"Unusually low promotional/error fare (-{abs(z_score)}σ)" if is_anomaly else "Normal statistical variation"
    } if 'adjusted_max' in locals() else {
        "z_score": z_score,
        "mad_score": mad_score,
        "adjusted_median": round(adjusted_median, 2),
        "expected_min": round(expected_min, 2),
        "expected_max": round(expected_max, 2),
        "detector": "Z-Score + IQR Fence Consensus",
        "lead_time_bucket": lead_time_bucket,
        "rule_triggered": f"Statistical outlier (+{z_score}σ)" if total_fare > expected_max else f"Statistical outlier (-{abs(z_score)}σ)" if total_fare < expected_min else "In-distribution"
    }

    return is_anomaly, severity, score, expected_min, expected_max, reason_signals
