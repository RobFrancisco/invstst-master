import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, X } from 'lucide-react';
import { dataClient } from '@/lib/data-client';
import { useToast } from '@/components/ui/use-toast';

const STATUS_TABS = ['Pending', 'Ordered', 'Received', 'Dismissed', 'All'];
const priorityColors = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700',
};
const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Ordered: 'bg-blue-100 text-blue-700',
  Received: 'bg-emerald-100 text-emerald-700',
  Dismissed: 'bg-gray-100 text-gray-600',
};

export default function ReorderAlerts() {
  const [activeTab, setActiveTab] = useState('Pending');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['reorder-alerts'],
    queryFn: () => dataClient.entities.ReorderAlert.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => dataClient.entities.ReorderAlert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reorder-alerts'] }),
  });

  const filtered = useMemo(() => {
    if (activeTab === 'All') return alerts;
    return alerts.filter((alert) => alert.status === activeTab);
  }, [alerts, activeTab]);

  const counts = useMemo(() => {
    const countMap = {};
    STATUS_TABS.forEach((tab) => {
      countMap[tab] = tab === 'All' ? alerts.length : alerts.filter((alert) => alert.status === tab).length;
    });
    return countMap;
  }, [alerts]);

  const handleMarkOrdered = (alert) => {
    updateMutation.mutate({ id: alert.id, data: { status: 'Ordered' } });
    toast({ title: 'Marked as Ordered' });
  };

  const handleDismiss = (alert) => {
    updateMutation.mutate({ id: alert.id, data: { status: 'Dismissed' } });
    toast({ title: 'Alert dismissed' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reorder Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Min-Max algorithm triggered reorder suggestions</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-accent'
            }`}
          >
            {tab} <span className="ml-1 opacity-70">({counts[tab] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No alerts in this category</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Min / Max</th>
                <th className="text-left px-4 py-3">Reorder Qty</th>
                <th className="text-left px-4 py-3">Est. Cost</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((alert) => {
                const dateLabel = alert.alert_date
                  ? new Date(alert.alert_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
                  : '—';
                return (
                  <tr key={alert.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">{alert.product_name}</td>
                    <td className="px-4 py-4 font-bold text-red-500">{alert.current_stock}</td>
                    <td className="px-4 py-4 text-muted-foreground">{alert.min_stock} / {alert.max_stock}</td>
                    <td className="px-4 py-4 font-bold text-primary">{alert.reorder_qty}</td>
                    <td className="px-4 py-4">{alert.estimated_cost?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[alert.priority] || 'bg-gray-100 text-gray-600'}`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[alert.status] || ''}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{dateLabel}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {alert.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleMarkOrdered(alert)}
                            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                            title="Mark as Ordered"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                        {(alert.status === 'Pending' || alert.status === 'Ordered') && (
                          <button
                            type="button"
                            onClick={() => handleDismiss(alert)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
