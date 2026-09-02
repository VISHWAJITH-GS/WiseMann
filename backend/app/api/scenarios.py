from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ScenarioRequest(BaseModel):
    scenario: str
    budget: float | None = None
    demandChange: float = 0
    supplierPrice: float = 0

@router.post("/simulate")
def simulate_scenario(input: ScenarioRequest):
    demand_factor = 1 + input.demandChange / 100
    price_factor = 1 + input.supplierPrice / 100
    baseline_spend = 17500
    unconstrained_spend = round(baseline_spend * demand_factor * price_factor)
    recommended_spend = min(unconstrained_spend, round(input.budget or unconstrained_spend))
    stockout_count = max(0, round(2 + input.demandChange / 20 + max(0, baseline_spend - recommended_spend) / 5000))
    return {
        "recommendedSpend": recommended_spend,
        "orderQuantities": {},
        "stockoutCount": stockout_count,
        "excessStockValue": max(0, round(31500 * (1 - input.demandChange / 200))),
        "potentialLostSales": stockout_count * 1200,
        "potentialWastage": max(0, round(1800 - input.demandChange * 15)),
        "budgetRemaining": max(0, round((input.budget or unconstrained_spend) - recommended_spend)),
        "changedRecommendations": []
    }
