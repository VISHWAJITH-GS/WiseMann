import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Package, DollarSign, Clock } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, KPICard, Button, RiskBadge } from '../components/common';
import { dashboardAPI, purchaseAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { DashboardSummary, Recommendation } from '../types';

export default function Dashboard() {
  const { setIsLoading, isLoading, setError } = useAppStore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, recsRes] = await Promise.all([
          dashboardAPI.getSummary(),
          purchaseAPI.getRecommendations(),
        ]);
        setSummary(summaryRes.data);
        setRecommendations(recsRes.data.slice(0, 5)); // Top 5
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setIsLoading, setError]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-border border-t-black rounded-full mb-4"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-ink mb-2">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's your store's current situation.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Budget Available"
            value={`₹${summary?.budget.remaining.toLocaleString()}`}
            unit="/ ₹20,000"
            icon={<DollarSign size={24} />}
            trend={{ value: 15, direction: 'up' }}
          />
          <KPICard
            label="Inventory Value"
            value={`₹${(summary?.inventoryValue || 0).toLocaleString()}`}
            icon={<Package size={24} />}
            trend={{ value: 8, direction: 'down' }}
          />
          <KPICard
            label="Stockout Risk"
            value={summary?.stockoutRisk || 0}
            unit="products"
            icon={<AlertCircle size={24} className="text-danger" />}
            trend={{ value: 2, direction: 'down' }}
          />
          <KPICard
            label="Data Freshness"
            value="10 min"
            unit="ago"
            icon={<Clock size={24} />}
          />
        </div>

        {/* Alert Section */}
        {summary && summary.stockoutRisk > 0 && (
          <div className="mb-8 p-4 rounded-lg bg-danger-soft border border-danger flex gap-4">
            <AlertCircle className="text-danger flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-danger mb-1">Immediate Action Required</h3>
              <p className="text-sm text-danger opacity-90">
                {summary.stockoutRisk} products are at high risk of stockout. Review purchase recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Priority Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-ink">Priority Actions</h2>
                <Button variant="secondary" size="sm">View All</Button>
              </div>

              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <div>
                        <p className="font-medium text-text">{rec.quantity} units needed</p>
                        <p className="text-xs text-text-muted">{rec.reason}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <RiskBadge risk={rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low'} />
                        <Button variant="primary" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-text-muted py-8">No priority actions at the moment</p>
              )}
            </Card>
          </div>

          {/* Slow Moving Stock */}
          <Card>
            <h3 className="font-bold text-ink mb-4">Risks Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Slow Moving</span>
                <span className="font-semibold">{summary?.slowStock || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Expiry Risk</span>
                <span className="font-semibold">{summary?.expiryRisk || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Reorder Soon</span>
                <span className="font-semibold">3</span>
              </div>
              <Button variant="secondary" className="w-full mt-4">
                View Inventory
              </Button>
            </div>
          </Card>
        </div>

        {/* Sales vs Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Sales Performance
            </h3>
            <div className="h-64 bg-surface rounded-lg flex items-center justify-center">
              <p className="text-text-muted">Chart visualization coming soon</p>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-ink mb-4">Forecast Accuracy</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">7-day Forecast</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-success h-full rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">14-day Forecast</span>
                  <span className="text-sm font-medium">76%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-warning h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">30-day Forecast</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-danger h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
