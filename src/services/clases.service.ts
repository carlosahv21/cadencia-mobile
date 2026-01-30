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
    },

    /**
     * Obtiene los alumnos inscritos en una clase específica
     */
    async getEnrolledStudents(classId: number): Promise<any> {
        try {
            const response = await api.get(`registrations?class_id=${classId}&limit=1000&order_by=u.first_name&order_direction=asc`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar los alumnos inscritos', statusCode: 0 };
        }
    },

    /**
     * Obtiene la asistencia registrada para una clase y fecha específica
     */
    async getAttendance(classId: number, date: string): Promise<any> {
        try {
            const response = await api.get(`attendances?class_id=${classId}&date=${date}&limit=1000`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar la asistencia', statusCode: 0 };
        }
    },

    /**
     * Guarda la asistencia de una clase
     */
    async saveAttendance(attendances: any[]): Promise<any> {
        try {
            const response = await api.post("attendances",  attendances );
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al guardar la asistencia', statusCode: 0 };
        }
    }
};