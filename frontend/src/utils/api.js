// src/utils/api.js
import axios from 'axios';

// Import the HOST variable from the environment
const HOST = import.meta.env.VITE_HOST || 'http://localhost:5000';

export const BASE_URL = `${HOST}/api`; // Export BASE_URL

const api = axios.create({
    baseURL: BASE_URL, // Use the HOST variable for API requests
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
