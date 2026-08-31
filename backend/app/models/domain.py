import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Store(Base):
    __tablename__ = "stores"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    currency = Column(String, default="INR")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    products = relationship("Product", back_populates="store")
    budgets = relationship("Budget", back_populates="store")

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    name = Column(String)

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    category_id = Column(String, ForeignKey("categories.id"))
    sku = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    unit = Column(String)
    pack_size = Column(Integer)
    shelf_life = Column(Integer) # in days

    store = relationship("Store", back_populates="products")
    category = relationship("Category")
    inventory = relationship("Inventory", back_populates="product", uselist=False)

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    name = Column(String)
    contact = Column(String)
    payment_terms = Column(String)

class SupplierProduct(Base):
    __tablename__ = "supplier_products"
    supplier_id = Column(String, ForeignKey("suppliers.id"), primary_key=True)
    product_id = Column(String, ForeignKey("products.id"), primary_key=True)
    unit_cost = Column(Float)
    moq = Column(Integer)
    lead_time = Column(Integer)
    reliability = Column(Float)

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    product_id = Column(String, ForeignKey("products.id"), unique=True)
    quantity = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="inventory")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    sold_at = Column(DateTime, default=datetime.datetime.utcnow)

class Budget(Base):
    __tablename__ = "budgets"
    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, ForeignKey("stores.id"))
    amount = Column(Float)
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    remaining = Column(Float)

    store = relationship("Store", back_populates="budgets")
