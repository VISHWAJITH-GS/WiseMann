from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="StockWise API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all. In prod, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import dashboard, purchase, inventory

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(purchase.router, prefix="/api/purchase", tags=["Purchase"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])

@app.get("/")
def read_root():
    return {"message": "Welcome to StockWise API"}
