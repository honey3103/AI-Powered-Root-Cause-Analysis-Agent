import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add auth token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rca_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('rca_token');
        localStorage.removeItem('rca_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
