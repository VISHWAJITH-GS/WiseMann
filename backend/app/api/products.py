from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import Product

router = APIRouter()

@router.get("/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "storeId": p.store_id,
            "categoryId": p.category_id,
            "name": p.name,
            "sku": p.sku,
            "unit": p.unit,
            "packSize": p.pack_size,
            "shelfLife": p.shelf_life,
            "category": p.category.name if p.category else "Uncategorized"
        })
    return result

@router.get("/{id}")
def get_product(id: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == id).first()
    if not p:
        return {"error": "Product not found"}
    return {
        "id": p.id,
        "storeId": p.store_id,
        "categoryId": p.category_id,
        "name": p.name,
        "sku": p.sku,
        "unit": p.unit,
        "packSize": p.pack_size,
        "shelfLife": p.shelf_life,
        "category": p.category.name if p.category else "Uncategorized"
    }
