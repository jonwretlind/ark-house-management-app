// src/utils/api.js
import axios from 'axios';

const isProduction = import.meta.env.PROD;
export const BASE_URL = isProduction ? import.meta.env.VITE_API_URL : '/api';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor
instance.interceptors.request.use(
  config => {
    // Log the full URL being requested
    console.log('Making request to:', `${config.baseURL}${config.url}`, {
      method: config.method?.toUpperCase(),
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  response => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Response error details:', {
      message: error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

// Add a test method to verify connection
instance.testConnection = async () => {
  try {
    const response = await instance.get('/health');
    console.log('Backend connection test:', response.data);
    return response.data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};

export default instance;
