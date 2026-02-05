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
    },

    /**
     * Obtiene los detalles de una clase específica
     */
    /**
     * Obtiene los detalles de una clase específica
     */
    async getDetails(classId: number): Promise<ClassDetailResponse> {
        try {
            const response = await api.get<ClassDetailResponse>(`/classes/details/${classId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar los detalles de la clase', statusCode: 0 };
        }
    },

    /**
     * Obtiene la próxima clase disponible
     */
    async getNextClass(): Promise<NextClassResponse> {
        try {
            const response = await api.get<NextClassResponse>('/classes/next');
            return response.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            return {
                success: false,
                message: 'No se encontraron clases',
                data: null
            };
        }
    }
};

export interface NextClassData {
    title: string;
    teacher: {
        name: string;
    };
    location: string;
    startTime: string;
    dayName: string;
    rawHour: string;
}

export interface NextClassResponse {
    success: boolean;
    message: string;
    data: NextClassData | null;
}

export interface ClassHeader {
    title: string;
    level_tag: string;
    genre: string;
}

export interface ClassStat {
    label: string;
    value: string;
}

export interface ClassSessionDetails {
    time_range: string;
    duration_label: string;
    location: string;
    location_detail: string;
}

export interface ClassStudent {
    id: number;
    full_name: string;
    plan_info: string;
    has_attended: boolean;
    last_attendance_date?: string;
    avatar?: string; // Optional as not in provided JSON but might be needed
}

export interface ClassDetail {
    header: ClassHeader;
    stats: ClassStat[];
    session_details: ClassSessionDetails;
    students: ClassStudent[];
}

export interface ClassDetailResponse {
    success: boolean;
    message: string;
    data: ClassDetail;
}