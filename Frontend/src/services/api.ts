import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
const BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('connectly_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);
// Auth
export const authService = {
  register: (data: { displayName: string; email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Profile
export const profileService = {
  getProfile: (username: string) => api.get(`/profile/${username}`),
  updateProfile: (data: Partial<import('../types').Profile>) => api.put('/profile', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// Requests
export const requestsService = {
  send: (data: { receiverId: string; message?: string }) => api.post('/requests/send', data),
  pending: () => api.get('/requests/pending'),
  accept: (id: string) => api.post(`/requests/accept/${id}`),
  pass: (id: string) => api.post(`/requests/pass/${id}`),
  later: (id: string) => api.post(`/requests/later/${id}`),
  getLater: () => api.get('/requests/later'),
};

// Connections
export const connectionsService = {
  getAll: () => api.get('/connections'),
};

// Messages
export const messagesService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId: string) => api.get(`/messages/${conversationId}`),
  send: (data: { conversationId: string; content: string }) => api.post('/messages', data),
};

// Compliments
export const complimentsService = {
  send: (data: { profileId: string; content: string; anonymous?: boolean }) => api.post('/compliments', data),
  get: (username: string) => api.get(`/compliments/${username}`),
  approve: (id: string) => api.patch(`/compliments/${id}/approve`),
  delete: (id: string) => api.delete(`/compliments/${id}`),
};

// Questions
export const questionsService = {
  ask: (data: { profileId: string; question: string }) => api.post('/questions', data),
  answer: (id: string, data: { answer: string }) => api.post(`/questions/${id}/answer`, data),
  get: (username: string) => api.get(`/questions/${username}`),
};

// Notifications
export const notificationsService = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
};
// Comments
export const commentsService = {
  get: (username: string) => api.get(`/profile/${username}/comments`),
  post: (username: string, data: { authorName: string; content: string }) =>
    api.post(`/profile/${username}/comments`, data),
};