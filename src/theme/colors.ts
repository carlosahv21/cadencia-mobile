import { ThemeColors } from '../types';

// Electric Blue - Primary Brand Color
export const ELECTRIC_BLUE = '#0ea5e9';

// Light Mode Colors
export const lightColors: ThemeColors = {
  primary: ELECTRIC_BLUE,
  background: '#ffffff',
  surface: '#f9fafb',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

// Dark Mode Colors
export const darkColors: ThemeColors = {
  primary: ELECTRIC_BLUE,
  background: '#0f172a',
  surface: '#1e293b',
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  border: '#334155',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
};
