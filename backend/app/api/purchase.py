from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.purchase_optimizer import PurchaseOptimizer

router = APIRouter()

@router.get("/recommendations")
def get_purchase_recommendations(db: Session = Depends(get_db)):
    # For MVP, assume a single store or hardcode store_id
    store_id = "store-1"
    
    optimizer = PurchaseOptimizer(db)
    recommendations = optimizer.generate_recommendations(store_id)
    
    # Fallback to dummy data if DB is empty for MVP testing
    if not recommendations:
        return [
            {
                "id": "1", "productId": "p1", "quantity": 50, 
                "reason": "High demand predicted", "priority": "high", 
                "type": "reorder", "confidence": 0.9, "estimatedCost": 1000
            }
        ]
        
    # Map to frontend expected format
    formatted = []
    for idx, r in enumerate(recommendations):
        formatted.append({
            "id": str(idx),
            "productId": r["product_id"],
            "productName": r["product_name"],
            "quantity": r["quantity"],
            "reason": r["reason"],
            "priority": r["priority"].lower(),
            "type": "reorder",
            "confidence": 0.8,
            "estimatedCost": r["order_value"]
        })
        
    return formatted
