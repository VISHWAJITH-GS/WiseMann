import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Package, DollarSign, Clock } from 'lucide-react';
import { MagicButton } from '@dotdo/magicui/button';
import { Background } from '@dotdo/magicui/background';
import { Text } from '@dotdo/magicui/text';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button, RiskBadge } from '../components/common';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card as TremorCard, Metric, Text as TremorText, Flex, BadgeDelta, ProgressBar } from '@tremor/react';

const salesData = [
  { date: 'Jan', Sales: 2890, Target: 2400 },
  { date: 'Feb', Sales: 2756, Target: 2400 },
  { date: 'Mar', Sales: 3322, Target: 2400 },
  { date: 'Apr', Sales: 3470, Target: 2400 },
  { date: 'May', Sales: 3475, Target: 2400 },
  { date: 'Jun', Sales: 3129, Target: 2400 },
  { date: 'Jul', Sales: 3490, Target: 2400 },
];
import { dashboardAPI, purchaseAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { DashboardSummary, Recommendation } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { setIsLoading, isLoading, clearError } = useAppStore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const budgetRemaining = summary?.budget?.remaining ?? 0;
  const inventoryValue = summary?.inventoryValue ?? 0;
  const stockoutRisk = summary?.stockoutRisk ?? 0;
  const slowStock = summary?.slowStock ?? 0;
  const expiryRisk = summary?.expiryRisk ?? 0;

  const loadData = async () => {
    try {
      clearError();
      setIsLoading(true);
      const [summaryRes, recsRes] = await Promise.all([
        dashboardAPI.getSummary(),
        purchaseAPI.getRecommendations(),
      ]);
      setSummary(summaryRes.data);
      setRecommendations(recsRes.data.slice(0, 5)); // Top 5
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [setIsLoading, clearError]);

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
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="absolute inset-0 -z-10">
          <Background
            variant="particles"
            className="opacity-60"
            quantity={28}
            size={1.6}
            color="rgba(99, 102, 241, 0.35)"
            vx={0.08}
            vy={0.12}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-7xl p-4 sm:p-6"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-black tracking-[-0.06em] text-black sm:text-4xl md:text-5xl">
              <Text
                variant="aurora"
                colors={['#000000', '#111827', '#374151']}
                className="font-black tracking-[-0.06em]"
              >
                Dashboard
              </Text>
            </h1>
            <p className="text-sm text-slate-600">Welcome back. Here's your current store overview.</p>
          </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Budget Available',
              value: `₹${budgetRemaining.toLocaleString()}`,
              unit: '/ ₹20,000',
              icon: <DollarSign size={24} />,
              trend: { value: 15, direction: 'up' as const },
            },
            {
              label: 'Inventory Value',
              value: `₹${inventoryValue.toLocaleString()}`,
              icon: <Package size={24} />,
              trend: { value: 8, direction: 'down' as const },
            },
            {
              label: 'Stockout Risk',
              value: stockoutRisk,
              unit: 'products',
              icon: <AlertCircle size={24} className="text-danger" />,
              trend: { value: 2, direction: 'down' as const },
            },
            {
              label: 'Data Freshness',
              value: '10 min',
              unit: 'ago',
              icon: <Clock size={24} />,
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <TremorCard decoration="top" decorationColor="indigo" className="h-full bg-white/75 backdrop-blur-sm border-slate-200/80 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <Flex alignItems="start">
                  <TremorText>{item.label}</TremorText>
                  {item.trend && (
                    <BadgeDelta deltaType={item.trend.direction === 'up' ? 'moderateIncrease' : 'moderateDecrease'}>
                      {item.trend.value}%
                    </BadgeDelta>
                  )}
                </Flex>
                <Flex className="truncate mt-4 gap-x-2" justifyContent="start" alignItems="baseline">
                  <Metric className="truncate">{item.value}</Metric>
                  {item.unit && <TremorText className="truncate">{item.unit}</TremorText>}
                </Flex>
              </TremorCard>
            </motion.div>
          ))}
        </div>

        {/* Alert Section */}
        {stockoutRisk > 0 && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-danger bg-danger-soft p-4 sm:gap-4">
            <AlertCircle className="text-danger flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-danger mb-1">Immediate Action Required</h3>
              <p className="text-sm text-danger opacity-90">
                {stockoutRisk} products are at high risk of stockout. Review purchase recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Priority Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-ink">Priority Actions</h2>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/purchase-advisor')}>View All</Button>
                </div>

                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.2 }}
                        className="flex flex-col items-start justify-between gap-3 rounded-lg bg-surface p-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-medium text-text">{rec.quantity} units needed</p>
                          <p className="text-xs text-text-muted">{rec.reason}</p>
                        </div>
                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                          <RiskBadge risk={rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low'} />
                          <MagicButton onClick={() => navigate('/purchase-advisor')} variant="rainbow" className="h-9 px-4 text-xs rounded-lg">
                            View
                          </MagicButton>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-text-muted py-8">No priority actions at the moment</p>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Slow Moving Stock */}
          <Card>
            <h3 className="font-bold text-ink mb-4">Risks Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Slow Moving</span>
                <span className="font-semibold">{slowStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Expiry Risk</span>
                <span className="font-semibold">{expiryRisk}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Reorder Soon</span>
                <span className="font-semibold">3</span>
              </div>
              <MagicButton onClick={() => navigate('/inventory')} variant="shimmer" className="mt-4 w-full rounded-lg">
                View Inventory
              </MagicButton>
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
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#1F1F1F' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <Area type="monotone" dataKey="Sales" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-ink mb-4">Forecast Accuracy</h3>
            <div className="space-y-5">
              <div>
                <Flex className="mb-2">
                  <TremorText>7-day Forecast</TremorText>
                  <TremorText className="font-medium">87%</TremorText>
                </Flex>
                <ProgressBar value={87} color="emerald" />
              </div>
              <div>
                <Flex className="mb-2">
                  <TremorText>14-day Forecast</TremorText>
                  <TremorText className="font-medium">76%</TremorText>
                </Flex>
                <ProgressBar value={76} color="amber" />
              </div>
              <div>
                <Flex className="mb-2">
                  <TremorText>30-day Forecast</TremorText>
                  <TremorText className="font-medium">65%</TremorText>
                </Flex>
                <ProgressBar value={65} color="rose" />
              </div>
            </div>
          </Card>
        </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
