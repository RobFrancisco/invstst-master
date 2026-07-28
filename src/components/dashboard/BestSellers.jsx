import React from 'react';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/stockUtils';
import { TrendingUp } from 'lucide-react';

export default function BestSellers({ sales }) {
  const productSales = {};
  (sales || []).forEach((sale) => {
    if (!productSales[sale.product_id]) {
      productSales[sale.product_id] = {
        name: sale.product_name,
        category: sale.product_category,
        totalQty: 0,
        totalRevenue: 0,
      };
    }
    productSales[sale.product_id].totalQty += sale.quantity || 0;
    productSales[sale.product_id].totalRevenue += sale.total || 0;
  });

  const sorted = Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

  if (sorted.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Best Selling Products</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No sales data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Best Selling Products</h3>
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-base">
                {CATEGORY_ICONS[item.category] || '📦'}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.totalQty} units sold</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(item.totalRevenue)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}