import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/stockUtils';
import StockBadge from './StockBadge';
import { Package } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="aspect-video bg-accent rounded-xl overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {CATEGORY_ICONS[product.category] || <Package className="w-12 h-12 text-muted-foreground/30" />}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Model</p>
              <p className="font-medium">{product.model || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Storage</p>
              <p className="font-medium">{product.storage || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Color</p>
              <p className="font-medium">{product.color || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">SKU</p>
              <p className="font-medium font-mono text-xs">{product.sku || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Price</p>
              <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cost</p>
              <p className="font-medium">{formatCurrency(product.cost)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Stock</p>
              <StockBadge quantity={product.quantity} />
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Description</p>
              <p className="text-sm text-foreground">{product.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}