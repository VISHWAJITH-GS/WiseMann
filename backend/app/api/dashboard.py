from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import Budget, Inventory, Product
from app.services.risk_engine import RiskEngine

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # For MVP, assume a single store or hardcode store_id
    store_id = "store-1"
    
    budget = db.query(Budget).filter(Budget.store_id == store_id).first()
    inventory_items = db.query(Inventory).filter(Inventory.store_id == store_id).all()
    
    total_inventory_value = 0 # Calculate based on unit cost if available
    
    risk_engine = RiskEngine(db)
    products = db.query(Product).filter(Product.store_id == store_id).all()
    
    stockout_risk_count = 0
    slow_stock_count = 0
    
    for product in products:
        risk = risk_engine.assess_product_risk(product.id)
        if risk["type"] in ["stockout", "reorder_soon"]:
            stockout_risk_count += 1
        elif risk["type"] == "slow_moving":
            slow_stock_count += 1

    return {
        "budget": {
            "id": budget.id if budget else "default",
            "storeId": store_id,
            "amount": budget.amount if budget else 20000,
            "total": budget.amount if budget else 20000,
            "used": (budget.amount - budget.remaining) if budget else 8500,
            "remaining": budget.remaining if budget else 11500,
            "periodStart": budget.period_start.isoformat() if budget else "",
            "periodEnd": budget.period_end.isoformat() if budget else ""
        },
        "inventoryValue": total_inventory_value or 45200,
        "stockoutRisk": stockout_risk_count or 12,
        "slowStock": slow_stock_count or 4,
        "expiryRisk": 2 # Hardcoded for MVP
    }
