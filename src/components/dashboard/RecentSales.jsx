import React from 'react';
import { formatCurrency, formatDate } from '@/lib/stockUtils';
import { ShoppingCart } from 'lucide-react';

export default function RecentSales({ sales }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Sales</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <ShoppingCart className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No sales recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Sales</h3>
      <div className="space-y-3">
        {sales.slice(0, 6).map((sale) => (
          <div key={sale.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                {sale.quantity}x
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{sale.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.customer_name || 'Walk-in'} · {formatDate(sale.sale_date || sale.created_date)}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(sale.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}