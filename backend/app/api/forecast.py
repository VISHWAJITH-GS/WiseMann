from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.forecasting import ForecastingEngine

router = APIRouter()

@router.get("/{product_id}")
def get_forecast(product_id: str, horizon: int = 7, db: Session = Depends(get_db)):
    forecast = ForecastingEngine(db).generate_forecast(product_id, horizon_days=horizon)
    return {"horizon": forecast["horizon"], "predictedDemand": forecast["predicted_demand"],
            "confidence": forecast["confidence"], "trend": forecast["trend"], "generatedAt": "2026-09-02T00:00:00Z"}

@router.post("/{product_id}/regenerate")
def regenerate_forecast(product_id: str, db: Session = Depends(get_db)):
    return get_forecast(product_id, 30, db)
