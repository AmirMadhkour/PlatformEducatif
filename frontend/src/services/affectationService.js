import api from './api';

const affectationService = {
  getByEleve: (eleveId) => api.get('/affectations', { params: { eleveId } }).then((res) => res.data),
  getMesAffectations: () => api.get('/affectations/moi').then((res) => res.data),
  creer: (payload) => api.post('/affectations', payload).then((res) => res.data),
  affecter: (id, enseignantId) => api.patch(`/affectations/${id}/affecter`, { enseignantId }).then((res) => res.data),
  supprimer: (id) => api.delete(`/affectations/${id}`).then((res) => res.data),
};

export default affectationService;
