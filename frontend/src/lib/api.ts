import axios from 'axios';

// Get the token from local storage
const getToken = () => localStorage.getItem('aspiria_token');

const api = axios.create({
  baseURL: 'http://<your_domain>/api/v1',
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;