import api from './api';
import { ClassesResponse } from '../types';

export const classService = {
    /**
     * Obtiene las clases filtradas por fecha con paginación
     */
    async getTodayClasses(dayName: string, page = 1, limit = 10): Promise<ClassesResponse> {
        try {
            // Enviamos el nombre del día (ej: Monday) al parámetro 'date'
            const endpoint = `/classes?date=${dayName}&page=${page}&limit=${limit}&order_by=hour&order_direction=asc`;

            const response = await api.get<ClassesResponse>(endpoint);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar las clases', statusCode: 0 };
        }
    }
};