import MainLayout from '../../components/layout/MainLayout.tsx';
import { Card, Button } from '../../components/common';
import { TrendingUp } from 'lucide-react';

export default function Forecast() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Demand Forecast</h1>
          <p className="text-text-secondary">7, 14, and 30-day demand predictions with confidence levels.</p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp size={24} className="text-ai-primary" />
            <div>
              <h2 className="text-xl font-bold text-ink">Select a Product</h2>
              <p className="text-text-secondary text-sm">View detailed forecast and trends</p>
            </div>
          </div>

          <select className="w-full rounded-lg border border-border px-4 py-2 mb-6">
            <option>All Products</option>
            <option>Sunflower Oil 1L</option>
            <option>Rice 10KG</option>
            <option>Milk 500ml</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 7-day Forecast */}
            <Card className="bg-surface">
              <h3 className="font-bold text-ink mb-2">7-Day Forecast</h3>
              <p className="text-2xl font-bold text-ink mb-2">68 units</p>
              <div className="mb-4">
                <span className="text-xs bg-info-soft text-info px-2 py-1 rounded">High Confidence</span>
              </div>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <p className="text-text-muted">Chart</p>
              </div>
            </Card>

            {/* 14-day Forecast */}
            <Card className="bg-surface">
              <h3 className="font-bold text-ink mb-2">14-Day Forecast</h3>
              <p className="text-2xl font-bold text-ink mb-2">145 units</p>
              <div className="mb-4">
                <span className="text-xs bg-warning-soft text-warning px-2 py-1 rounded">Medium Confidence</span>
              </div>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <p className="text-text-muted">Chart</p>
              </div>
            </Card>

            {/* 30-day Forecast */}
            <Card className="bg-surface">
              <h3 className="font-bold text-ink mb-2">30-Day Forecast</h3>
              <p className="text-2xl font-bold text-ink mb-2">320 units</p>
              <div className="mb-4">
                <span className="text-xs bg-info-soft text-info px-2 py-1 rounded">Low Confidence</span>
              </div>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <p className="text-text-muted">Chart</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-text mb-2">Trend</h4>
              <p className="text-2xl font-bold text-success">↑ Increasing</p>
              <p className="text-xs text-text-muted">Strong upward trend detected</p>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-2">Seasonal Pattern</h4>
              <p className="text-lg text-ink">Weekend peak expected</p>
              <p className="text-xs text-text-muted">+30% higher demand on weekends</p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
