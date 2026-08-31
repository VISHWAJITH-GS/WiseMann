import axios from 'axios';
import type {
  DashboardSummary,
  Recommendation,
  Product,
  Forecast,
  Risk,
  Inventory,
  AIMessage,
  ScenarioInput,
  ScenarioOutput,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
  getActions: () => api.get<Recommendation[]>('/dashboard/actions'),
  getAlerts: () => api.get('/dashboard/alerts'),
};

// Products API
export const productsAPI = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getByProductId: (productId: string) => api.get<Inventory>(`/inventory/${productId}`),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/sales/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Forecast API
export const forecastAPI = {
  getByProductId: (productId: string) => api.get<Forecast>(`/forecast/${productId}`),
  generate: () => api.post('/forecast/generate', {}),
  regenerate: (productId: string) => api.post(`/forecast/${productId}/regenerate`, {}),
};

// Risk API
export const risksAPI = {
  getAll: () => api.get<Risk[]>('/risks'),
  getByProductId: (productId: string) => api.get<Risk>(`/risks/${productId}`),
};

// Purchase API
export const purchaseAPI = {
  getRecommendations: () => api.get<Recommendation[]>('/purchase/recommendations'),
  optimize: (params?: Record<string, unknown>) => 
    api.post<Recommendation[]>('/purchase/optimize', params || {}),
  getPlan: () => api.get('/purchase/plan'),
  createPlan: (items: Array<{ productId: string; quantity: number }>) =>
    api.post('/purchase/plan', { items }),
  confirmPurchase: (planId: string) =>
    api.post(`/purchase/plan/${planId}/confirm`, {}),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: string) => api.get(`/suppliers/${id}`),
};

// What-if / Scenarios API
export const scenariosAPI = {
  simulate: (input: ScenarioInput) =>
    api.post<ScenarioOutput>('/scenarios/simulate', input),
};

// AI API
export const aiAPI = {
  chat: (message: string, context?: Record<string, unknown>) =>
    api.post<AIMessage>('/ai/chat', { message, context }),
  getSuggestions: () => api.get<string[]>('/ai/suggestions'),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get('/auth/me'),
};

export default api;
