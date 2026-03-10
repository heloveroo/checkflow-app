import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
};

export const checklistAPI = {
  getAll: (params) => api.get('/checklists', { params }),
  getOne: (id) => api.get(`/checklists/${id}`),
  getStats: () => api.get('/checklists/stats'),
  create: (data) => api.post('/checklists', data),
  update: (id, data) => api.patch(`/checklists/${id}`, data),
  delete: (id) => api.delete(`/checklists/${id}`),
  toggleItem: (id, itemId, data) => api.patch(`/checklists/${id}/items/${itemId}`, data),
  addComment: (id, data) => api.post(`/checklists/${id}/comments`, data)
};

export const templateAPI = {
  getAll: (params) => api.get('/templates', { params }),
  getOne: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post('/templates', data),
  update: (id, data) => api.patch(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`)
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const tagAPI = {
  getAll: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`)
};

export const userAPI = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
  updateProfile: (data) => api.patch('/users/profile', data)
};

export const logAPI = {
  getAll: (params) => api.get('/logs', { params })
};
