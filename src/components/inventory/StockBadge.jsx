import React from 'react';
import { getStockStatus, getStockBadgeClasses } from '@/lib/stockUtils';
import { cn } from '@/lib/utils';

export default function StockBadge({ quantity }) {
  const status = getStockStatus(quantity);
  const classes = getStockBadgeClasses(quantity);

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", classes)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}