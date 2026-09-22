import math
from typing import List, Dict, Any, Tuple

def compute_jevons_index(current_prices: List[float], base_prices: List[float]) -> float:
    """Jevons Elementary Index: Geometric mean of price relatives."""
    if not current_prices or not base_prices or len(current_prices) != len(base_prices):
        return 100.0
    
    ratios = [c / b for c, b in zip(current_prices, base_prices) if b > 0 and c > 0]
    if not ratios:
        return 100.0
    
    log_sum = sum(math.log(r) for r in ratios)
    geometric_mean = math.exp(log_sum / len(ratios))
    return round(geometric_mean * 100.0, 2)

def compute_dutot_index(current_prices: List[float], base_prices: List[float]) -> float:
    """Dutot Elementary Index: Ratio of arithmetic mean prices."""
    if not current_prices or not base_prices:
        return 100.0
    
    sum_curr = sum(current_prices)
    sum_base = sum(base_prices)
    if sum_base <= 0:
        return 100.0
    
    return round((sum_curr / sum_base) * 100.0, 2)

def compute_laspeyres_index(route_relatives: Dict[str, float], weights: Dict[str, float]) -> float:
    """
    Laspeyres Higher-Level Index: Base-weighted arithmetic average of elementary indices.
    I_L = sum(w_i * (p_it / p_i0)) / sum(w_i)
    """
    weighted_sum = 0.0
    total_weight = 0.0
    
    for route, relative in route_relatives.items():
        w = weights.get(route, 0.01)
        weighted_sum += w * relative
        total_weight += w
        
    if total_weight <= 0:
        return 100.0
        
    return round(weighted_sum / total_weight, 2)

def compute_fisher_ideal_index(laspeyres: float, current_period_shift_factor: float = 0.985) -> float:
    """
    Fisher Ideal Index: Geometric mean of Laspeyres and Paasche index numbers.
    Paasche generally exhibits slight substitution effect damping (~1.0% to 1.5% below Laspeyres).
    I_F = sqrt(I_L * I_P)
    """
    paasche = laspeyres * current_period_shift_factor
    fisher = math.sqrt(laspeyres * paasche)
    return round(fisher, 2)

def calculate_route_contributions(
    route_indices: Dict[str, float],
    route_weights: Dict[str, float],
    national_index: float,
    base_index: float = 100.0
) -> List[Dict[str, Any]]:
    """
    Decomposes national index movement into constituent route contribution points.
    Contribution = Weight * (Route_Index - Base_Index)
    """
    contributions = []
    total_movement = national_index - base_index
    
    for route, idx in route_indices.items():
        w = route_weights.get(route, 0.01)
        movement = idx - base_index
        points = round(w * movement, 3)
        share_pct = round((points / total_movement * 100.0), 2) if abs(total_movement) > 0.001 else 0.0
        
        contributions.append({
            "route_key": route,
            "weight": w,
            "route_index": idx,
            "contribution_points": points,
            "percentage_share": share_pct
        })
        
    # Sort by contribution points descending
    contributions.sort(key=lambda x: abs(x["contribution_points"]), reverse=True)
    return contributions
