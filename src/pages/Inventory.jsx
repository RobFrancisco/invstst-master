import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Plus, Search, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/lib/stockUtils';
import { useToast } from '@/components/ui/use-toast';
import StockLevelBar from '@/components/inventory/StockLevelBar';
import { dataClient } from '@/lib/data-client';

function useMinMaxMap() {
  const { data: minMaxRecords = [] } = useQuery({
    queryKey: ['product-min-max'],
    queryFn: () => dataClient.entities.ProductMinMax.list(),
  });

  return useMemo(() => {
    const map = {};
    minMaxRecords.forEach((record) => {
      if (record.product_id) {
        map[record.product_id] = record;
      }
    });
    return map;
  }, [minMaxRecords]);
}

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const minMaxMap = useMinMaxMap();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => dataClient.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
      setDeleteTarget(null);
    },
  });

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.model?.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }
    if (statusFilter !== 'all') {
      result = result.filter((product) => {
        const mm = minMaxMap[product.id];
        const min = mm?.min_stock ?? 5;
        const qty = product.quantity || 0;
        if (statusFilter === 'below_min') return qty < min;
        if (statusFilter === 'ok') return qty >= min;
        if (statusFilter === 'out') return qty <= 0;
        return true;
      });
    }
    return result;
  }, [products, search, category, statusFilter, minMaxMap]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} products tracked</p>
        </div>
        <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => router.push('/add-product')}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="below_min">Below Min</SelectItem>
            <SelectItem value="ok">In Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No products found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock Level</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const mm = minMaxMap[product.id];
                const min = mm?.min_stock ?? 5;
                const max = mm?.max_stock ?? 50;
                const qty = product.quantity || 0;
                const isBelowMin = qty < min && qty > 0;
                const isOut = qty <= 0;

                return (
                  <tr key={product.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {isBelowMin && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{product.sku || '—'}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-accent text-accent-foreground rounded-md text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4">
                      <StockLevelBar qty={qty} min={min} max={max} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        isOut ? 'bg-red-100 text-red-700' :
                        isBelowMin ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isOut ? 'Out of Stock' : isBelowMin ? 'Below Min' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => router.push(`/add-product?edit=${product.id}`)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(deleteTarget?.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
