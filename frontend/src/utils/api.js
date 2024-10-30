// src/utils/api.js
import axios from 'axios';

// Remove /api from the BASE_URL
export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

const api = axios.create({
    baseURL: `${BASE_URL}/api`, // Add /api here for API requests only
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
