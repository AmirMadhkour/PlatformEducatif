import api from './api';

const eleveService = {
  getAll: (params) => api.get('/eleves', { params }).then((res) => res.data),
  getById: (id) => api.get(`/eleves/${id}`).then((res) => res.data),
  update: (id, payload) => api.put(`/eleves/${id}`, payload).then((res) => res.data),
  toggleActivation: (id, enabled) => api.patch(`/eleves/${id}/activation`, null, { params: { enabled } }),
  valider: (id) => api.patch(`/eleves/${id}/validation`),
};

export default eleveService;
