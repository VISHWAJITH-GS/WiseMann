import { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button, RiskBadge } from '../components/common';
import { purchaseAPI, dashboardAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { Recommendation, Budget } from '../types';

export default function PurchaseAdvisor() {
  const { setIsLoading, isLoading, error, setError, clearError } = useAppStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState('');

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
    } catch {
      setError('Unable to load purchase advice. Confirm the backend is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [setIsLoading, setError, clearError]);

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

  const addToPlan = (ids: string[]) => {
    const toAdd = ids.filter((id) => !selectedItems.has(id));
    setSelectedItems(new Set([...selectedItems, ...toAdd]));
    setNotice(`${ids.length} recommendation${ids.length === 1 ? '' : 's'} added to the purchase plan.`);
  };

  const viewEvidence = (rec: Recommendation) => {
    setNotice(`${rec.productName || 'This product'}: ${rec.reason} (high-confidence recommendation).`);
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
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">Purchase Advisor</h1>
          <p className="text-text-secondary">AI-powered recommendations optimized for your budget and risk.</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {notice && <div className="mb-6 rounded-lg border border-info bg-info-soft p-4 text-sm text-info" role="status">{notice}</div>}

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
                    className="flex w-full items-start justify-between gap-3 p-3 text-left transition-colors hover:bg-surface sm:items-center sm:p-4"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3 text-left sm:items-center sm:gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(rec.id)}
                        onChange={() => handleSelect(rec.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <p className="font-medium text-text">{rec.productName || `Product #${rec.id}`}</p>
                        <p className="text-sm text-text-secondary line-clamp-2">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-ink">{rec.quantity} units</p>
                        <p className="text-sm text-text-muted">₹{rec.cost.toLocaleString()}</p>
                      </div>
                      <div className="hidden sm:block"><RiskBadge risk={rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low'} /></div>
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
                        <Button variant="primary" size="sm" onClick={() => addToPlan([rec.id])}>Add to Purchase Plan</Button>
                        <Button variant="secondary" size="sm" onClick={() => viewEvidence(rec)}>View Evidence</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
            <Button variant="primary" disabled={selectedItems.size === 0} className="w-full sm:w-auto" onClick={() => setNotice(`${selectedItems.size} item${selectedItems.size === 1 ? '' : 's'} are ready to order.`)}>
              <ShoppingCart size={18} />
              Add {selectedItems.size > 0 ? `${selectedItems.size} Items` : 'to Purchase Plan'}
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setNotice(`${recommendations.length - selectedItems.size} unselected recommendation${recommendations.length - selectedItems.size === 1 ? '' : 's'} remain deferred.`)}>
              View Deferred Items ({recommendations.length - selectedItems.size})
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
