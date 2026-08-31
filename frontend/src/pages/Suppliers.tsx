import MainLayout from '../../components/layout/MainLayout.tsx';
import { Card, Button, DataTable } from '../../components/common';
import { Users, Star } from 'lucide-react';

export default function Suppliers() {
  const suppliers = [
    {
      name: 'ABC Distributors',
      contact: '+91-9876543210',
      price: '₹350',
      lead_time: '2 days',
      reliability: '94%',
      status: 'Active',
    },
    {
      name: 'Fresh Supply Co',
      contact: '+91-8765432109',
      price: '₹360',
      lead_time: '3 days',
      reliability: '87%',
      status: 'Active',
    },
    {
      name: 'Premium Foods Ltd',
      contact: '+91-7654321098',
      price: '₹345',
      lead_time: '1 day',
      reliability: '92%',
      status: 'Active',
    },
  ];

  const columns = [
    { key: 'name', label: 'Supplier', width: '25%' },
    { key: 'contact', label: 'Contact', width: '20%' },
    { key: 'price', label: 'Unit Price', width: '15%' },
    { key: 'lead_time', label: 'Lead Time', width: '15%' },
    { key: 'reliability', label: 'Reliability', width: '15%' },
    { key: 'action', label: 'Action', width: '10%' },
  ];

  const tableData = suppliers.map((supplier) => ({
    name: <div><p className="font-medium">{supplier.name}</p></div>,
    contact: supplier.contact,
    price: supplier.price,
    lead_time: supplier.lead_time,
    reliability: (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-surface rounded-full h-2">
          <div
            className="bg-success h-full rounded-full"
            style={{ width: `${parseInt(supplier.reliability)}%` }}
          ></div>
        </div>
        <span className="text-sm">{supplier.reliability}</span>
      </div>
    ),
    action: <Button variant="secondary" size="sm">View</Button>,
  }));

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Suppliers</h1>
          <p className="text-text-secondary">Compare suppliers by price, lead time, and reliability.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Active Suppliers</p>
                <p className="text-2xl font-bold text-ink">8</p>
              </div>
              <Users size={32} className="text-text-muted opacity-50" />
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-text-muted text-sm mb-1">Avg Lead Time</p>
              <p className="text-2xl font-bold text-ink">2.3 days</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-text-muted text-sm mb-1">Best Reliability</p>
              <p className="text-2xl font-bold text-success">94%</p>
              <p className="text-xs text-text-muted mt-1">ABC Distributors</p>
            </div>
          </Card>
        </div>

        {/* Suppliers Table */}
        <Card>
          <h2 className="text-xl font-bold text-ink mb-6">Supplier Comparison</h2>
          <DataTable columns={columns} data={tableData} />
        </Card>
      </div>
    </MainLayout>
  );
}
