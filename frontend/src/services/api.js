import axios from 'axios';




const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_HOST}/api`,
});







api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('eduplatform_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;
