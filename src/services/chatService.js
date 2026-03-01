import api from './api';

export const getProjectMessages = (projectId, params = {}) =>
  api.get(`/chats/project/${projectId}`, { params });

export const sendProjectMessage = (projectId, payload = {}) => {
  const formData = new FormData();
  const text = String(payload.message || '').trim();

  if (text) {
    formData.append('message', text);
  }

  (payload.attachments || []).forEach((file) => {
    formData.append('attachments', file);
  });

  return api.post(`/chats/project/${projectId}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
