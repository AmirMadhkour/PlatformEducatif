import api from './api';

const coursService = {
  search: (params) => api.get('/cours', { params }).then((res) => res.data),
  getById: (id) => api.get(`/cours/${id}`).then((res) => res.data),

  create: (coursData, video, pdfs, ppt) => {
    const form = new FormData();
    form.append('cours', new Blob([JSON.stringify(coursData)], { type: 'application/json' }));
    if (video) form.append('video', video);
    (pdfs || []).forEach((pdf) => form.append('pdfs', pdf));
    if (ppt) form.append('ppt', ppt);
    return api.post('/cours', form).then((res) => res.data);
  },

  update: (id, payload) => api.put(`/cours/${id}`, payload).then((res) => res.data),
  delete: (id) => api.delete(`/cours/${id}`),

  updateVideo: (id, file) => {
    const form = new FormData();
    form.append('video', file);
    return api.post(`/cours/${id}/video`, form);
  },
  ajouterPdf: (id, file) => {
    const form = new FormData();
    form.append('pdf', file);
    return api.post(`/cours/${id}/pdfs`, form);
  },
  supprimerPdf: (id, pdfId) => api.delete(`/cours/${id}/pdfs/${pdfId}`),
  updatePpt: (id, file) => {
    const form = new FormData();
    form.append('ppt', file);
    return api.post(`/cours/${id}/ppt`, form);
  },

  
  telechargerFichier: (url) => {
    const chemin = url.startsWith('/api') ? url.slice(4) : url;
    return api.get(chemin, { responseType: 'blob' }).then((res) => window.URL.createObjectURL(res.data));
  },

  searchPublic: (titre) => api.get('/public/cours', { params: { titre } }).then((res) => res.data),
};

export default coursService;
