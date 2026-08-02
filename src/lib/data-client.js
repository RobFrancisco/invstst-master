const STORAGE_KEY = 'invstst-local-data-v1';
const AUTH_STORAGE_KEY = 'inventory-user';

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
      min_stock: 5,
      max_stock: 50,
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
      min_stock: 5,
      max_stock: 50,
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
      min_stock: 5,
      max_stock: 50,
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
  users: [
    {
      id: 'user-1',
      full_name: 'System Admin',
      email: 'admin@inventory.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      created_date: '2024-06-01T10:00:00.000Z',
    },
    {
      id: 'user-2',
      full_name: 'Sales Manager',
      email: 'manager@inventory.com',
      password: 'manager123',
      role: 'manager',
      status: 'active',
      created_date: '2024-06-02T10:00:00.000Z',
    },
    {
      id: 'user-3',
      full_name: 'Store Staff',
      email: 'staff@inventory.com',
      password: 'staff123',
      role: 'staff',
      status: 'active',
      created_date: '2024-06-03T10:00:00.000Z',
    },
  ],
  user: null,
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

function getStoredUser() {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to read auth state:', error);
    return null;
  }
}

function saveStoredUser(user) {
  if (!isBrowser) return;
  try {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to persist auth state:', error);
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

function normalizeRole(role = '') {
  return String(role || '').trim().toLowerCase();
}

function getStockValue(value, fallback = 0) {
  return Number(value ?? fallback) || fallback;
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
          min_stock: Number(product.min_stock ?? 5) || 5,
          max_stock: Number(product.max_stock ?? 50) || 50,
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
        const nextProduct = { ...data.products[index], ...updates };
        if (updates.min_stock !== undefined) {
          nextProduct.min_stock = Number(updates.min_stock) || 0;
        }
        if (updates.max_stock !== undefined) {
          nextProduct.max_stock = Number(updates.max_stock) || 0;
        }
        if (nextProduct.max_stock < nextProduct.min_stock) {
          nextProduct.max_stock = nextProduct.min_stock;
        }
        data.products[index] = nextProduct;
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
          min_stock: Number(product.min_stock ?? 5) || 5,
          max_stock: Number(product.max_stock ?? 50) || 50,
        }));
      },
    },
    Sale: {
      list: async (order = '-created_date') => {
        const data = getData();
        return sortByDate(data.sales, 'created_date', order);
      },
      create: async ({ product_id, quantity, unit_price, customer_name, staff_name }) => {
        const data = getData();
        const product = data.products.find((item) => item.id === product_id);
        if (!product) throw new Error('Product not found');
        const qty = Number(quantity) || 0;
        const safeStaffName = String(staff_name || 'Store Staff');
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
          staff_name: safeStaffName,
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
          staff_name: safeStaffName,
          movement_date: new Date().toISOString(),
        });
        persistData(data);
        return sale;
      },
    },
    User: {
      list: async (order = '-created_date') => {
        const data = getData();
        return sortByDate(data.users, 'created_date', order);
      },
      create: async ({ full_name, email, password, role = 'staff', status = 'active' }) => {
        const data = getData();
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail) throw new Error('Email is required');
        if (data.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
          throw new Error('A user with this email already exists');
        }

        const created = {
          id: createId(),
          full_name: String(full_name || '').trim(),
          email: normalizedEmail,
          password: String(password || '').trim() || 'welcome123',
          role: normalizeRole(role) || 'staff',
          status: String(status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active',
          created_date: new Date().toISOString(),
        };
        data.users.unshift(created);
        persistData(data);
        return created;
      },
      update: async (id, updates = {}) => {
        const data = getData();
        const index = data.users.findIndex((item) => item.id === id);
        if (index === -1) throw new Error('User not found');

        const nextUser = { ...data.users[index], ...updates };
        if (updates.email) {
          const normalizedEmail = String(updates.email).trim().toLowerCase();
          const duplicate = data.users.find((user) => user.id !== id && user.email.toLowerCase() === normalizedEmail);
          if (duplicate) throw new Error('A user with this email already exists');
          nextUser.email = normalizedEmail;
        }
        if (updates.role) nextUser.role = normalizeRole(updates.role);
        if (updates.status) nextUser.status = String(updates.status).toLowerCase() === 'inactive' ? 'inactive' : 'active';
        data.users[index] = nextUser;
        persistData(data);
        return data.users[index];
      },
      delete: async (id) => {
        const data = getData();
        const currentUser = data.user;
        data.users = data.users.filter((item) => item.id !== id);
        if (currentUser?.id === id) {
          data.user = null;
        }
        persistData(data);
        return { id };
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
        const alerts = data.products
          .filter((product) => {
            const currentStock = getStockValue(product.quantity, 0);
            const minStock = getStockValue(product.min_stock, 5);
            return currentStock <= minStock;
          })
          .map((product) => {
            const currentStock = getStockValue(product.quantity, 0);
            const minStock = getStockValue(product.min_stock, 5);
            const maxStock = getStockValue(product.max_stock, 50);
            const existingAlert = data.reorderAlerts.find((alert) => alert.product_id === product.id);
            const reorderQty = Math.max(maxStock - currentStock, 1);

            return {
              ...(existingAlert || {}),
              id: existingAlert?.id || createId(),
              product_id: product.id,
              product_name: product.name,
              current_stock: currentStock,
              min_stock: minStock,
              max_stock: maxStock,
              reorder_qty: reorderQty,
              estimated_cost: (getStockValue(product.price, 0) || 0) * reorderQty,
              priority: currentStock <= 0 ? 'Critical' : currentStock < minStock ? 'High' : 'Medium',
              status: existingAlert?.status || 'Pending',
              alert_date: existingAlert?.alert_date || product.created_date || new Date().toISOString(),
            };
          });

        return sortByDate(alerts, 'alert_date', order);
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
      return getStoredUser();
    },
    login: async ({ email, password }) => {
      const data = getData();
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const user = data.users.find((item) => item.email.toLowerCase() === normalizedEmail);

      if (!user) throw new Error('Invalid email or password');
      if (String(password || '') !== String(user.password || '')) throw new Error('Invalid email or password');
      if (user.status !== 'active') throw new Error('This account is inactive');

      const currentUser = { ...user };
      delete currentUser.password;
      saveStoredUser(currentUser);
      return currentUser;
    },
    logout: () => {
      saveStoredUser(null);
      if (isBrowser) {
        window.location.href = '/login';
      }
    },
    redirectToLogin: () => {
      if (isBrowser) {
        window.location.href = '/login';
      }
    },
    canManageUsers: (user) => normalizeRole(user?.role) === 'admin',
  },
};

export { dataClient };
