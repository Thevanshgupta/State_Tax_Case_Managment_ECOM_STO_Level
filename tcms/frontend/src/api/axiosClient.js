import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tcms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tcms_token');
      localStorage.removeItem('tcms_user');
      window.location.reload(); // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;