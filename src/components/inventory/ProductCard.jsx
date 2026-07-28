import React from 'react';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/stockUtils';
import StockBadge from './StockBadge';
import { Package } from 'lucide-react';

export default function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick?.(product)}
      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-square bg-accent/50 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40">
            <Package className="w-12 h-12 mb-2" />
            <span className="text-3xl">{CATEGORY_ICONS[product.category] || '📦'}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StockBadge quantity={product.quantity} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          {product.color && (
            <span className="text-xs text-muted-foreground">{product.color}</span>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">{product.name}</h3>
        {product.model && (
          <p className="text-xs text-muted-foreground">{product.model} {product.storage && `· ${product.storage}`}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</p>
          <p className="text-xs text-muted-foreground">{product.quantity} in stock</p>
        </div>
      </div>
    </div>
  );
}