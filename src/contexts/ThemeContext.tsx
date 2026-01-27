import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../utils/storage';
import { ThemeMode } from '../types';
import { getTheme, Theme } from '../theme/theme';
import { useAuth } from './AuthContext';
import { Provider as AntdProvider } from '@ant-design/react-native';
import { getAntdTheme } from '../theme/antdTheme';

interface ThemeContextData {
    theme: Theme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
    const { academy } = useAuth();

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        if (academy?.theme) {
            const apiTheme = academy.theme as ThemeMode;
            if (apiTheme !== themeMode) {
                setThemeModeState(apiTheme);
                storage.saveTheme(apiTheme);
            }
        }
    }, [academy?.theme]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await storage.getTheme();
            if (savedTheme) {
                setThemeModeState(savedTheme);
            } else {
                setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await storage.saveTheme(mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
    };

    const theme = getTheme(themeMode);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeMode,
                toggleTheme,
                setThemeMode,
            }}
        >
            <AntdProvider theme={getAntdTheme(theme)}>
                {children}
            </AntdProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};