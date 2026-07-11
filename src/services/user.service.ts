import api from './api';
import { UserPlan } from '../types';

export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    phone?: string | null;
    gender?: string | null;
    birthdate?: string | null;
}

export const userService = {
    /**
     * Obtiene el plan actual del estudiante
     */
    async getUserPlan(): Promise<{ success: boolean; data: UserPlan }> {
        try {
            const response = await api.get<{ success: boolean; data: UserPlan }>('/user/plan');
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar el plan del usuario', statusCode: 0 };
        }
    },

    /**
     * Usuario crudo (con first_name/last_name separados, que la sesión no trae)
     */
    async getById(id: string): Promise<{ success: boolean; data: any }> {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar el usuario', statusCode: 0 };
        }
    },

    async updateProfile(id: string, data: ProfileUpdateData): Promise<{ success: boolean }> {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al actualizar el perfil', statusCode: 0 };
        }
    }
};
