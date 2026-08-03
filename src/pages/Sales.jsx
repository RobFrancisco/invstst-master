import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Search, Download, ShoppingCart, Currency } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/stockUtils';
import NewSaleModal from '@/components/sales/NewSalesModal';
import StatCard from '@/components/dashboard/StatCard';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { startOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { dataClient } from '@/lib/data-client';

export default function Sales() {
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list(),
  });

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => dataClient.entities.Sale.list(),
  });

  const filtered = useMemo(() => {
    let result = [...sales];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((sale) =>
        sale.product_name?.toLowerCase().includes(q) ||
        sale.customer_name?.toLowerCase().includes(q)
      );
    }

    if (period !== 'all') {
      const now = new Date();
      let cutoff = null;
      switch (period) {
        case 'today': cutoff = startOfDay(now); break;
        case 'week': cutoff = startOfWeek(now); break;
        case 'month': cutoff = startOfMonth(now); break;
        case '7days': cutoff = subDays(now, 7); break;
        case '30days': cutoff = subDays(now, 30); break;
        default: cutoff = null;
      }
      if (cutoff) {
        result = result.filter((sale) => new Date(sale.sale_date || sale.created_date) >= cutoff);
      }
    }
    return result;
  }, [sales, search, period]);

  const totalRevenue = filtered.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalProfit = filtered.reduce((sum, sale) => sum + (sale.profit || 0), 0);
  const avgOrder = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  const exportCSV = () => {
    const headers = ['Date', 'Product', 'Category', 'Qty', 'Unit Price', 'Total', 'Profit', 'Customer'];
    const rows = filtered.map((sale) => [
      new Date(sale.sale_date || sale.created_date).toISOString(),
      sale.product_name,
      sale.product_category,
      sale.quantity,
      sale.unit_price,
      sale.total,
      sale.profit,
      sale.customer_name || '',
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="rounded-xl gap-2" onClick={() => setShowNew(true)}>
            <PlusCircle className="w-4 h-4" /> New Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue" value={formatCurrency(totalRevenue)} icon={Currency} color="primary" />
        <StatCard title="Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} color="success" />
        <StatCard title="Avg. Order" value={formatCurrency(avgOrder)} icon={BarChart3} color="purple" />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search sales..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl bg-card" />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Qty</TableHead>
                <TableHead className="font-semibold">Unit Price</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Profit</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}><div className="h-8 bg-accent rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No sales found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="text-xs text-muted-foreground">{formatDate(sale.sale_date || sale.created_date)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{sale.product_name}</p>
                        <p className="text-xs text-muted-foreground">{sale.product_category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{sale.quantity}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(sale.unit_price)}</TableCell>
                    <TableCell className="text-sm font-semibold">{formatCurrency(sale.total)}</TableCell>
                    <TableCell className={`text-sm font-medium ${(sale.profit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(sale.profit)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sale.customer_name || 'Walk-in'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewSaleModal open={showNew} onClose={() => setShowNew(false)} products={products} />
    </div>
  );
}
