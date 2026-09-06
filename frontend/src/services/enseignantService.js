import api from './api';

const enseignantService = {
  getAll: (matiereId) => api.get('/enseignants', { params: { matiereId } }).then((res) => res.data),
  getById: (id) => api.get(`/enseignants/${id}`).then((res) => res.data),
  create: (payload) => api.post('/enseignants', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/enseignants/${id}`, payload).then((res) => res.data),
  delete: (id) => api.delete(`/enseignants/${id}`),
  toggleActivation: (id, enabled) => api.patch(`/enseignants/${id}/activation`, null, { params: { enabled } }),
  getMesEleves: () => api.get('/enseignants/moi/eleves').then((res) => res.data),
};

export default enseignantService;
