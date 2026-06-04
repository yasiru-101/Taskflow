/**
 * @file userService.js
 * @description Administrative service hooks querying user lists and triggering updates.
 */
import api from './api';

export const userService = {
  /** Admin: list all users with optional search/filter */
  getUsers: (params = {}) =>
    api.get('/users', { params }),

  /** Admin: get single user */
  getUser: (id) =>
    api.get(`/users/${id}`),

  /** Admin: create user (backend sends onboarding email) */
  createUser: (data) =>
    api.post('/users', data),

  /** Admin: update user details or role */
  updateUser: (id, data) =>
    api.put(`/users/${id}`, data),

  /** Admin: soft-deactivate a user */
  deactivateUser: (id) =>
    api.patch(`/users/${id}/deactivate`),
};
