const STORAGE_KEY = 'invstst-local-data-v1';

const defaultData = {
  products: [
    {
      id: 'prod-1',
      name: 'iPhone 15 Pro',
      category: 'iPhone',
      model: 'A3090',
      storage: '256GB',
      color: 'Space Black',
      sku: 'IPH15P-256-BLK',
      price: 1199,
      cost: 850,
      quantity: 12,
      description: 'Apple iPhone 15 Pro with advanced camera system.',
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      created_date: '2024-06-01T10:00:00.000Z',
    },
    {
      id: 'prod-2',
      name: 'iPhone 15',
      category: 'iPhone',
      model: 'A3084',
      storage: '128GB',
      color: 'Starlight',
      sku: 'IPH15-128-STL',
      price: 899,
      cost: 620,
      quantity: 8,
      description: 'Apple iPhone 15 with flexible performance.',
      image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3d8408a9?auto=format&fit=crop&w=400&q=80',
      created_date: '2024-06-02T08:00:00.000Z',
    },
    {
      id: 'prod-3',
      name: 'iPhone 15 Plus',
      category: 'iPhone',
      model: 'A3085',
      storage: '256GB',
      color: 'Blue',
      sku: 'IPH15P-256-BLU',
      price: 999,
      cost: 690,
      quantity: 3,
      description: 'Large-screen iPhone for everyday productivity.',
      image_url: 'https://images.unsplash.com/photo-1512499617640-c2f999b4e3bd?auto=format&fit=crop&w=400&q=80',
      created_date: '2024-06-03T11:30:00.000Z',
    },
  ],
  sales: [
    {
      id: 'sale-1',
      product_id: 'prod-1',
      product_name: 'iPhone 15 Pro',
      product_category: 'iPhone',
      quantity: 1,
      unit_price: 1199,
      total: 1199,
      profit: 349,
      cost_price: 850,
      customer_name: 'Taylor',
      sale_date: '2024-06-05T14:20:00.000Z',
      created_date: '2024-06-05T14:20:00.000Z',
    },
    {
      id: 'sale-2',
      product_id: 'prod-2',
      product_name: 'iPhone 15',
      product_category: 'iPhone',
      quantity: 2,
      unit_price: 899,
      total: 1798,
      profit: 558,
      cost_price: 620,
      customer_name: 'Jordan',
      sale_date: '2024-06-04T11:15:00.000Z',
      created_date: '2024-06-04T11:15:00.000Z',
    },
  ],
  stockMovements: [
    {
      id: 'mov-1',
      product_id: 'prod-1',
      product_name: 'iPhone 15 Pro',
      type: 'sale',
      quantity_change: -1,
      reference: 'sale-1',
      movement_date: '2024-06-05T14:20:00.000Z',
    },
    {
      id: 'mov-2',
      product_id: 'prod-2',
      product_name: 'iPhone 15',
      type: 'sale',
      quantity_change: -2,
      reference: 'sale-2',
      movement_date: '2024-06-04T11:15:00.000Z',
    },
  ],
  reorderAlerts: [
    {
      id: 'alert-1',
      product_id: 'prod-3',
      product_name: 'iPhone 15 Plus',
      current_stock: 3,
      min_stock: 5,
      max_stock: 30,
      reorder_qty: 20,
      estimated_cost: 13800,
      priority: 'High',
      status: 'Pending',
      alert_date: '2024-06-07T10:00:00.000Z',
    },
  ],
  user: {
    id: 'user-1',
    full_name: 'Inventory Manager',
    email: 'hello@appleinventory.com',
    role: 'admin',
  },
};

const isBrowser = typeof window !== 'undefined';

const cloneData = (value) => JSON.parse(JSON.stringify(value));

function loadStorageData() {
  if (!isBrowser) return cloneData(defaultData);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return cloneData(defaultData);
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to read local data store:', error);
    return cloneData(defaultData);
  }
}

function saveStorageData(data) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to persist local data store:', error);
  }
}

function createId() {
  if (isBrowser && typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortByDate(items = [], dateField = 'created_date', order = '-created_date') {
  const sorted = [...items].sort((a, b) => {
    const aDate = new Date(a[dateField] || 0).valueOf();
    const bDate = new Date(b[dateField] || 0).valueOf();
    return aDate - bDate;
  });
  if (order && order.startsWith('-')) sorted.reverse();
  return sorted;
}

function getData() {
  return loadStorageData();
}

function persistData(data) {
  saveStorageData(data);
  return cloneData(data);
}

const dataClient = {
  entities: {
    Product: {
      list: async (order = '-created_date') => {
        const data = getData();
        return sortByDate(data.products, 'created_date', order);
      },
      create: async (product) => {
        const data = getData();
        const created = {
          ...product,
          id: createId(),
          created_date: new Date().toISOString(),
        };
        data.products.unshift(created);
        persistData(data);
        return created;
      },
      update: async (id, updates) => {
        const data = getData();
        const index = data.products.findIndex((item) => item.id === id);
        if (index === -1) throw new Error('Product not found');
        data.products[index] = { ...data.products[index], ...updates };
        persistData(data);
        return data.products[index];
      },
      delete: async (id) => {
        const data = getData();
        data.products = data.products.filter((item) => item.id !== id);
        data.sales = data.sales.filter((sale) => sale.product_id !== id);
        data.stockMovements = data.stockMovements.filter((movement) => movement.product_id !== id);
        data.reorderAlerts = data.reorderAlerts.filter((alert) => alert.product_id !== id);
        persistData(data);
        return { id };
      },
    },
    ProductMinMax: {
      list: async () => {
        const data = getData();
        return data.products.map((product) => ({
          product_id: product.id,
          min_stock: 5,
          max_stock: 50,
        }));
      },
    },
    Sale: {
      list: async (order = '-created_date') => {
        const data = getData();
        return sortByDate(data.sales, 'created_date', order);
      },
      create: async ({ product_id, quantity, unit_price, customer_name }) => {
        const data = getData();
        const product = data.products.find((item) => item.id === product_id);
        if (!product) throw new Error('Product not found');
        const qty = Number(quantity) || 0;
        const sale = {
          id: createId(),
          product_id,
          product_name: product.name,
          product_category: product.category,
          quantity: qty,
          unit_price: Number(unit_price) || 0,
          total: qty * (Number(unit_price) || 0),
          profit: qty * ((Number(unit_price) || 0) - (Number(product.cost) || 0)),
          cost_price: Number(product.cost) || 0,
          customer_name: customer_name || 'Walk-in',
          sale_date: new Date().toISOString(),
          created_date: new Date().toISOString(),
        };
        product.quantity = Math.max(0, (Number(product.quantity) || 0) - qty);
        data.sales.unshift(sale);
        data.stockMovements.unshift({
          id: createId(),
          product_id,
          product_name: product.name,
          type: 'sale',
          quantity_change: -qty,
          reference: sale.id,
          movement_date: new Date().toISOString(),
        });
        persistData(data);
        return sale;
      },
    },
    StockMovement: {
      list: async (order = '-movement_date') => {
        const data = getData();
        return sortByDate(data.stockMovements, 'movement_date', order);
      },
    },
    ReorderAlert: {
      list: async (order = '-alert_date') => {
        const data = getData();
        return sortByDate(data.reorderAlerts, 'alert_date', order);
      },
      update: async (id, updates) => {
        const data = getData();
        const index = data.reorderAlerts.findIndex((item) => item.id === id);
        if (index === -1) throw new Error('Alert not found');
        data.reorderAlerts[index] = { ...data.reorderAlerts[index], ...updates };
        persistData(data);
        return data.reorderAlerts[index];
      },
    },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        if (!file) return { file_url: '' };
        return { file_url: isBrowser ? URL.createObjectURL(file) : '' };
      },
    },
  },
  auth: {
    me: async () => {
      const data = getData();
      return data.user;
    },
    logout: () => {
      if (isBrowser) {
        window.location.reload();
      }
    },
    redirectToLogin: () => {
      if (isBrowser) {
        window.location.href = '/';
      }
    },
  },
};

export { dataClient };
