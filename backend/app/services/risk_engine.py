from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.domain import Product, Inventory
from app.services.forecasting import ForecastingEngine

class RiskEngine:
    def __init__(self, db: Session):
        self.db = db
        self.forecasting = ForecastingEngine(db)

    def assess_product_risk(self, product_id: str) -> Dict[str, Any]:
        """
        Assess inventory risk (stockout, overstock, etc.) for a single product.
        """
        inventory = self.db.query(Inventory).filter(Inventory.product_id == product_id).first()
        current_stock = inventory.quantity if inventory else 0
        
        forecast = self.forecasting.generate_forecast(product_id, horizon_days=14)
        predicted_demand = forecast.get("predicted_demand", 0)
        
        daily_demand = predicted_demand / 14 if predicted_demand > 0 else 0.1
        days_of_stock = current_stock / daily_demand if daily_demand > 0 else 999
        
        risk_type = "healthy"
        severity = "low"
        score = 0.0
        
        if days_of_stock < 3:
            risk_type = "stockout"
            severity = "high"
            score = 0.9
        elif days_of_stock < 7:
            risk_type = "reorder_soon"
            severity = "medium"
            score = 0.6
        elif days_of_stock > 30:
            risk_type = "overstock"
            severity = "medium"
            score = 0.7
            
        return {
            "product_id": product_id,
            "type": risk_type,
            "severity": severity,
            "score": score,
            "days_of_stock": round(days_of_stock, 1),
            "financial_impact": 0 # Would calculate based on lost sales or locked capital
        }
