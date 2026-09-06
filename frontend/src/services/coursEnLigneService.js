import api from './api';

const coursEnLigneService = {
  creer: (payload) => api.post('/cours-en-ligne', payload).then((res) => res.data),
  modifier: (id, payload) => api.put(`/cours-en-ligne/${id}`, payload).then((res) => res.data),
  supprimer: (id) => api.delete(`/cours-en-ligne/${id}`),
  mesLivesEnseignant: () => api.get('/cours-en-ligne/enseignant/moi').then((res) => res.data),
  mesLivesEleve: () => api.get('/cours-en-ligne/eleve/moi').then((res) => res.data),
  tousLesLives: () => api.get('/cours-en-ligne').then((res) => res.data),
};

export default coursEnLigneService;
