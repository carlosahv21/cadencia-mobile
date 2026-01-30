import api from './api';
import { UserPlan } from '../types';

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
    }
};
