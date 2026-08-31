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

@router.get("/{product_id}")
def get_inventory_by_product(product_id: str, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not inv:
        return {"error": "Inventory not found"}
        
    return {
        "id": inv.id,
        "productId": inv.product_id,
        "quantity": inv.quantity
    }
