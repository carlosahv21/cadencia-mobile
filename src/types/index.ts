// TypeScript type definitions for DanceFlow Mobile

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    plan?: string | null;
    permissions?: string[];
    avatar?: string;
}

export interface Academy {
    id: number;
    academy_name: string;
    logo_url?: string;
    currency?: string;
    date_format?: string;
    theme?: string;
    language?: string;
    contact_email?: string;
    phone_number?: string;
    address?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
        settings: Academy;
        permissions: string[];
    };
}

export interface DanceClass {
    id: number;
    name: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado';
    genre: string;
    description: string;
    duration: number;
    date: string;
    hour: string;
    capacity: number;
    teacher_id: number;
    is_favorites: number;
    deleted_at: string | null;
    deleted_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
}

export interface ClassesResponse {
    success: boolean;
    message: string;
    data: DanceClass[];
    pagination: Pagination;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface DashboardStat {
    id: number;
    label: string;
    value: string | number;
    icon: string;
    color: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}
