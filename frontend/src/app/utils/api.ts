import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend API base URL
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
