// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // or whatever your backend URL is
  withCredentials: true,
});

export default api;
