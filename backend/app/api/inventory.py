from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import Inventory, Product

router = APIRouter()

@router.get("/")
def get_all_inventory(db: Session = Depends(get_db)):
    # Simple join to get inventory with product details
    items = db.query(Inventory, Product).join(Product).all()
    
    result = []
    for inv, prod in items:
        result.append({
            "id": inv.id,
            "productId": prod.id,
            "productName": prod.name,
            "sku": prod.sku,
            "quantity": inv.quantity,
            "category": prod.category.name if prod.category else "Uncategorized"
        })
        
    return result
