import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, Store, Bell, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dataClient } from '@/lib/data-client';

export default function Settings() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    dataClient.auth.me().then((currentUser) => {
      if (active) setUser(currentUser);
    });

    return () => {
      active = false;
    };
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list('-created_date', 200),
  });

  const lowStockProducts = products.filter((product) => product.quantity > 0 && product.quantity < 5);
  const outOfStockProducts = products.filter((product) => product.quantity <= 0);

  const handleSignOut = () => {
    dataClient.auth.logout();
    toast({ title: 'Signed out', description: 'You are now signed out.' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Profile</h2>
        </div>
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user.full_name || ''} disabled className="rounded-xl bg-accent" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email || ''} disabled className="rounded-xl bg-accent" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user.role || 'user'} disabled className="rounded-xl bg-accent capitalize" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-base font-semibold">Stock Alerts</h2>
        </div>

        {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">All products are well stocked.</p>
        ) : (
          <div className="space-y-2">
            {outOfStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-2 px-3 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700">{product.name}</p>
                  <p className="text-xs text-red-500">Out of stock</p>
                </div>
              </div>
            ))}
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-2 px-3 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-700">{product.name}</p>
                  <p className="text-xs text-amber-500">Only {product.quantity} left in stock</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Account</h2>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
