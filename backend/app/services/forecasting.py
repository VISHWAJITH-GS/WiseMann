from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.domain import Product, Sale

class ForecastingEngine:
    def __init__(self, db: Session):
        self.db = db

    def generate_forecast(self, product_id: str, horizon_days: int = 14) -> Dict[str, Any]:
        """
        Generate a simple demand forecast based on historical sales.
        For Hackathon MVP, we use a simple moving average or fallback to mock data
        if no sales history exists.
        """
        # In a real app, query `Sale` and calculate moving average.
        # For now, return a plausible mock forecast structure.
        return {
            "product_id": product_id,
            "horizon": horizon_days,
            "predicted_demand": 60, # Mocked average demand
            "confidence": "medium",
            "trend": "stable"
        }
