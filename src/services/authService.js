import api from './api';

export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  }
};
