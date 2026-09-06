import api from './api';

export const statistiqueService = {
  getStatistiques: () => api.get('/statistiques').then((res) => res.data),
};
