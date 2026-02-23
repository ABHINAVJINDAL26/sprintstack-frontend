import api from './api';

export const sprintService = {
  getSprintsByProject: async (projectId) => {
    const { data } = await api.get(`/sprints/${projectId}`);
    return data;
  }
};
