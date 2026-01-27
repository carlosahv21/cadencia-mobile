import { ThemeMode, ThemeColors } from '../types';
import { lightColors, darkColors } from './colors';
import { typography } from './typography';

export interface Theme {
    mode: ThemeMode;
    colors: ThemeColors;
    typography: typeof typography;
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
        full: number;
    };
}

export const getTheme = (mode: ThemeMode): Theme => {
    const colors = mode === 'light' ? lightColors : darkColors;

    return {
        mode,
        colors,
        typography,
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            '2xl': 48,
        },
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
            '2xl': 24,
            full: 9999,
        },
    };
};