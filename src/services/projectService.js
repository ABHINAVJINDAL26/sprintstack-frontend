import api from './api';

export const createProject = (data) => api.post('/projects', data);
export const getAllProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const addTeamMember = (id, email) => api.post(`/projects/${id}/members`, { email });
