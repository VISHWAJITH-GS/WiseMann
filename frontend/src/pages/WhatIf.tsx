import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button, Input } from '../components/common';
import { GitBranch, Zap } from 'lucide-react';

export default function WhatIf() {
  const [scenarioName, setScenarioName] = useState('Budget Reduction');
  const [budget, setBudget] = useState(10000);
  const [demand, setDemand] = useState(0);
  const [supplierPrice, setSupplierPrice] = useState(0);

  const baselineMetrics = {
    spend: 17500,
    stockout: 2,
    excess: 31500,
    purchases: 8,
  };

  const scenarioMetrics = {
    spend: 9800,
    stockout: 4,
    excess: 22000,
    purchases: 5,
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">What-if Analysis</h1>
          <p className="text-text-secondary">Simulate different scenarios without affecting live data.</p>
        </div>

        {/* Scenario Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <GitBranch size={20} />
              Scenario Parameters
            </h2>

            <div className="space-y-4">
              <Input
                label="Scenario Name"
                value={scenarioName}
                onChange={setScenarioName}
                placeholder="e.g., Budget Reduction"
              />

              <div>
                <label className="text-sm font-medium text-text mb-2 block">
                  Budget: ₹{budget.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="30000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>₹5,000</span>
                  <span>₹30,000</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-2 block">
                  Demand Change: {demand > 0 ? '+' : ''}{demand}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="10"
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>-50%</span>
                  <span>+50%</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text mb-2 block">
                  Supplier Price Change: {supplierPrice > 0 ? '+' : ''}{supplierPrice}%
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>-30%</span>
                  <span>+30%</span>
                </div>
              </div>

              <Button variant="primary" className="w-full gap-2">
                <Zap size={18} />
                Run Scenario
              </Button>
            </div>
          </Card>

          {/* Comparison */}
          <Card>
            <h2 className="text-xl font-bold text-ink mb-6">Baseline vs Scenario</h2>

            <div className="space-y-4">
              {/* Spend */}
              <div className="pb-4 border-b border-border">
                <p className="text-text-secondary text-sm mb-2">Recommended Spend</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Baseline</p>
                    <p className="text-lg font-bold text-ink">₹{baselineMetrics.spend.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Scenario</p>
                    <p className="text-lg font-bold text-success">₹{scenarioMetrics.spend.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-success mt-2">-₹{(baselineMetrics.spend - scenarioMetrics.spend).toLocaleString()}</p>
              </div>

              {/* Stockout Risk */}
              <div className="pb-4 border-b border-border">
                <p className="text-text-secondary text-sm mb-2">Stockout Risk</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Baseline</p>
                    <p className="text-lg font-bold text-ink">{baselineMetrics.stockout} products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Scenario</p>
                    <p className="text-lg font-bold text-danger">{scenarioMetrics.stockout} products</p>
                  </div>
                </div>
                <p className="text-xs text-danger mt-2">+{scenarioMetrics.stockout - baselineMetrics.stockout} products</p>
              </div>

              {/* Excess Stock */}
              <div className="pb-4 border-b border-border">
                <p className="text-text-secondary text-sm mb-2">Excess Stock Value</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Baseline</p>
                    <p className="text-lg font-bold text-ink">₹{baselineMetrics.excess.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Scenario</p>
                    <p className="text-lg font-bold text-warning">₹{scenarioMetrics.excess.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Purchases */}
              <div>
                <p className="text-text-secondary text-sm mb-2">Number of Purchases</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Baseline</p>
                    <p className="text-lg font-bold text-ink">{baselineMetrics.purchases}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Scenario</p>
                    <p className="text-lg font-bold text-ink">{scenarioMetrics.purchases}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Export */}
        <div className="text-center">
          <Button variant="secondary">Export Scenario Report</Button>
        </div>
      </div>
    </MainLayout>
  );
}
