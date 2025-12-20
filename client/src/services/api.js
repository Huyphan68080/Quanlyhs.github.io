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

// Decode JWT to get user info (role, username, etc.)
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
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
  register: (username, password, confirmPassword) =>
    api.post('/auth/register', { username, password, confirmPassword }),
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
  getClasses: () =>
    api.get('/students/classes/list'),
  getByClass: (classId) =>
    api.get(`/students/class/${classId}`),
};

// Grades API
export const gradesAPI = {
  getStudentGrades: (studentId) =>
    api.get(`/grades/${studentId}/grades`),
  getStudentGradesByCode: (maSv) =>
    api.get(`/grades/code/${maSv}`),
  updateStudentGrades: (studentId, grades) =>
    api.post(`/grades/${studentId}/grades`, grades),
  getClassGrades: (className) =>
    api.get(`/grades/class/${className}/grades`),
  getByStudent: (studentId) =>
    api.get(`/grades/student/${studentId}`),
  getTopStudents: (classId) =>
    api.get(`/grades/class/${classId}/top-students`),
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

// Users API (admin only)
export const usersAPI = {
  getAllUsers: () =>
    api.get('/users'),
  getUserById: (userId) =>
    api.get(`/users/${userId}`),
  createUser: (userData) =>
    api.post('/users', userData),
  updateUser: (userId, userData) =>
    api.put(`/users/${userId}`, userData),
  deleteUser: (userId) =>
    api.delete(`/users/${userId}`),
};

export default api;
