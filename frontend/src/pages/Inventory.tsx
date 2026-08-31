import { useState, useEffect } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button, DataTable, Input, RiskBadge } from '../components/common';
import { inventoryAPI, productsAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { Product, Inventory } from '../types';

interface InventoryItem extends Product {
  inventory: Inventory;
}

export default function Inventory() {
  const { setIsLoading, isLoading } = useAppStore();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productsRes = await productsAPI.getAll();
        
        // Fetch inventory for each product
        const itemsWithInventory = await Promise.all(
          productsRes.data.map(async (product) => {
            try {
              const invRes = await inventoryAPI.getByProductId(product.id);
              return { ...product, inventory: invRes.data };
            } catch {
              return {
                ...product,
                inventory: {
                  currentStock: 0,
                  inventoryValue: 0,
                  daysOfStock: 0,
                  expiryRisk: false,
                },
              };
            }
          })
        );
        
        setItems(itemsWithInventory);
        setFilteredItems(itemsWithInventory);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [setIsLoading]);

  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (riskFilter !== 'all') {
      filtered = filtered.filter((item) => {
        if (riskFilter === 'high') return item.inventory.daysOfStock < 3;
        if (riskFilter === 'medium') return item.inventory.daysOfStock >= 3 && item.inventory.daysOfStock < 7;
        return item.inventory.daysOfStock >= 7;
      });
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, riskFilter, items]);

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'stock', label: 'Stock' },
    { key: 'dos', label: 'Days of Stock' },
    { key: 'value', label: 'Inventory Value' },
    { key: 'risk', label: 'Risk' },
  ];

  const tableData = filteredItems.map((item) => ({
    name: <div><p className="font-medium">{item.name}</p><p className="text-xs text-text-muted">{item.id}</p></div>,
    sku: item.sku,
    stock: `${item.inventory.currentStock} ${item.unit}`,
    dos: <span className={item.inventory.daysOfStock < 3 ? 'text-danger font-semibold' : ''}>{item.inventory.daysOfStock} days</span>,
    value: `₹${item.inventory.inventoryValue.toLocaleString()}`,
    risk: item.inventory.daysOfStock < 3 ? <RiskBadge risk="high" /> : item.inventory.daysOfStock < 7 ? <RiskBadge risk="medium" /> : <RiskBadge risk="low" />,
  }));

  if (isLoading) {
    return <MainLayout><div className="p-6">Loading...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Inventory</h1>
          <p className="text-text-secondary">Monitor stock levels and identify risks.</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={<Search size={18} />}
            />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-lg border border-border px-3 py-2"
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={18} />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <h2 className="text-xl font-bold text-ink mb-4">Products ({filteredItems.length})</h2>
          {filteredItems.length > 0 ? (
            <DataTable columns={columns} data={tableData} />
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
              <p className="text-text-secondary">No products found</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
