import { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button, RiskBadge } from '../components/common';
import { purchaseAPI, dashboardAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { Recommendation, Budget } from '../types';

export default function PurchaseAdvisor() {
  const { setIsLoading, isLoading, clearError } = useAppStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const loadData = async () => {
    try {
      clearError();
      setIsLoading(true);
      const [recsRes, summaryRes] = await Promise.all([
        purchaseAPI.getRecommendations(),
        dashboardAPI.getSummary(),
      ]);
      setRecommendations(recsRes.data);
      setBudget(summaryRes.data.budget);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [setIsLoading, clearError]);

  const totalRecommendedSpend = recommendations.reduce((acc, r) => acc + r.cost, 0);
  const budgetExceeded = totalRecommendedSpend > (budget?.amount || 0);

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-border border-t-black rounded-full mb-4"></div>
            <p className="text-text-secondary">Loading purchase advice...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Purchase Advisor</h1>
          <p className="text-text-secondary">AI-powered recommendations optimized for your budget and risk.</p>
        </div>

        {/* Budget Summary */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-text-muted text-sm mb-2">Available Budget</p>
              <p className="text-2xl font-bold text-ink">₹{budget?.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-muted text-sm mb-2">Recommended Spend</p>
              <p className={`text-2xl font-bold ${budgetExceeded ? 'text-danger' : 'text-success'}`}>
                ₹{totalRecommendedSpend.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-sm mb-2">Remaining</p>
              <p className={`text-2xl font-bold ${budgetExceeded ? 'text-danger' : 'text-success'}`}>
                ₹{Math.max(0, (budget?.remaining || 0) - totalRecommendedSpend).toLocaleString()}
              </p>
            </div>
          </div>
          {budgetExceeded && (
            <div className="mt-4 p-3 bg-warning-soft rounded-lg text-warning text-sm">
              ⚠️ Recommended spend exceeds budget. Lower-priority items have been deferred.
            </div>
          )}
        </Card>

        {/* Recommendations Table */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ink mb-4">Recommendations</h2>
            
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-border rounded-lg">
                  <button
                    onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(rec.id)}
                        onChange={() => handleSelect(rec.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <p className="font-medium text-text">Product #{rec.id}</p>
                        <p className="text-sm text-text-secondary">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-ink">{rec.quantity} units</p>
                        <p className="text-sm text-text-muted">₹{rec.cost.toLocaleString()}</p>
                      </div>
                      <RiskBadge risk={rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low'} />
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${expandedId === rec.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {expandedId === rec.id && (
                    <div className="border-t border-border p-4 bg-surface">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-text-muted mb-1">Current Stock</p>
                          <p className="font-semibold">24 units</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted mb-1">Days of Stock</p>
                          <p className="font-semibold">3 days</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted mb-1">Forecast Demand</p>
                          <p className="font-semibold">68 units</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted mb-1">Buy By</p>
                          <p className="font-semibold">{rec.buyBy}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm">Add to Purchase Plan</Button>
                        <Button variant="secondary" size="sm">View Evidence</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <Button variant="primary" disabled={selectedItems.size === 0}>
              <ShoppingCart size={18} />
              Add {selectedItems.size > 0 ? `${selectedItems.size} Items` : 'to Purchase Plan'}
            </Button>
            <Button variant="secondary">
              View Deferred Items ({recommendations.length - selectedItems.size})
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
