import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, AlertTriangle, TrendingUp, DollarSign, Boxes } from 'lucide-react';
import { formatCurrency } from '@/lib/stockUtils';
import StatCard from '@/components/dashboard/StatCard';
import RecentSales from '@/components/dashboard/RecentSales';
import BestSellers from '@/components/dashboard/BestSellers';
import SalesChart from '@/components/dashboard/SalesChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { dataClient } from '@/lib/data-client';

export default function Dashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list('-created_date', 100),
  });

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => dataClient.entities.Sale.list('-created_date', 100),
  });

  const totalStock = products.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const lowStock = products.filter((item) => item.quantity > 0 && item.quantity < 5).length;
  const overstock = products.filter((item) => item.quantity > 50).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your Apple products inventory & sales</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Products" value={products.length} icon={Package} color="primary" />
        <StatCard title="Total Sales" value={sales.length} icon={ShoppingCart} color="success" />
        <StatCard title="Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="purple" />
        <StatCard title="Total Stock" value={totalStock.toLocaleString()} icon={Boxes} color="primary" />
        <StatCard title="Low Stock" value={lowStock} icon={AlertTriangle} color="danger" />
        <StatCard title="Overstock" value={overstock} icon={TrendingUp} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart sales={sales} />
        </div>
        <CategoryBreakdown products={products} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentSales sales={sales} />
        <BestSellers sales={sales} />
      </div>
    </div>
  );
}
