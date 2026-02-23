import api from './api';

export const taskService = {
  createTask: async (payload) => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },
  getTasks: async (params = {}) => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },
  updateTask: async (taskId, payload) => {
    const { data } = await api.put(`/tasks/${taskId}`, payload);
    return data;
  }
};
