// TypeScript type definitions for DanceFlow Mobile

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  plan?: string | null;
  permissions?: string[];
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
  message: string;
  success: boolean;
  data: {
    token: string;
    user: User;
    settings: Academy;
    permissions?: string[];
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
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
