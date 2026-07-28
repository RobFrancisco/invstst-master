import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { dataClient } from '@/lib/data-client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/stockUtils';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const emptyForm = {
  name: '',
  category: 'iPhone',
  model: '',
  storage: '',
  color: '',
  sku: '',
  price: '',
  cost: '',
  quantity: '',
  description: '',
  image_url: '',
};

export default function AddProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const editId = Array.isArray(router.query.edit) ? router.query.edit[0] : router.query.edit || '';

  const { data: existingProduct } = useQuery({
    queryKey: ['product', editId],
    queryFn: async () => {
      if (!editId) return null;
      const products = await dataClient.entities.Product.list();
      return products.find((p) => p.id === editId) || null;
    },
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name || '',
        category: existingProduct.category || 'iPhone',
        model: existingProduct.model || '',
        storage: existingProduct.storage || '',
        color: existingProduct.color || '',
        sku: existingProduct.sku || '',
        price: existingProduct.price?.toString() || '',
        cost: existingProduct.cost?.toString() || '',
        quantity: existingProduct.quantity?.toString() || '',
        description: existingProduct.description || '',
        image_url: existingProduct.image_url || '',
      });
      if (existingProduct.image_url) {
        setImagePreview(existingProduct.image_url);
      }
    }
  }, [existingProduct]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const { file_url } = await dataClient.integrations.Core.UploadFile({ file });
    handleChange('image_url', file_url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.price) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      cost: parseFloat(form.cost) || 0,
      quantity: parseInt(form.quantity) || 0,
    };

    if (editId) {
      await dataClient.entities.Product.update(editId, payload);
      toast({ title: 'Updated', description: 'Product updated successfully' });
    } else {
      await dataClient.entities.Product.create(payload);
      toast({ title: 'Created', description: 'Product added successfully' });
    }

    queryClient.invalidateQueries({ queryKey: ['products'] });
    setSaving(false);
    router.push('/inventory');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{editId ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <div className="space-y-2">
          <Label>Product Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    handleChange('image_url', '');
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-[10px] text-muted-foreground">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="iPhone 15 Pro Max" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input value={form.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="A3090" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Storage</Label>
            <Input value={form.storage} onChange={(e) => handleChange('storage', e.target.value)} placeholder="256GB" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <Input value={form.color} onChange={(e) => handleChange('color', e.target.value)} placeholder="Space Black" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>SKU / Serial</Label>
            <Input value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="APPL-IPH15PM-256-BLK" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Price *</Label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="1199.00" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Cost Price</Label>
            <Input type="number" step="0.01" value={form.cost} onChange={(e) => handleChange('cost', e.target.value)} placeholder="850.00" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} placeholder="25" className="rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Product details..." className="rounded-xl min-h-[80px]" />
        </div>

        <Button type="submit" disabled={saving} className="w-full rounded-xl h-11 gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </div>
  );
}
