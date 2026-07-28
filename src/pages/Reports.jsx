import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, CATEGORIES, CATEGORY_ICONS } from '@/lib/stockUtils';
import StatCard from '@/components/dashboard/StatCard';
import { DollarSign, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { dataClient } from '@/lib/data-client';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export default function Reports() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list(),
  });

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => dataClient.entities.Sale.list(),
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const totalCost = sales.reduce((sum, sale) => sum + ((sale.cost_price || 0) * (sale.quantity || 0)), 0);
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  const categorySales = useMemo(() => {
    const map = {};
    sales.forEach((sale) => {
      const category = sale.product_category || 'Other';
      if (!map[category]) {
        map[category] = { name: category, revenue: 0, profit: 0, units: 0 };
      }
      map[category].revenue += sale.total || 0;
      map[category].profit += sale.profit || 0;
      map[category].units += sale.quantity || 0;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  const inventoryValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 0)), 0);

  const stockDistribution = useMemo(() => {
    return CATEGORIES.map((category) => {
      const items = products.filter((product) => product.category === category);
      return { name: category, value: items.reduce((sum, product) => sum + (product.quantity || 0), 0) };
    }).filter((entry) => entry.value > 0);
  }, [products]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="primary" />
        <StatCard title="Total Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} color="success" />
        <StatCard title="Profit Margin" value={`${margin}%`} icon={ShoppingCart} color="purple" />
        <StatCard title="Inventory Value" value={formatCurrency(inventoryValue)} icon={Package} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Category</h3>
          <div className="h-[280px]">
            {categorySales.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No sales data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Stock Distribution</h3>
          <div className="h-[280px]">
            {stockDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No products</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {stockDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Category Performance</h3>
        {categorySales.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No sales data available</p>
        ) : (
          <div className="space-y-3">
            {categorySales.map((category) => (
              <div key={category.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CATEGORY_ICONS[category.name] || '📦'}</span>
                  <div>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(category.revenue)}</p>
                  <p className="text-xs text-emerald-600">{formatCurrency(category.profit)} profit</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
