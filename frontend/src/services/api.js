import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const driveService = {
  createDrive: (data) => api.post('/drives', data),
  getDrives: () => api.get('/drives'), // For students
  getCompanyDrives: () => api.get('/drives/company'), // For company
};

export const applicationService = {
  apply: (driveId) => api.post('/applications', { driveId }),
  getMyApplications: () => api.get('/applications/my'),
  getDriveApplications: (driveId) => api.get(`/applications/drive/${driveId}`),
  getStats: () => api.get('/applications/stats'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getPendingUsers: (role) => api.get(`/admin/pending${role ? `?role=${role}` : ''}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
};

export default api;
