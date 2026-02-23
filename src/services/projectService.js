import api from './api';

export const projectService = {
  createProject: async (payload) => {
    const { data } = await api.post('/projects', payload);
    return data;
  },
  getProjectById: async (projectId) => {
    const { data } = await api.get(`/projects/${projectId}`);
    return data;
  }
};
