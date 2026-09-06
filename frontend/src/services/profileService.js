import api from './api';

const profileService = {
  getMyProfile: () => api.get('/profile').then((res) => res.data),
  updateMyProfile: (payload) => api.put('/profile', payload).then((res) => res.data),
};

export default profileService;
