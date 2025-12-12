import axios from 'axios';

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  // Check for production environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development uses relative /api path (handled by proxy in vite.config.js)
  if (import.meta.env.MODE === 'development') {
    return '/api';
  }
  // Production fallback to Render server
  return 'https://quanlyhs-github-io-3.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API base URL being used
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NODE_ENV:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

let accessToken = localStorage.getItem('accessToken');

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
};

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  seedAdmin: () =>
    api.post('/auth/seed-admin'),
};

// Students API
export const studentsAPI = {
  getAll: (className, maSv) => {
    const params = new URLSearchParams();
    if (className) params.append('className', className);
    if (maSv) params.append('maSv', maSv);
    return api.get(`/students?${params.toString()}`);
  },
  create: (maSv, name, className) =>
    api.post('/students', { maSv, name, class: className }),
  delete: (id) =>
    api.delete(`/students/${id}`),
  getById: (id) =>
    api.get(`/students/${id}`),
};

// Grades API
export const gradesAPI = {
  getStudentGrades: (studentId) =>
    api.get(`/grades/${studentId}/grades`),
  updateStudentGrades: (studentId, grades) =>
    api.post(`/grades/${studentId}/grades`, grades),
  getClassGrades: (className) =>
    api.get(`/grades/class/${className}/grades`),
};

// Stats API
export const statsAPI = {
  getClassesStats: () =>
    api.get('/stats/classes'),
  getSubjectsStats: () =>
    api.get('/stats/subjects'),
  getDistributionStats: () =>
    api.get('/stats/distribution'),
};

export default api;
