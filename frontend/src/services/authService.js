/**
 * @file authService.js
 * @description Services proxying authentication endpoints (login, logout, refresh, self, reset-password).
 */
import api from './api';

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),

  resetPassword: (currentPassword, newPassword) =>
    api.post('/auth/reset-password', { currentPassword, newPassword }),

  /** Called on app boot to get the current user from the valid cookie */
  me: () =>
    api.get('/auth/me'),
};
