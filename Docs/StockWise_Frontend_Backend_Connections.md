# StockWise — Frontend, Backend & Connection Architecture

> **AI-Powered Inventory Purchase Advisor for Supermarkets**  
> Hackathon MVP — Technical Reference for Frontend + Backend Teams

---

## 1. Product Objective

StockWise is a supermarket decision-support system that combines:

- Sales data
- Inventory data
- Supplier data
- Purchase data
- Budget/financial data

and converts them into:

> **What to buy + How much to buy + When to buy + From whom + Why**

The user-facing experience follows:

```text
DATA → RISK → MONEY → ACTION → REASON
```

The frontend should make the decision easy to understand and act on.  
The backend should own the calculations and business truth.

---

# 2. Overall Architecture

For the hackathon, use a **modular monolith** rather than microservices.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                          STOCKWISE                                  │
│                                                                     │
│  ┌─────────────────────── FRONTEND ──────────────────────────────┐  │
│  │                                                               │  │
│  │ Dashboard                                                     │  │
│  │ Purchase Advisor                                              │  │
│  │ Inventory                                                     │  │
│  │ Product Detail                                                │  │
│  │ Demand Forecast                                               │  │
│  │ Suppliers                                                     │  │
│  │ What-if Analysis                                              │  │
│  │ AI Store Manager                                              │  │
│  │ Notifications / Alerts                                       │  │
│  │                                                               │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│                              │                                      │
│                         REST / JSON API                              │
│                              │                                      │
│  ┌───────────────────────────▼───────────────────────────────────┐  │
│  │                       API / APPLICATION                       │  │
│  │                                                               │  │
│  │ Auth • Validation • Request Routing • Response Formatting     │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────▼───────────────────────────────────┐  │
│  │                     BACKEND MODULES                           │  │
│  │                                                               │  │
│  │ Data Management                                               │  │
│  │ Data Processing                                               │  │
│  │ Demand Forecasting                                            │  │
│  │ Inventory Risk Engine                                         │  │
│  │ Purchase Optimization                                         │  │
│  │ Decision Engine                                               │  │
│  │ What-if / Simulation                                          │  │
│  │ AI Store Manager                                              │  │
│  │ Auth & Audit                                                  │  │
│  │ Monitoring                                                    │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│                              │                                      │
│                    ┌─────────▼─────────┐                            │
│                    │ Database / Storage│                            │
│                    └───────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 3. Frontend Architecture

## 3.1 Frontend Responsibilities

The frontend is responsible for:

- Displaying the store's current situation
- Making risks visually obvious
- Showing purchase recommendations
- Allowing quantity/budget edits
- Showing evidence behind recommendations
- Running what-if interactions
- Providing AI interaction
- Handling loading, empty, error and low-confidence states
- Making the final action simple

The frontend should **not contain purchase optimization logic**.

---

# 4. Frontend Information Architecture

```text
App
│
├── Dashboard
│   ├── KPI Cards
│   ├── Priority Actions
│   ├── Sales vs Forecast
│   ├── Inventory Distribution
│   └── AI Store Manager
│
├── Purchase Advisor
│   ├── Budget Summary
│   ├── Recommendation Table
│   ├── Priority
│   ├── Quantity
│   ├── Supplier
│   ├── Buy-by Date
│   └── Recommendation Evidence
│
├── Inventory
│   ├── Search
│   ├── Filters
│   ├── Product Table
│   └── Risk Status
│
├── Product Detail
│   ├── Product Summary
│   ├── Stock
│   ├── Sales Trend
│   ├── Forecast
│   ├── Expiry
│   ├── Supplier
│   └── Why Recommendation?
│
├── Demand Forecast
│   ├── Historical Sales
│   ├── 7/14/30-day Forecast
│   ├── Trend
│   └── Confidence
│
├── Suppliers
│   ├── Supplier Comparison
│   ├── Price
│   ├── MOQ
│   ├── Lead Time
│   └── Reliability
│
├── What-if Analysis
│   ├── Budget
│   ├── Demand
│   ├── Supplier Price
│   ├── Lead Time
│   └── Before vs Scenario
│
└── AI Store Manager
    ├── Suggested Questions
    ├── Answers
    ├── Evidence
    └── Actions
```

---

# 5. Frontend Design System

## 5.1 Brand Direction

The product should be:

- Premium
- Minimal
- Calm
- Trustworthy
- Operational
- Financially focused

### Primary visual rule

> **Black + Pure White first, semantic colours second, AI colour third.**

## 5.2 Core Colours

| Token | Hex | Usage |
|---|---|---|
| Primary Black | `#000000` | Brand, primary CTA, active navigation, key numbers |
| Ink | `#111111` | Main headings |
| Text | `#1F1F1F` | Body text |
| Secondary Text | `#6B7280` | Supporting text |
| Muted Text | `#9CA3AF` | Metadata |
| Pure White | `#FFFFFF` | Main background, cards |
| Soft Surface | `#FAFAFA` | Hover/selected surfaces |
| Border | `#E5E7EB` | Borders |
| Strong Border | `#D1D5DB` | Focus/emphasis |
| Success | `#16A34A` | Healthy/success |
| Success Soft | `#F0FDF4` | Success backgrounds |
| Warning | `#D97706` | Attention/moderate risk |
| Warning Soft | `#FFFBEB` | Warning backgrounds |
| Danger | `#DC2626` | Stockout/critical risk |
| Danger Soft | `#FEF2F2` | Danger backgrounds |
| AI Purple | `#7C3AED` | AI-specific UI |
| AI Soft | `#F5F3FF` | AI backgrounds |
| Info | `#52525B` | Neutral information |
| Info Soft | `#F4F4F5` | Informational backgrounds |

### Colour rules

- Do not use blue as the primary brand/CTA.
- Pure white is the main page background.
- Green means healthy/success, not "buy".
- Red means risk/urgency.
- Amber means attention.
- Purple is reserved for AI.
- Pair semantic colour with text/icon; do not depend on colour alone.
- Avoid heavy gradients in operational screens.

---

# 6. Frontend Module Specifications

## 6.1 Dashboard

### Purpose

Answer:

> "What is happening in my store today?"

### UI

- Store greeting/header
- Data freshness
- Purchase budget
- Inventory value
- Stockout risk
- Slow-moving stock
- Expiry risk
- Top 3–5 actions
- Sales vs forecast
- Inventory distribution
- AI Store Manager

### Priority

The user should understand the current store situation quickly.

### Key backend inputs

```text
budget
inventory_value
stockout_risk
slow_stock
expiry_risk
priority_actions
sales_history
forecast
inventory_distribution
```

---

## 6.2 Purchase Advisor

### Purpose

Answer exactly:

- What should I buy?
- How much?
- When?
- From whom?
- Why?

### Recommendation row

```text
Priority
Product
Current Stock
Days of Stock
Forecast Demand
Recommended Quantity
Supplier
Unit Cost
Order Value
Buy By
Reason
Action
```

### Primary CTA

```text
Add to Purchase Plan
```

### Secondary CTA

```text
Why?
```

The "Why?" opens an evidence drawer.

### Budget-constrained mode

If recommended spend exceeds budget:

```text
Recommended Spend > Available Budget
        ↓
Rank candidates
        ↓
Protect Tier 1 items
        ↓
Defer lower-priority items
        ↓
Return feasible purchase plan
        ↓
Return deferred items + reasons
```

---

## 6.3 Inventory

### Search

- Product name
- SKU
- Category
- Barcode

### Filters

- Risk
- Category
- Supplier
- Days of stock
- Expiry
- Movement speed

### Columns

- Product
- Category
- Stock
- Days of Stock
- 7/14/30-day Demand
- Unit Cost
- Inventory Value
- Risk
- Expiry
- Suggested Action

---

## 6.4 Product Detail

### Sections

1. Product identity
2. Current stock
3. Inventory value
4. Sales trend
5. 7/14/30-day forecast
6. Days of stock
7. Reorder point / safety stock
8. Expiry batches
9. Supplier information
10. Recommendation
11. Why recommendation?

### Important UX

Show:

```text
RECOMMENDATION
      ↓
EVIDENCE
```

not:

```text
EVIDENCE
      ↓
User figures out recommendation
```

---

## 6.5 Demand Forecast

### UI

- Product/category selector
- Historical sales chart
- 7/14/30-day selector
- Forecast line
- Confidence band
- Trend
- Forecast confidence
- Plain-language interpretation

### Backend output

```json
{
  "product_id": "P001",
  "horizon": 14,
  "predicted_demand": 68,
  "trend": "increasing",
  "confidence": "high",
  "generated_at": "timestamp"
}
```

---

## 6.6 Suppliers

### Show

- Supplier name
- Unit price
- Lead time
- MOQ
- Reliability
- Last purchase price
- Payment terms

Supplier selection should be part of purchasing optimization.

---

## 6.7 What-if Analysis

### Inputs

- Purchase budget
- Demand change
- Supplier price
- Lead time
- Festival/high-demand scenario

### Output

```text
                BEFORE       SCENARIO
Budget          ₹20,000      ₹10,000
Spend           ₹17,500      ₹9,800
Stockout Risk   2            4
Excess Stock    ₹31,500      ₹22,000
Purchases       8            5
```

Scenario calculations must not change live store data.

---

## 6.8 AI Store Manager

### Suggested prompts

- What should I buy today?
- Where is my money stuck?
- Which products may stock out?
- I only have ₹10,000. What should I buy?
- Why shouldn't I buy biscuits?

### AI response structure

```text
Answer
↓
Numbers / evidence
↓
Explanation
↓
Recommended action
```

AI should explain backend decisions and must not become the source of business truth.

---

# 7. Frontend UX / Behavioral Rules

Use:

- Cognitive load reduction
- Progressive disclosure
- Hick's Law
- Fitts's Law
- Jakob's Law
- Gestalt proximity
- Gestalt similarity
- Von Restorff effect
- Peak-End Rule
- Tesler's Law
- Feedback
- Error prevention
- User control

### Core experience

```text
SEE
 ↓
UNDERSTAND
 ↓
DECIDE
 ↓
ACT
```

Every recommendation should answer:

```text
WHAT?
HOW MUCH?
WHEN?
WHY?
WHAT WILL IT COST?
```

---

# 8. Frontend Motion System

| Interaction | Animation |
|---|---|
| Page entrance | 150–220ms fade + 4–8px movement |
| Card hover | 120–160ms subtle elevation |
| Button press | 80–120ms scale ~0.98 |
| Drawer | 180–240ms slide + overlay |
| Modal | 160–220ms fade + small scale |
| Risk change | 150–200ms colour/opacity |
| Number update | 200–400ms |
| What-if recalculation | 250–500ms |
| AI answer | Fast reveal; no artificial long typing |
| Toast | 150–200ms slide/fade |

Motion must communicate:

- State
- Hierarchy
- Cause/effect
- Feedback

Respect reduced-motion preferences.

---

# 9. Backend Architecture

## 9.1 Backend modules

```text
Backend
│
├── Data Management
├── Data Processing
├── Demand Forecasting
├── Inventory Risk Engine
├── Purchase Optimization
├── Decision Engine
├── What-if / Simulation
├── AI Store Manager
├── API Layer
├── Auth & Audit
└── Monitoring
```

---

# 10. Data Management Module

## Components

- Store / Branch Management
- Product Management
- Category Management
- Supplier Management
- Sales Management
- Inventory Management
- Purchase Order Management
- Product Batch Management
- Expiry Management
- Budget / Finance Management
- CSV / Excel Import
- Data Validation

## Responsibilities

- Load/store supermarket data
- Validate fields
- Detect duplicates
- Preserve historical records
- Track timestamps/data freshness

---

# 11. Data Processing Module

## Pipeline

```text
Raw Data
   ↓
Validation
   ↓
Cleaning
   ↓
Duplicate / Outlier Handling
   ↓
Aggregation
   ↓
Feature Generation
   ↓
Forecast / Risk Ready Data
```

## Components

- Missing-value handling
- Duplicate detection
- Outlier detection
- Date/time normalization
- Daily/weekly/monthly sales aggregation
- Feature generation
- Sales velocity
- Trend detection
- Seasonality indicators
- Data quality score

---

# 12. Demand Forecasting Engine

## Inputs

- Historical sales
- Product/category
- Day-of-week patterns
- Recent trend
- Seasonality
- Festival/event effects when available
- Promotions when available
- Stock availability

## Components

- Forecast preparation
- Baseline model
- Time-series forecasting
- 7-day forecast
- 14-day forecast
- 30-day forecast
- Trend analyzer
- Seasonality analyzer
- Confidence calculator
- Accuracy tracker

## Important rule

Stockouts should not automatically be interpreted as zero demand.

---

# 13. Inventory Risk Engine

## Risk types

| Risk | Business meaning |
|---|---|
| Stockout | Product may run out before replenishment |
| Reorder Soon | Stock is approaching reorder point |
| Overstock | Too much stock relative to expected need |
| Slow Moving | Low sales velocity |
| Expiry | Product/batch may expire before sale |
| Healthy | No immediate action |

## Components

- Current stock calculator
- Days-of-stock calculator
- Reorder point
- Safety stock handling
- Stockout probability/risk score
- Lost-sales estimator
- Excess-stock detector
- Capital-locked calculator
- Sales velocity analyzer
- Dead-stock detector
- Batch expiry tracker
- Wastage-value estimator
- Overall product risk prioritizer

---

# 14. Purchase Optimization Engine

> **Core decision engine for purchasing.**

## Inputs

- Forecast demand
- Current stock
- Safety stock / reorder point
- Supplier lead time
- Supplier price
- MOQ
- Pack/carton size
- Supplier reliability
- Available budget
- Product essentiality
- Expiry risk
- Storage constraints, where available

## Components

- Demand requirement calculator
- Net inventory requirement calculator
- Recommended order quantity
- MOQ/pack-size adjustment
- Reorder timing
- Supplier comparison
- Supplier selection
- Budget allocation
- Purchase ranking
- Deferred-purchase handling
- Expected outcome calculator

## Output

```json
{
  "product": "Sunflower Oil 1L",
  "action": "BUY",
  "quantity": 50,
  "buy_by": "2026-09-02",
  "supplier": "ABC Distributors",
  "unit_cost": 350,
  "order_value": 17500,
  "priority": "HIGH",
  "reason": "Demand is rising and current stock may run out before replenishment"
}
```

---

# 15. Budget Optimization

Budget is a **hard business constraint**.

## Priority tiers

```text
Tier 1
Essential / high stockout risk

Tier 2
High demand / lower immediate risk

Tier 3
Optional / deferrable
```

## Flow

```text
Recommended spend > Budget
        ↓
Rank candidates
        ↓
Protect Tier 1
        ↓
Reduce/defer Tier 2/3
        ↓
Generate feasible plan
        ↓
Return deferred items + reason
```

---

# 16. Decision Engine

The Decision Engine combines:

```text
Forecast
   +
Current Inventory
   +
Risk
   +
Supplier Constraints
   +
Budget
   +
Business Priority
   ↓
Decision Engine
   ↓
Prioritized Purchase Plan
```

## Components

- Product prioritization
- Risk vs cost evaluation
- Purchase ranking
- Budget allocation
- Trade-off calculation
- Recommendation generation
- Recommendation confidence
- Expected outcome
- Alternative recommendation

### Important

> The engine produces the business decision.  
> The LLM explains the decision.

---

# 17. What-if / Simulation Engine

## Processing

```text
Scenario Inputs
      ↓
Clone current decision context
      ↓
Apply scenario changes
      ↓
Recalculate required analytics
      ↓
Compare baseline
      ↓
Return scenario result
```

## Output

- Recommended spend
- Order quantities
- Stockout count
- Excess-stock value
- Potential lost sales
- Potential wastage
- Budget remaining
- Changed recommendations
- Before vs scenario

Scenario execution must not mutate production/live budget or inventory.

---

# 18. AI Store Manager Backend

## Architecture

```text
User Question
      ↓
Intent Detection
      ↓
Context / Data Retrieval
      ↓
Backend Analytics / Decision Engine
      ↓
Structured Result
      ↓
LLM Explanation
      ↓
Answer + Optional Action
```

## Components

- Intent classifier
- Conversation/context manager
- Backend data retrieval
- Recommendation explanation generator
- What-if query handler
- Inventory query handler
- Purchase query handler
- Financial query handler
- Action handler
- Response formatter

## Guardrails

- Never invent store numbers.
- Use backend structured results as numeric source.
- Flag unavailable/stale data.
- Never execute a real purchase without user confirmation.
- Keep explanations concise.
- Link answers to underlying records where possible.

---

# 19. Database Architecture

A relational database fits the product because sales, products, inventory, suppliers, purchases and recommendations are strongly related.

## Core tables

| Table | Important fields |
|---|---|
| `stores` | id, name, location, currency, created_at |
| `users` | id, store_id, name, email, role, created_at |
| `categories` | id, store_id, name |
| `products` | id, store_id, category_id, sku, name, unit, pack_size, shelf_life |
| `suppliers` | id, store_id, name, contact, payment_terms |
| `supplier_products` | supplier_id, product_id, unit_cost, moq, lead_time, reliability |
| `sales` | id, store_id, product_id, quantity, unit_price, sold_at |
| `inventory` | id, store_id, product_id, quantity, updated_at |
| `inventory_batches` | id, product_id, quantity, received_at, expiry_date, unit_cost |
| `purchase_orders` | id, store_id, supplier_id, status, order_date, expected_date, total_cost |
| `purchase_order_items` | purchase_order_id, product_id, quantity, unit_cost |
| `budgets` | id, store_id, amount, period_start, period_end, remaining |
| `forecasts` | id, product_id, horizon, predicted_demand, confidence, generated_at |
| `risk_assessments` | id, product_id, risk_type, severity, score, financial_impact, generated_at |
| `recommendations` | id, product_id, action, quantity, buy_by, priority, reason, cost, generated_at |
| `scenarios` | id, store_id, inputs_json, outputs_json, created_at |
| `audit_logs` | id, user_id, action, entity_type, entity_id, created_at |

---

# 20. Important Relationships

```text
Store
│
├── Users
├── Products
│   ├── Sales
│   ├── Inventory
│   ├── Batches
│   ├── Forecasts
│   ├── Risks
│   └── Recommendations
│
├── Suppliers
│   └── Supplier Products
│
├── Purchase Orders
└── Budgets
```

---

# 21. API Architecture

## API groups

| Group | Example |
|---|---|
| Dashboard | `GET /dashboard/summary` |
| Dashboard | `GET /dashboard/actions` |
| Dashboard | `GET /dashboard/alerts` |
| Products | `GET /products` |
| Products | `GET /products/{id}` |
| Inventory | `GET /inventory` |
| Inventory | `GET /inventory/{product_id}` |
| Sales | `GET /sales` |
| Sales | `POST /sales/import` |
| Forecast | `GET /forecast/{product_id}` |
| Forecast | `POST /forecast/generate` |
| Risks | `GET /risks` |
| Risks | `GET /risks/{product_id}` |
| Purchase | `GET /purchase/recommendations` |
| Purchase | `POST /purchase/optimize` |
| Purchase | `POST /purchase/plan` |
| Suppliers | `GET /suppliers` |
| Suppliers | `GET /suppliers/{id}` |
| What-if | `POST /scenarios/simulate` |
| AI | `POST /ai/chat` |
| Auth | `POST /auth/login` |

Use consistent JSON response structures, validation and error codes.

---

# 22. Frontend ↔ Backend Connection Map

## Dashboard

```text
Frontend Dashboard
       ↓
GET /dashboard/summary
       ↓
Backend
 ├── Budget
 ├── Inventory
 ├── Risks
 ├── Forecast
 └── Aggregations
       ↓
Dashboard JSON
       ↓
Frontend KPI Cards + Charts
```

## Purchase Advisor

```text
Purchase Advisor UI
       ↓
GET /purchase/recommendations
       ↓
Decision Engine
 ├── Forecast
 ├── Inventory Risk
 ├── Suppliers
 └── Budget
       ↓
Purchase Recommendations
       ↓
Frontend Recommendation Table
```

## Product Detail

```text
Product Detail
       ↓
GET /products/{id}
GET /inventory/{id}
GET /forecast/{id}
GET /risks/{id}
       ↓
Frontend Product View
```

## What-if

```text
What-if UI
       ↓
POST /scenarios/simulate
       ↓
Scenario Engine
       ↓
Decision Engine
       ↓
Before vs Scenario JSON
       ↓
Animated Frontend Comparison
```

## AI

```text
AI Store Manager
       ↓
POST /ai/chat
       ↓
Intent Detection
       ↓
Backend Data / Decision Tools
       ↓
Structured Result
       ↓
LLM Explanation
       ↓
AI Response UI
```

---

# 23. Main Purchase Recommendation Flow

This is the most important system connection.

```text
                 SALES
                   │
                   ▼
            DATA PROCESSING
                   │
                   ▼
          DEMAND FORECASTING
                   │
                   ├──────────────┐
                   │              │
                   ▼              ▼
             INVENTORY        SUPPLIERS
             RISK ENGINE          │
                   │              │
                   └──────┬───────┘
                          ▼
                  PURCHASE OPTIMIZER
                          │
                          ▼
                    BUDGET CHECK
                          │
                          ▼
                    DECISION ENGINE
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      PURCHASE PLAN              AI EXPLANATION
             │                         │
             └────────────┬────────────┘
                          ▼
                       FRONTEND
```

---

# 24. Data Contract Between Frontend & Backend

The frontend should receive structured objects.

## Product

```json
{
  "id": "P001",
  "name": "Sunflower Oil 1L",
  "category": "Oils",
  "unit": "bottle",
  "sku": "OIL-001"
}
```

## Inventory

```json
{
  "current_stock": 18,
  "inventory_value": 6300,
  "days_of_stock": 4,
  "expiry_risk": false
}
```

## Forecast

```json
{
  "horizon": 14,
  "predicted_demand": 68,
  "confidence": "high",
  "trend": "increasing"
}
```

## Risk

```json
{
  "type": "stockout",
  "severity": "high",
  "score": 0.87,
  "financial_impact": 4000
}
```

## Recommendation

```json
{
  "action": "BUY",
  "quantity": 50,
  "buy_by": "2026-09-02",
  "priority": "HIGH",
  "reason": "Demand is rising and stock may run out before replenishment",
  "cost": 17500
}
```

## Supplier

```json
{
  "id": "S001",
  "name": "ABC Distributors",
  "unit_cost": 350,
  "lead_time": 2,
  "moq": 20,
  "reliability": 0.94
}
```

## Budget

```json
{
  "available": 20000,
  "recommended_spend": 17500,
  "remaining": 2500
}
```

---

# 25. Recommendation Explainability Contract

Every recommendation should contain evidence so both the frontend and AI can explain it.

```text
Current Stock       18 units
Forecast Demand     68 units / 14 days
Days of Stock       4 days
Lead Time           2 days
Supplier Cost       ₹350
Potential Lost Sales ₹4,000
Budget Impact       ₹17,500
Decision Reason     Demand exceeds available stock
```

The frontend can show this in the "Why?" drawer.

---

# 26. Data Freshness

Backend should maintain:

- Sales data timestamp
- Inventory update timestamp
- Forecast generation timestamp

Frontend should display freshness.

Example:

```text
● Data synced 10 min ago
```

If critical input data is stale:

```text
⚠ Some recommendations may be outdated
```

---

# 27. Error / Edge Cases

| Situation | Backend | Frontend |
|---|---|---|
| Insufficient history | Low confidence/fallback | Show low confidence |
| Missing supplier | Recommendation with missing-input flag | Explain supplier unavailable |
| No budget | No feasible plan | Explain budget constraint |
| Budget below essential minimum | Return highest-priority feasible options | Show unmet requirement |
| No sales history | Avoid automatic slow-moving label | Explain insufficient data |
| Historical stockout | Avoid treating zero sales as zero demand where possible | Show data-quality warning if relevant |
| Expired batch | Exclude from sellable inventory | Show expiry state |
| Stale data | Flag recommendation | Show freshness warning |
| Model failure | Fallback where possible | Show limitation/retry |
| Duplicate import | Reject/merge according to policy | Show import result |

---

# 28. Authentication & Security

Backend rules:

- Every query must be scoped to authenticated `store_id`.
- Users should only access their store's data.
- Validate API inputs.
- Store secrets/API keys outside source code.
- Keep audit logs for important changes.
- Do not send unnecessary business data to the LLM.

---

# 29. Performance Strategy

For the hackathon:

- Precompute forecasts.
- Precompute risk assessments.
- Cache dashboard summaries where useful.
- Index `store_id`, `product_id`, timestamps.
- Generate recommendations on demand or on scheduled refresh.
- Use background jobs for heavy forecast generation where required.
- Keep AI responses dependent on fast structured backend queries.

---

# 30. Suggested Technology Stack

| Layer | Recommended |
|---|---|
| Frontend | React / Next.js |
| UI | Tailwind CSS + reusable component system |
| Charts | Recharts / equivalent |
| Backend API | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy / SQLModel |
| Data Processing | Pandas / NumPy |
| Forecasting | Python statistical/ML stack |
| Optimization | Python optimization library / constraint solver |
| AI | LLM API + tool/function calling |
| Background Jobs | Celery/RQ or lightweight scheduler |
| Cache | Redis (optional) |
| Deployment | Docker |

The exact forecasting model should remain replaceable.

---

# 31. Recommended Backend Folder Structure

```text
backend/
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── dashboard.py
│   │   ├── products.py
│   │   ├── inventory.py
│   │   ├── sales.py
│   │   ├── forecasts.py
│   │   ├── risks.py
│   │   ├── purchases.py
│   │   ├── suppliers.py
│   │   ├── scenarios.py
│   │   └── ai.py
│   │
│   ├── models/
│   ├── schemas/
│   │
│   ├── services/
│   │   ├── data_processing/
│   │   ├── forecasting/
│   │   ├── risk_engine/
│   │   ├── purchase_optimizer/
│   │   ├── decision_engine/
│   │   ├── scenario_engine/
│   │   └── ai_manager/
│   │
│   ├── repositories/
│   ├── jobs/
│   ├── core/
│   └── utils/
│
├── tests/
├── migrations/
├── requirements.txt
└── Dockerfile
```

---

# 32. Frontend Component Structure

```text
frontend/
├── src/
│   ├── app/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── purchase-advisor/
│   │   ├── inventory/
│   │   ├── forecast/
│   │   ├── suppliers/
│   │   ├── what-if/
│   │   └── ai-store-manager/
│   │
│   ├── components/
│   │   ├── KPI/
│   │   ├── RiskBadge/
│   │   ├── ActionCard/
│   │   ├── RecommendationRow/
│   │   ├── DataTable/
│   │   ├── ForecastChart/
│   │   ├── EvidenceDrawer/
│   │   ├── BudgetSummary/
│   │   ├── ScenarioControl/
│   │   └── AIChat/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── dashboard.ts
│   │   ├── inventory.ts
│   │   ├── purchase.ts
│   │   ├── forecast.ts
│   │   ├── suppliers.ts
│   │   ├── scenarios.ts
│   │   └── ai.ts
│   │
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
│
└── package.json
```

---

# 33. State Ownership

## Backend owns

- Inventory truth
- Sales truth
- Supplier truth
- Budget truth
- Forecast results
- Risk scores
- Purchase recommendations
- Scenario calculations

## Frontend owns

- UI state
- Selected product
- Filters
- Sort order
- Drawer/modal visibility
- Temporary quantity edits
- Chart selections
- Scenario controls before submission
- Chat presentation state

This separation prevents the frontend from accidentally becoming a second business-logic engine.

---

# 34. Purchase Plan Interaction Example

```text
Frontend:
"Buy 50 units"

          ↓

User changes quantity to 60

          ↓

Frontend sends updated quantity / requests recalculation

          ↓

Backend recalculates:

Order value
Budget remaining
Stock coverage
Risk
Expected outcome

          ↓

Backend response

          ↓

Frontend animates:

50 → 60
₹17,500 → ₹21,000
₹2,500 → -₹1,000

          ↓

⚠ Budget exceeded
```

This gives immediate cause-and-effect feedback.

---

# 35. AI Action Flow

AI should support actions but not bypass normal business rules.

```text
User:
"I only have ₹10,000. What should I buy?"

        ↓

AI Intent Detection
        ↓
GET current budget
GET purchase candidates
GET risks
GET supplier constraints
        ↓
Decision Engine
        ↓
Feasible purchase plan
        ↓
LLM Explanation
        ↓
AI response

"Prioritize oil, milk and rice.
5 lower-priority purchases are deferred."

        ↓
[Review Plan]
```

For a real purchase:

```text
AI Recommendation
      ↓
Review Purchase Plan
      ↓
User Confirmation
      ↓
Purchase Order API
```

---

# 36. Hackathon MVP Priority

## P0 — Must Have

### Frontend
- Dashboard
- Purchase Advisor
- Inventory
- Product Detail
- Budget-aware recommendation UI
- AI explanation UI

### Backend
- Database
- Data import
- Sales
- Inventory
- Budget
- Demand forecasting
- Risk engine
- Purchase optimization
- Dashboard APIs
- Purchase APIs
- Recommendation explainability

## P1 — Strong Differentiators

- AI Store Manager
- What-if Simulation
- Supplier optimization
- Forecast visualization
- Background forecast/risk refresh

## P2 — Optional

- Advanced roles
- Barcode workflow
- Advanced analytics
- External integrations
- Sophisticated monitoring

---

# 37. End-to-End Demo Flow

```text
1. Dashboard
   ↓
2. Show limited budget + current risks
   ↓
3. Review Purchase Plan
   ↓
4. Purchase Advisor
   ↓
5. Show prioritized recommendations
   ↓
6. Open product evidence
   ↓
7. Ask AI:
   "I only have ₹10,000. What should I buy?"
   ↓
8. Show budget-constrained recommendation
   ↓
9. Run What-if
   ↓
10. Budget changes
   ↓
11. Purchase plan changes
   ↓
12. Return to Dashboard
   ↓
13. Show reduced stockout risk / protected cash
```

---

# 38. Definition of Done

## Frontend

- User understands store state quickly.
- Recommended purchases are easy to find.
- Every recommendation answers What + How Much + When + Why.
- Budget impact is visible.
- Risk is understandable without technical knowledge.
- AI answers are tied to actual backend data.
- What-if changes visibly update results.
- Loading/error/empty/low-confidence states exist.
- Desktop demo is polished and responsive.

## Backend

- Data can be loaded and validated.
- Demand forecast can be generated.
- Inventory risks can be classified.
- Purchase plan can be generated.
- Budget and supplier constraints are respected.
- Recommendations contain evidence + reason.
- What-if scenarios do not mutate live data.
- AI is grounded in backend data.
- Frontend can retrieve required data through APIs.
- Backend modules are independently testable.

---

# 39. Final System Principle

```text
DATA
 ↓
FORECAST
 ↓
RISK
 ↓
OPTIMIZE
 ↓
DECIDE
 ↓
EXPLAIN
 ↓
ACT
```

### Architectural rule

> **Backend owns the business truth.**  
> **Decision Engine owns the business decision.**  
> **AI explains the decision.**  
> **Frontend makes the decision easy to act on.**

---

## 40. Source Basis

This document consolidates the existing StockWise frontend specification, frontend visual design system, and backend architecture into one connection-focused technical reference.

The frontend specification defines the decision flow, modules, purchase advisor, inventory, forecast, suppliers, what-if analysis and AI Store Manager.  
The visual design specification defines the black/pure-white visual system, semantic colours, animation and UX principles.  
The backend specification defines the modular-monolith architecture, intelligence modules, database, APIs and end-to-end decision flow.

