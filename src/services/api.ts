import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';


// Get API base URL from environment
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return "http://localhost:3000/api";
  }
  return "http://192.168.0.126:3000/api"; 
};

const API_BASE_URL = process.env.API_BASE_URL || getBaseUrl();

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      await storage.clearAuth();
      // You could also trigger a navigation to login here
      // or emit an event that the app can listen to
    }
    return Promise.reject(error);
  }
);

export default api;
