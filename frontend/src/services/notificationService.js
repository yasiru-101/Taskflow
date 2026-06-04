/**
 * @file notificationService.js
 * @description Services calling user notifications API channels.
 */
import api from './api';

export const notificationService = {
  /** Get all notifications for the current user */
  getNotifications: () =>
    api.get('/notifications'),

  /** Mark a single notification as read */
  markRead: (id) =>
    api.patch(`/notifications/${id}/read`),

  /** Mark all notifications as read */
  markAllRead: () =>
    api.patch('/notifications/read-all'),
};
