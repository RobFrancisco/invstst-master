import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/stockUtils';
import { dataClient } from '@/lib/data-client';

const typeConfig = {
  sale: { label: 'Customer sale', icon: ArrowUpRight, bg: 'bg-red-100', text: 'text-red-500' },
  restock: { label: 'Restock', icon: ArrowDownLeft, bg: 'bg-emerald-100', text: 'text-emerald-600' },
  adjustment: { label: 'Adjustment', icon: ArrowUpRight, bg: 'bg-amber-100', text: 'text-amber-600' },
  return: { label: 'Return', icon: ArrowDownLeft, bg: 'bg-blue-100', text: 'text-blue-600' },
};

export default function StockMovements() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: () => dataClient.entities.StockMovement.list('-movement_date', 200),
  });

  const filtered = useMemo(() => {
    let result = [...movements];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((movement) =>
        movement.product_name?.toLowerCase().includes(q) || movement.reference?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter((movement) => movement.type === typeFilter);
    }
    return result;
  }, [movements, search, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stock Movements</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all inventory changes</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by product or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="restock">Restock</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="return">Return</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No movements found</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((movement) => {
              const cfg = typeConfig[movement.type] || typeConfig.sale;
              const Icon = cfg.icon;
              const isPositive = movement.quantity_change > 0;
              const formattedDate = movement.movement_date
                ? new Date(movement.movement_date).toLocaleDateString('en-PH', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })
                : '—';

              return (
                <div key={movement.id} className="flex items-center gap-4 px-5 py-4 hover:bg-accent/40 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{movement.product_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cfg.label}{movement.reference ? ` • ${movement.reference}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{movement.quantity_change}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
