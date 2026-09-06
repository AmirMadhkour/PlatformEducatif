import api from './api';

const publicService = {
  getNiveaux: () => api.get('/public/niveaux').then((res) => res.data),
};

export default publicService;
