import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dataClient } from '@/lib/data-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export default function NewSalesModal({ open, onClose, products = [] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState('');
  const [unitPrice, setUnitPrice] = useState(products[0]?.price || 0);
  const [staffName, setStaffName] = useState('Store Staff');
  const [saving, setSaving] = useState(false);
  const [searchProduct, setSearchProduct] = useState(products[0]?.name || '');
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  useEffect(() => {
    if (products.length && !productId) {
      setProductId(products[0].id);
      setSearchProduct(products[0].name || '');
    }
  }, [products, productId]);

  useEffect(() => {
    dataClient.auth.me().then((user) => {
      if (user?.full_name) {
        setStaffName(user.full_name);
      }
    });
  }, []);

  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === productId);
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price || 0);
      setSearchProduct(selectedProduct.name || '');
    }
  }, [productId, products]);

  const selectedProduct = products.find((product) => product.id === productId);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.trim().toLowerCase())
  );

  const handleProductSelection = (product) => {
    setProductId(product.id);
    setUnitPrice(product.price || 0);
    setSearchProduct(product.name || '');
    setShowProductSuggestions(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct || quantity <= 0) {
      toast({ title: 'Invalid sale', description: 'Select a product and enter a valid quantity.', variant: 'destructive' });
      return;
    }

    setSaving(true);

    try {
      await dataClient.entities.Sale.create({
        product_id: selectedProduct.id,
        quantity,
        unit_price: unitPrice,
        customer_name: customer,
        staff_name: staffName,
      });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      toast({ title: 'Sale recorded', description: 'The sale has been successfully logged.' });
      onClose();
    } catch (error) {
      toast({ title: 'Could not save sale', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
          <DialogDescription>Record a sale and update inventory immediately.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-3">
            <Label>Product</Label>
            <div className="relative">
              <Input
                type="text"
                value={searchProduct}
                onFocus={() => setShowProductSuggestions(true)}
                onBlur={() => setTimeout(() => setShowProductSuggestions(false), 150)}
                onChange={(event) => {
                  setSearchProduct(event.target.value);
                  setShowProductSuggestions(true);
                }}
                placeholder="Search product..."
                className="w-full rounded-xl"
              />
              {showProductSuggestions && searchProduct && filteredProducts.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-white shadow-lg">
                  {filteredProducts.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleProductSelection(product);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-foreground hover:bg-muted"
                    >
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Unit price</Label>
              <Input type="number" step="0.01" value={unitPrice} onChange={(event) => setUnitPrice(Number(event.target.value))} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customer</Label>
            <Input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Customer name" className="rounded-xl" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-xl" disabled={saving}>
              {saving ? 'Saving…' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
