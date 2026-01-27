import { ThemeColors } from '../types';

export const ELECTRIC_BLUE = '#0A84FF';

export const lightColors: ThemeColors = {
    primary: ELECTRIC_BLUE,
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textPrimary: '#2D3436',
    textSecondary: '#6C757D',
    border: '#E0E0E0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
};

export const darkColors: ThemeColors = {
    primary: ELECTRIC_BLUE,
    background: '#121212',      // Basado en colorBgBase (Layout bodyBg)
    surface: '#1E1E1E',         // Basado en colorBgContainer (Header/Sider Bg)
    textPrimary: '#E0E0E0',     // Basado en colorText
    textSecondary: '#A0A0A0',   // Basado en colorTextSecondary
    border: '#2D2D2D',          // Basado en colorBorder
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
};