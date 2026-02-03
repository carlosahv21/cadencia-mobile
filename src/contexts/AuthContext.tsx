import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { authService } from '../services/auth.service';
import { notificationService } from '../services/notification.service';
import { storage } from '../utils/storage';
import { User, Academy, LoginCredentials } from '../types';
import axios from 'axios';
import '../i18n';
import i18n from '../i18n';
import * as Localization from 'expo-localization';

interface AuthContextData {
    user: User | null;
    academy: Academy | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [academy, setAcademy] = useState<Academy | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    // Effect to sync language with academy settings
    useEffect(() => {
        if (academy?.language) {
            i18n.changeLanguage(academy.language);
        } else {
            // If no academy (logout or not logged in), revert to device language
            const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'es';
            i18n.changeLanguage(deviceLang);
        }
    }, [academy]);

    const loadStoredAuth = async () => {
        try {
            // Gracias a la corrección en storage.ts, esto ya no lanzará 
            // la excepción de "SecureStore is not a function" en Web.
            const [storedUser, storedAcademy, token] = await Promise.all([
                storage.getUser(),
                storage.getAcademy(),
                storage.getToken(),
            ]);

            if (token && storedUser) {
                setUser(storedUser);
                setAcademy(storedAcademy);
            }
        } catch (error) {
            // Silenciamos errores de carga inicial para no asustar al usuario
            console.error('Error loading stored auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const registerPushNotifications = async (userId: number) => {
        // Solo registrar en dispositivos físicos (no en web ni emuladores)
        if (Platform.OS === 'web') {
            console.log('⚠️ Notificaciones push no disponibles en web');
            return;
        }

        try {
            const pushToken = await notificationService.registerForPushNotificationsAsync();

            if (pushToken) {
                // Guardar token localmente
                await storage.savePushToken(pushToken);

                // Enviar token al backend
                await authService.updatePushToken(userId, pushToken);
            }
        } catch (error) {
            console.error('❌ Error al registrar push token:', error);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials); // Esto devuelve AuthResponse

            if (response.success && response.data) {
                const { token, user, settings } = response.data;

                await Promise.all([
                    storage.saveToken(token),
                    storage.saveUser(user),
                    storage.saveAcademy(settings),
                ]);

                setUser(user);
                setAcademy(settings);

                // Registrar notificaciones push después de login exitoso
                await registerPushNotifications(user.id);
            }
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-lanzar para que el componente de login pueda manejarlo
        }
    };

    const logout = async () => {
        await storage.clearAuth();
        setUser(null);
        setAcademy(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                academy,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};