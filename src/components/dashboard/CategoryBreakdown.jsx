import React, { useMemo } from 'react';
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/stockUtils';

export default function CategoryBreakdown({ products }) {
  const data = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = (products || []).filter((p) => p.category === cat);
      return {
        category: cat,
        icon: CATEGORY_ICONS[cat],
        count: items.length,
        stock: items.reduce((s, p) => s + (p.quantity || 0), 0),
      };
    }).filter((d) => d.count > 0);
  }, [products]);

  const maxStock = Math.max(...data.map((d) => d.stock), 1);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No products yet</p>
        ) : (
          data.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="font-medium text-foreground">{item.category}</span>
                </span>
                <span className="text-muted-foreground text-xs">{item.count} products · {item.stock} units</span>
              </div>
              <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(item.stock / maxStock) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}