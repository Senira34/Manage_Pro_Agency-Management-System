import axios from 'axios';

// Base URL for API - change this to your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  getAllUsers: () => api.get('/auth/users'),
};

// Bills API
export const billsAPI = {
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  create: (billData) => api.post('/bills', billData),
  update: (id, billData) => api.put(`/bills/${id}`, billData),
  delete: (id) => api.delete(`/bills/${id}`),
  getByAgency: (agencyId) => api.get(`/bills/agency/${agencyId}`),
  getByRoute: (route) => api.get(`/bills/route/${route}`),
};

// Cheques API
export const chequesAPI = {
  getAll: () => api.get('/cheques'),
  getById: (id) => api.get(`/cheques/${id}`),
  create: (chequeData) => api.post('/cheques', chequeData),
  update: (id, chequeData) => api.put(`/cheques/${id}`, chequeData),
  updateStatus: (id, status) => api.patch(`/cheques/${id}/status`, { status }),
  delete: (id) => api.delete(`/cheques/${id}`),
  getByAgency: (agencyId) => api.get(`/cheques/agency/${agencyId}`),
};

// Collections API
export const collectionsAPI = {
  getAll: () => api.get('/collections'),
  getById: (id) => api.get(`/collections/${id}`),
  create: (collectionData) => api.post('/collections', collectionData),
  update: (id, collectionData) => api.put(`/collections/${id}`, collectionData),
  delete: (id) => api.delete(`/collections/${id}`),
  getByBill: (billId) => api.get(`/collections/bill/${billId}`),
  getByAgency: (agencyId) => api.get(`/collections/agency/${agencyId}`),
};

export default api;
