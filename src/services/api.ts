import axios from 'axios';
import { useAuthStore } from '@store/authStore';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    const message =
      error.response?.data?.message ??
      (error.code === 'ERR_NETWORK'
        ? 'Network error — check your connection'
        : 'Something went wrong');

    return Promise.reject(new Error(message));
  },
);

export default api;
