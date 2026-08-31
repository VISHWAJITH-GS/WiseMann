import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.domain import Product, SupplierProduct, Budget
from app.services.forecasting import ForecastingEngine
from app.services.risk_engine import RiskEngine

class PurchaseOptimizer:
    def __init__(self, db: Session):
        self.db = db
        self.forecasting = ForecastingEngine(db)
        self.risk_engine = RiskEngine(db)

    def generate_recommendations(self, store_id: str) -> List[Dict[str, Any]]:
        """
        Generate purchase recommendations prioritizing items with stockout risk.
        """
        products = self.db.query(Product).filter(Product.store_id == store_id).all()
        budget = self.db.query(Budget).filter(Budget.store_id == store_id).first()
        available_budget = budget.remaining if budget else 0
        
        recommendations = []
        
        for product in products:
            risk = self.risk_engine.assess_product_risk(product.id)
            if risk["type"] in ["stockout", "reorder_soon"]:
                # Get supplier details
                supplier_prod = self.db.query(SupplierProduct).filter(SupplierProduct.product_id == product.id).first()
                unit_cost = supplier_prod.unit_cost if supplier_prod else 100
                moq = supplier_prod.moq if supplier_prod else 10
                
                # Calculate required quantity
                forecast = self.forecasting.generate_forecast(product.id, horizon_days=30)
                predicted_demand = forecast.get("predicted_demand", 0)
                quantity_needed = max(predicted_demand, moq)
                
                order_value = quantity_needed * unit_cost
                
                recommendations.append({
                    "product_id": product.id,
                    "product_name": product.name,
                    "action": "BUY",
                    "quantity": quantity_needed,
                    "priority": "HIGH" if risk["type"] == "stockout" else "MEDIUM",
                    "reason": f"Demand exceeds available stock (Risk: {risk['type']})",
                    "unit_cost": unit_cost,
                    "order_value": order_value,
                    "buy_by": (datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
                    "supplier_id": supplier_prod.supplier_id if supplier_prod else "unknown"
                })
        
        # Sort by priority (HIGH first)
        recommendations.sort(key=lambda x: 0 if x["priority"] == "HIGH" else 1)
        
        # Budget constraint logic could go here to filter out lower priority items
        
        return recommendations
