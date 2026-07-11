import api from './api';
import { LoginCredentials, AuthResponse } from '../types';

export const authService = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });

            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error de conexión', statusCode: 0 };
        }
    },

    /**
     * Cambia la contraseña del usuario autenticado
     */
    async changePassword(current_password: string, new_password: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.post('/auth/change-password', { current_password, new_password });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error de conexión', statusCode: 0 };
        }
    },

    /**
     * Sesión fresca del usuario autenticado (user, academy, subscription, modules, permissions)
     */
    async getMe(): Promise<{ success: boolean; data: any }> {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error de conexión', statusCode: 0 };
        }
    },

    /**
     * Logout user (if backend requires logout endpoint)
     */
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>(
                '/auth/forgot-password',
                { email }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw {
                message: 'Error al enviar el correo de recuperación.',
                statusCode: 0,
            };
        }
    },

    /**
     * Validate token (check if current token is still valid)
     */
    async validateToken(): Promise<boolean> {
        try {
            await api.get('/auth/me');
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Update push token
     */
    updatePushToken: async (userId: string, token: string): Promise<void> => {
        try {
            await api.patch(`/users/${userId}/push-token`, {
                pushToken: token
            });
        } catch (error) {
            console.error('Error al actualizar push token en el servidor:', error);
            throw error;
        }
    },
};
