import { ThemeColors } from '../types';

export const BRAND_BLUE = '#0c73dc';

export const lightColors: ThemeColors = {
    primary: BRAND_BLUE,
    primaryLight: '#3f96ee',
    primarySoft: '#e8f1fc',
    gradient: [BRAND_BLUE, '#3f96ee'],
    background: '#f4f8fd',
    surface: '#FFFFFF',
    textPrimary: '#2D3436',
    textSecondary: '#6C757D',
    border: '#E0E0E0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
};

export const darkColors: ThemeColors = {
    primary: '#3f96ee',
    primaryLight: '#6cb0f3',
    primarySoft: '#12283f',
    gradient: ['#0a5cb0', BRAND_BLUE],
    background: '#121212',      // Basado en colorBgBase (Layout bodyBg)
    surface: '#1E1E1E',         // Basado en colorBgContainer (Header/Sider Bg)
    textPrimary: '#E0E0E0',     // Basado en colorText
    textSecondary: '#A0A0A0',   // Basado en colorTextSecondary
    border: '#2D2D2D',          // Basado en colorBorder
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
};
