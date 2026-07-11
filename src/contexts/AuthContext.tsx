import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { authService } from '../services/auth.service';
import { notificationService } from '../services/notification.service';
import { storage } from '../utils/storage';
import { User, Academy, LoginCredentials, PermissionsMap, Subscription } from '../types';
import '../i18n';
import i18n from '../i18n';
import * as Localization from 'expo-localization';

interface AuthContextData {
    user: User | null;
    academy: Academy | null;
    permissions: PermissionsMap | null;
    modules: string[];
    subscription: Subscription | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    can: (module: string, action?: string) => boolean;
    hasModule: (module: string) => boolean;
    hasFeature: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [academy, setAcademy] = useState<Academy | null>(null);
    const [permissions, setPermissions] = useState<PermissionsMap | null>(null);
    const [modules, setModules] = useState<string[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    // Idioma: elección manual en la app > preferencia del usuario > dispositivo
    useEffect(() => {
        (async () => {
            const stored = await storage.getLanguage();
            if (stored) {
                i18n.changeLanguage(stored);
            } else if (user?.language) {
                i18n.changeLanguage(user.language);
            } else {
                const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'es';
                i18n.changeLanguage(deviceLang);
            }
        })();
    }, [user?.language]);

    const loadStoredAuth = async () => {
        try {
            const [storedUser, storedAcademy, storedMeta, token] = await Promise.all([
                storage.getUser(),
                storage.getAcademy(),
                storage.getSessionMeta(),
                storage.getToken(),
            ]);

            if (token && storedUser) {
                setUser(storedUser);
                setAcademy(storedAcademy);
                setPermissions(storedMeta?.permissions ?? null);
                setModules(storedMeta?.modules ?? []);
                setSubscription(storedMeta?.subscription ?? null);
            }
        } catch (error) {
            // Silenciamos errores de carga inicial para no asustar al usuario
            console.error('Error loading stored auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const registerPushNotifications = async (userId: string) => {
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
                const { token, user, academy, permissions, modules, subscription } = response.data;
                const meta = { permissions, modules, subscription };

                await Promise.all([
                    storage.saveToken(token),
                    storage.saveUser(user),
                    storage.saveAcademy(academy),
                    storage.saveSessionMeta(meta),
                    ...(user.theme ? [storage.saveTheme(user.theme)] : []),
                ]);

                setUser(user);
                setAcademy(academy);
                setPermissions(permissions ?? null);
                setModules(modules ?? []);
                setSubscription(subscription ?? null);

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
        setPermissions(null);
        setModules([]);
        setSubscription(null);
    };

    const can = (module: string, action: string = 'view') =>
        !!permissions?.[module]?.actions?.[action];

    const hasModule = (module: string) => modules.includes(module);

    const hasFeature = (feature: string) =>
        !!subscription?.features?.[feature]?.enabled;

    return (
        <AuthContext.Provider
            value={{
                user,
                academy,
                permissions,
                modules,
                subscription,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                can,
                hasModule,
                hasFeature,
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
