import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export default function SalesChart({ sales }) {
  const chartData = useMemo(() => {
    const days = 14;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayStr = format(date, 'yyyy-MM-dd');
      const daySales = (sales || []).filter((s) => {
        const saleDate = format(new Date(s.sale_date || s.created_date), 'yyyy-MM-dd');
        return saleDate === dayStr;
      });
      data.push({
        date: format(date, 'MMM dd'),
        revenue: daySales.reduce((sum, s) => sum + (s.total || 0), 0),
        orders: daySales.length,
      });
    }
    return data;
  }, [sales]);

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground">Revenue (Last 14 Days)</h3>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}