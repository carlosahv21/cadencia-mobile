import { api } from './api';

export interface TeacherHeader {
    id: number;
    full_name: string;
    role_label: string;
    email: string;
    avatar?: string;
}

export interface TeacherStats {
    classes_count: number;
    rating: number;
    students_count: number;
}

export interface TeacherPaymentSummary {
    pending_amount: number;
    paid_amount: number;
    next_cutoff_date: string;
}

export interface TeacherWeeklyClass {
    id: number;
    name: string;
    genre: string;
    schedule: string;
    duration: string;
    location: string;
}

export interface TeacherDetail {
    header: TeacherHeader;
    stats: TeacherStats;
    payment_summary: TeacherPaymentSummary;
    weekly_classes: TeacherWeeklyClass[];
}

export interface TeacherDetailResponse {
    success: boolean;
    message: string;
    data: TeacherDetail;
}

export const teacherService = {
    getById: async (id: number): Promise<TeacherDetailResponse> => {
        const response = await api.get<TeacherDetailResponse>(`/teachers/details/${id}`);
        return response.data;
    }
};
