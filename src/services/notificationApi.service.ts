import { api } from './api';
import { DanceFlowNotification, NotificationsResponse } from '../types';

export const notificationApiService = {
    /**
     * Get all notifications for the current user
     */
    async getAll(): Promise<DanceFlowNotification[]> {
        try {
            const response = await api.get<NotificationsResponse>('/notifications');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Mark a single notification as read
     */
    async markAsRead(id: number): Promise<void> {
        try {
            await api.patch(`/notifications/${id}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        try {
            await api.patch('/notifications/read-all');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },
};
