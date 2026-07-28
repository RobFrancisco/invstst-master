import React from 'react';

export default function StockLevelBar({ qty, min, max }) {
  const safeMax = max > 0 ? max : 50;
  const pct = Math.min(100, (qty / safeMax) * 100);
  const isBelowMin = qty < min && qty > 0;
  const isOut = qty <= 0;

  const barColor = isOut
    ? 'bg-red-500'
    : isBelowMin
    ? 'bg-red-400'
    : 'bg-emerald-500';

  const textColor = isOut
    ? 'text-red-500'
    : isBelowMin
    ? 'text-amber-600'
    : 'text-emerald-600';

  return (
    <div className="space-y-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-3">
        <span className={`font-semibold text-xs ${textColor}`}>{qty} units</span>
        <span className="text-xs text-muted-foreground">{min} — {max}</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.max(pct, isOut ? 0 : 4)}%` }}
        />
      </div>
    </div>
  );
}