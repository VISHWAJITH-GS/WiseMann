// WiseMann Types and Interfaces

export interface Store {
  id: string;
  name: string;
  location: string;
  currency: string;
  createdAt: string;
}

export interface User {
  id: string;
  storeId: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  createdAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  sku: string;
  name: string;
  unit: string;
  packSize: number;
  shelfLife: number;
}

export interface Inventory {
  currentStock: number;
  inventoryValue: number;
  daysOfStock: number;
  expiryRisk: boolean;
}

export interface Forecast {
  horizon: number;
  predictedDemand: number;
  confidence: "low" | "medium" | "high";
  trend: "increasing" | "decreasing" | "stable";
  generatedAt: string;
}

export interface Risk {
  type: "stockout" | "reorder_soon" | "overstock" | "slow_moving" | "expiry" | "healthy";
  severity: "low" | "medium" | "high";
  score: number;
  financialImpact: number;
  generatedAt: string;
}

export interface Supplier {
  id: string;
  storeId: string;
  name: string;
  contact: string;
  paymentTerms: string;
}

export interface SupplierProduct {
  supplierId: string;
  productId: string;
  unitCost: number;
  moq: number;
  leadTime: number;
  reliability: number;
}

export interface Recommendation {
  id: string;
  productId: string;
  productName?: string;
  action: "buy" | "hold" | "reduce";
  quantity: number;
  buyBy: string;
  priority: "low" | "medium" | "high";
  reason: string;
  cost: number;
  generatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  storeId: string;
  supplierId: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  orderDate: string;
  expectedDate: string;
  totalCost: number;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface Budget {
  id: string;
  storeId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  remaining: number;
}

export interface DashboardSummary {
  budget: Budget;
  inventoryValue: number;
  stockoutRisk: number;
  slowStock: number;
  expiryRisk: number;
  priorityActions: Recommendation[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface ScenarioInput {
  budget?: number;
  demandChange?: number;
  supplierPrice?: number;
  leadTime?: number;
  scenario: string;
}

export interface ScenarioOutput {
  recommendedSpend: number;
  orderQuantities: Record<string, number>;
  stockoutCount: number;
  excessStockValue: number;
  potentialLostSales: number;
  potentialWastage: number;
  budgetRemaining: number;
  changedRecommendations: Recommendation[];
}
