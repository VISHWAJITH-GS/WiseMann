import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Button, Card } from '../components/common';
import { TrendingUp } from 'lucide-react';
import { forecastAPI, productsAPI } from '../services/api';
import type { Forecast as ForecastData, Product } from '../types';

export default function Forecast() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadForecasts = async (productId: string) => {
    if (!productId) return;
    setLoading(true); setError('');
    try {
      const results = await Promise.all([7, 14, 30].map((horizon) => forecastAPI.getByProductId(productId, horizon)));
      setForecasts(results.map((result) => result.data));
    } catch { setError('Unable to load forecasts. Confirm the backend is running on port 8000.'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    productsAPI.getAll().then(({ data }) => { setProducts(data); const id = data[0]?.id; setSelectedId(id || ''); if (id) loadForecasts(id); })
      .catch(() => { setError('Unable to load products.'); setLoading(false); });
  }, []);
  const confidenceClass = (confidence: string) => confidence === 'high' ? 'bg-success-soft text-success' : confidence === 'medium' ? 'bg-warning-soft text-warning' : 'bg-info-soft text-info';
  const trend = forecasts[0]?.trend || 'stable';
  return <MainLayout><div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
    <div className="mb-8"><h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">Demand Forecast</h1><p className="text-text-secondary">7, 14, and 30-day demand predictions with confidence levels.</p></div>
    <Card className="mb-6"><div className="mb-6 flex items-start gap-3 sm:items-center sm:gap-4"><TrendingUp size={24} className="text-ai-primary" /><div><h2 className="text-xl font-bold text-ink">Select a Product</h2><p className="text-text-secondary text-sm">View detailed forecast and trends</p></div></div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row"><select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); loadForecasts(e.target.value); }} className="w-full rounded-lg border border-border px-4 py-2">{products.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select><Button variant="secondary" onClick={() => loadForecasts(selectedId)} loading={loading}>Refresh forecast</Button></div>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{forecasts.map((forecast) => <Card key={forecast.horizon} className="bg-surface"><h3 className="font-bold text-ink mb-2">{forecast.horizon}-Day Forecast</h3><p className="text-2xl font-bold text-ink mb-3">{forecast.predictedDemand} units</p><span className={`text-xs px-2 py-1 rounded ${confidenceClass(forecast.confidence)}`}>{forecast.confidence} confidence</span><div className="mt-5 h-2 rounded-full bg-white overflow-hidden"><div className="h-full bg-ai-primary" style={{ width: `${Math.min(100, forecast.predictedDemand)}%` }} /></div></Card>)}</div>
      {!loading && forecasts.length === 0 && !error && <p className="text-text-muted">Choose a product to view its forecast.</p>}
      {forecasts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><h4 className="font-semibold text-text mb-2">Trend</h4><p className="text-2xl font-bold text-success capitalize">{trend}</p></div><div><h4 className="font-semibold text-text mb-2">Last generated</h4><p className="text-lg text-ink">{new Date(forecasts[0].generatedAt || Date.now()).toLocaleString()}</p></div></div>}
    </Card></div></MainLayout>;
}
