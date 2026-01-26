import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import { User, Academy, LoginCredentials } from '../types';
import axios from 'axios';

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

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);

            // Verificamos que la respuesta tenga la estructura esperada
            if (response && response.data && response.data.token) {
                const { token, user, settings } = response.data;

                // Guardado paralelo para mejorar la velocidad
                await Promise.all([
                    storage.saveToken(token),
                    storage.saveUser(user),
                    storage.saveAcademy(settings),
                    credentials.rememberMe !== undefined
                        ? storage.saveRememberMe(credentials.rememberMe)
                        : Promise.resolve()
                ]);

                setUser(user);
                setAcademy(settings);

                console.log('¡Login exitoso!');
            } else {
                throw new Error('La respuesta del servidor no contiene los datos necesarios.');
            }
        } catch (error) {
            console.error('Error detallado en el login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status !== 404) {
                console.log('Error de logout:', error.message);
            }
        } finally {
            // Esto es lo que activa el cambio de pantalla en AppNavigator
            await storage.clearAuth();
            setUser(null);
            setAcademy(null);
        }
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