import { api } from './api';

export interface StudentPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    status: 'active' | 'inactive' | 'expired';
    classes_used: number;
    classes_total: number;
    start_date: string;
    end_date: string;
}

export interface StudentDetail {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified: boolean;
    last_login: string | null;
    created_at: string;
    plan: StudentPlan | null;
    avatar?: string;
}

export interface StudentDetailResponse {
    success: boolean;
    message: string;
    data: StudentDetail;
}

export const studentService = {
    getById: async (id: number): Promise<StudentDetailResponse> => {
        const response = await api.get<StudentDetailResponse>(`/students/details/${id}`);
        return response.data;
    }
};
