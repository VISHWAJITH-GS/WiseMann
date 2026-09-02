from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import Supplier, SupplierProduct

router = APIRouter()

def serialize_supplier(supplier: Supplier, db: Session):
    products = db.query(SupplierProduct).filter(SupplierProduct.supplier_id == supplier.id).all()
    reliability = round((sum(item.reliability for item in products) / len(products) * 100) if products else 0)
    lead_time = round(sum(item.lead_time for item in products) / len(products)) if products else 0
    price = min((item.unit_cost for item in products), default=0)
    return {"id": supplier.id, "name": supplier.name, "contact": supplier.contact,
            "paymentTerms": supplier.payment_terms, "unitPrice": price,
            "leadTime": lead_time, "reliability": reliability}

@router.get("/")
def get_suppliers(db: Session = Depends(get_db)):
    return [serialize_supplier(supplier, db) for supplier in db.query(Supplier).all()]

@router.get("/{supplier_id}")
def get_supplier(supplier_id: str, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return serialize_supplier(supplier, db)
