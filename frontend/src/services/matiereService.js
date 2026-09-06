import api from './api';

const matiereService = {
  getAll: () => api.get('/matieres').then((res) => res.data),
  getById: (id) => api.get(`/matieres/${id}`).then((res) => res.data),
  create: (payload) => api.post('/matieres', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/matieres/${id}`, payload).then((res) => res.data),
  delete: (id) => api.delete(`/matieres/${id}`),
};

export default matiereService;
