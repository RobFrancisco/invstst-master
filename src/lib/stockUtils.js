export function getStockStatus(quantity) {
  if (quantity <= 0) return { label: 'Out of Stock', color: 'destructive', dot: 'bg-red-500' };
  if (quantity < 5) return { label: 'Low Stock', color: 'destructive', dot: 'bg-red-500' };
  if (quantity <= 15) return { label: 'Medium', color: 'warning', dot: 'bg-amber-500' };
  if (quantity <= 50) return { label: 'In Stock', color: 'success', dot: 'bg-emerald-500' };
  return { label: 'Overstock', color: 'info', dot: 'bg-blue-500' };
}

export function getStockBadgeClasses(quantity) {
  const status = getStockStatus(quantity);
  const map = {
    destructive: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return map[status.color] || '';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount || 0);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const CATEGORIES = ['iPhone', 'Android', 'iPad', 'Tablet', 'MacBook', 'Apple Watch', 'AirPods', 'Accessories', 'Other'];

export const CATEGORY_ICONS = {
  iPhone: '📱',
  Android: '🤖',
  iPad: '📲',
  Tablet: '🧩',
  MacBook: '💻',
  'Apple Watch': '⌚',
  AirPods: '🎧',
  Accessories: '🔌',
  Other: '📦',
};