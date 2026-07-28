import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/stockUtils';
import StockBadge from '@/components/inventory/StockBadge';
import { dataClient } from '@/lib/data-client';

export default function ManageProducts() {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataClient.entities.Product.list(),
  });

  const filtered = products.filter((product) => {
    const q = search.toLowerCase();
    return (
      !q ||
      product.name?.toLowerCase().includes(q) ||
      product.sku?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dataClient.entities.Product.delete(deleteTarget.id);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({ title: 'Deleted', description: `${deleteTarget.name} has been removed` });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => router.push('/add-product')}>
          <PlusCircle className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl bg-card"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}><div className="h-8 bg-accent rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found</TableCell>
                </TableRow>
              ) : (
                filtered.map((product) => (
                  <TableRow key={product.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-xs text-muted-foreground">
                            {product.name?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          {product.model && <p className="text-xs text-muted-foreground">{product.model}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{product.sku || '—'}</TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-sm">{product.quantity}</TableCell>
                    <TableCell><StockBadge quantity={product.quantity} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => router.push(`/add-product?edit=${product.id}`)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => setDeleteTarget(product)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
