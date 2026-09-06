import api from './api';


const authService = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),

  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),

  changePassword: (payload) => api.post('/auth/change-password', payload).then((res) => res.data),

  getProfile: () => api.get('/profile').then((res) => res.data),
};

export default authService;
