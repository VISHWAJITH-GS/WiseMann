import datetime
import uuid
import random
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import base, domain

def seed_db():
    print("Creating tables...")
    base.Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    # Check if we already have data
    if db.query(domain.Store).first():
        print("Database already seeded!")
        return

    print("Seeding database...")
    
    # Create Store
    store = domain.Store(id="store-1", name="VIT Supermarket", location="Vellore")
    db.add(store)
    
    # Create Category
    cat_grocery = domain.Category(id="cat-1", store_id="store-1", name="Grocery")
    cat_dairy = domain.Category(id="cat-2", store_id="store-1", name="Dairy")
    db.add_all([cat_grocery, cat_dairy])
    
    # Create Budget
    budget = domain.Budget(
        id="bud-1", store_id="store-1", amount=20000, 
        period_start=datetime.datetime.now(), 
        period_end=datetime.datetime.now() + datetime.timedelta(days=30),
        remaining=11500
    )
    db.add(budget)
    
    # Create Supplier
    supplier = domain.Supplier(id="sup-1", store_id="store-1", name="ABC Distributors", contact="123456789")
    db.add(supplier)
    
    db.commit()

    # Create Products & Inventory
    products = [
        {"id": "p-1", "cat": "cat-1", "name": "Sunflower Oil 1L", "stock": 5, "price": 150},
        {"id": "p-2", "cat": "cat-1", "name": "Basmati Rice 5kg", "stock": 2, "price": 400},
        {"id": "p-3", "cat": "cat-2", "name": "Milk 1L", "stock": 50, "price": 60},
    ]

    for p in products:
        prod = domain.Product(
            id=p["id"], store_id="store-1", category_id=p["cat"], 
            sku=f"SKU-{p['id']}", name=p["name"], unit="pack", pack_size=1, shelf_life=30
        )
        db.add(prod)
        
        inv = domain.Inventory(id=f"inv-{p['id']}", store_id="store-1", product_id=p["id"], quantity=p["stock"])
        db.add(inv)
        
        sup_prod = domain.SupplierProduct(
            supplier_id="sup-1", product_id=p["id"], unit_cost=p["price"] * 0.8, moq=10, lead_time=2, reliability=0.95
        )
        db.add(sup_prod)
        
    db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_db()
