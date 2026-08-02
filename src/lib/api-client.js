async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const apiClient = {
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  },
  users: {
    list: () => request('/users'),
    create: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },
};
