// src/utils/api.js
import axios from 'axios';

const isProduction = import.meta.env.PROD;
export const BASE_URL = isProduction ? import.meta.env.VITE_API_URL : '/api';

console.log('API Configuration:', {
  isProduction,
  BASE_URL,
  currentOrigin: window.location.origin
});

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure cookies are sent and received
  withCredentials: true
});

// Add request interceptor with detailed logging
instance.interceptors.request.use(
  config => {
    console.log('Request Config:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      withCredentials: config.withCredentials,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor with detailed logging
instance.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      cookies: document.cookie,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      cookies: document.cookie
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
