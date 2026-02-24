import api from './api';

export const createSprint = (data) => api.post('/sprints', data);
export const getSprintsByProject = (projectId) => api.get(`/sprints/project/${projectId}`);
export const getSprintById = (id) => api.get(`/sprints/${id}`);
export const updateSprint = (id, data) => api.put(`/sprints/${id}`, data);
export const getSprintProgress = (id) => api.get(`/sprints/${id}/progress`);
