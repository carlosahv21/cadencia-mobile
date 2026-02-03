import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ACADEMY_KEY = 'academy_data';
const REMEMBER_ME_KEY = 'remember_me';
const THEME_KEY = 'theme_mode';
const ONBOARDING_KEY = 'has_seen_onboarding';
const PUSH_TOKEN_KEY = 'push_token';

// Helper para detectar si estamos en Web
const isWeb = Platform.OS === 'web';

export const storage = {
    // Token (SecureStore en móvil, localStorage en Web)
    async saveToken(token: string): Promise<void> {
        if (isWeb) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    },

    async getToken(): Promise<string | null> {
        if (isWeb) {
            return localStorage.getItem(TOKEN_KEY);
        } else {
            // Usamos un try-catch aquí porque SecureStore puede fallar 
            // si el dispositivo no tiene pin/seguridad activada
            try {
                return await SecureStore.getItemAsync(TOKEN_KEY);
            } catch (e) {
                return null;
            }
        }
    },

    async removeToken(): Promise<void> {
        if (isWeb) {
            localStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    },

    // User (AsyncStorage - funciona en Web y Móvil automáticamente)
    async saveUser(user: any): Promise<void> {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    async getUser(): Promise<any | null> {
        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },
    async removeUser(): Promise<void> {
        await AsyncStorage.removeItem(USER_KEY);
    },

    // Academy
    async saveAcademy(academy: any): Promise<void> {
        await AsyncStorage.setItem(ACADEMY_KEY, JSON.stringify(academy));
    },
    async getAcademy(): Promise<any | null> {
        const data = await AsyncStorage.getItem(ACADEMY_KEY);
        return data ? JSON.parse(data) : null;
    },
    async removeAcademy(): Promise<void> {
        await AsyncStorage.removeItem(ACADEMY_KEY);
    },

    // Onboarding
    async saveOnboardingStatus(seen: boolean): Promise<void> {
        await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(seen));
    },
    async getOnboardingStatus(): Promise<boolean> {
        const data = await AsyncStorage.getItem(ONBOARDING_KEY);
        return data ? JSON.parse(data) : false;
    },
    async removeOnboardingStatus(): Promise<void> {
        await AsyncStorage.removeItem(ONBOARDING_KEY);
    },

    // Otros
    async saveRememberMe(remember: boolean): Promise<void> {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(remember));
    },
    async getRememberMe(): Promise<boolean> {
        const data = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        return data ? JSON.parse(data) : false;
    },

    async saveTheme(mode: 'light' | 'dark'): Promise<void> {
        await AsyncStorage.setItem(THEME_KEY, mode);
    },
    async getTheme(): Promise<'light' | 'dark' | null> {
        return (await AsyncStorage.getItem(THEME_KEY)) as 'light' | 'dark' | null;
    },

    // Push Token
    async savePushToken(token: string): Promise<void> {
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    },
    async getPushToken(): Promise<string | null> {
        return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    },
    async removePushToken(): Promise<void> {
        await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
    },

    // Limpieza total
    async clearAuth(): Promise<void> {
        await Promise.all([
            this.removeToken(),
            this.removeUser(),
            this.removeAcademy(),
            this.removePushToken()
        ]);
    },
};