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
      // Handle API errors
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        message: 'Error de conexión. Por favor verifica tu conexión a internet.',
        statusCode: 0,
      };
    }
  },

  /**
   * Logout user (if backend requires logout endpoint)
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Silent fail - we'll clear local data anyway
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
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },
};
