import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/stockUtils';

export default function InventoryFilters({ search, setSearch, category, setCategory, status, setStatus, sort, setSort }) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-card border-border rounded-xl"
        />
      </div>

      <div className="flex gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl bg-card">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">In Stock</SelectItem>
            <SelectItem value="overstock">Overstock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl bg-card">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low–High</SelectItem>
            <SelectItem value="price-desc">Price: High–Low</SelectItem>
            <SelectItem value="stock-asc">Stock: Low–High</SelectItem>
            <SelectItem value="stock-desc">Stock: High–Low</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}