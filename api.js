import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ka_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ka_token');
      localStorage.removeItem('ka_admin');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  setup: (data) => api.post('/auth/setup', data)
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`)
};

// ─── RFQ ─────────────────────────────────────────────────────────────────────
export const rfqAPI = {
  submit: (data) => api.post('/rfq', data),
  getAll: (params) => api.get('/rfq', { params }),
  updateStatus: (id, status) => api.patch(`/rfq/${id}/status`, { status }),
  delete: (id) => api.delete(`/rfq/${id}`)
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  create: (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/projects/${id}`)
};

// ─── Documents ───────────────────────────────────────────────────────────────
export const documentsAPI = {
  getAll: () => api.get('/documents'),
  create: (data) => api.post('/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  trackDownload: (id) => api.post(`/documents/${id}/download`),
  requestByEmail: (data) => api.post('/documents/request-email', data)
};
