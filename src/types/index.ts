// TypeScript type definitions for DanceFlow Mobile

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    plan?: {
        name: string;
        description: string;
        price: string;
        type: string;
        status: string;
        classes_used: number;
        max_classes: number;
        start_date: string;
        end_date: string;
    } | null;
    theme?: 'light' | 'dark';
    language?: string;
    hide_tour?: boolean;
    tour_completed?: boolean;
    needs_password_change?: boolean;
    phone?: string | null;
    avatar?: string | null;
    gender?: string | null;
    birthdate?: string | null;
}

export interface Attendance {
    id: number;
    class_id: number;
    student_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    date: string;
}

export interface UserPlan {
    id: number;
    user_id: number;
    plan_name: string;
    total_credits: number;
    used_credits: number;
    remaining_credits: number;
    expiration_date: string;
    status: 'active' | 'expired' | 'paused';
}

export interface Academy {
    id: string;
    name: string;
    logo_url?: string | null;
    plan?: string;
    currency?: string;
    date_format?: string;
    address?: string | null;
}

// Mapa de permisos por módulo: { classes: { actions: { view: 'all', ... } } }
export type PermissionsMap = Record<string, { actions: Record<string, string> }>;

export interface Subscription {
    status: string;
    is_trial: boolean;
    trial_ends_at: string | null;
    plan: { slug: string; name: string };
    limits: Record<string, number | null>;
    features: Record<string, { enabled: boolean; limit: number | null }>;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
        academy: Academy;
        subscription: Subscription | null;
        modules: string[];
        permissions: PermissionsMap;
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
    icon?: string;
    color?: string;
    sub?: string;
    trend?: string;
    isPositive?: boolean;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primarySoft: string;
    gradient: [string, string];
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}

export type NotificationRoleTarget = 'ADMIN' | 'STUDENT' | 'TEACHER' | 'RECEPTIONIST' | 'ALL';
export type NotificationCategory = 'PAYMENT' | 'CLASS' | 'SYSTEM' | 'ATTENDANCE' | 'REGISTRATION';

export interface DanceFlowNotification {
    id: number;
    user_id: number;
    role_target: NotificationRoleTarget;
    category: NotificationCategory;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationsResponse {
    success: boolean;
    message: string;
    data: DanceFlowNotification[];
    pagination?: Pagination;
}
