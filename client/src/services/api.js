import axios from 'axios';

// Create axios instance with base URL pointing to /api (proxied by Vite or override in production)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format error messages consistently
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    
    // If validation failed, append detailed messages (e.g. "Validation failed: Phone number must be 10 digits")
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const detailedErrors = error.response.data.errors
        .map((err) => err.message)
        .filter(Boolean)
        .join(', ');
      if (detailedErrors) {
        message = `${message}: ${detailedErrors}`;
      }
    }
    
    // Create custom error object
    const formattedError = new Error(message);
    formattedError.status = error.response?.status;
    formattedError.errors = error.response?.data?.errors;
    
    return Promise.reject(formattedError);
  }
);

export default api;
