import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-blue-500/10 text-blue-600',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    danger: 'bg-red-500/10 text-red-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trendLabel && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}