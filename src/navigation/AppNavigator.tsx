import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const AppNavigator: React.FC = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { theme } = useTheme();

    // Estado para controlar el Onboarding
    const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasSeen = await storage.getOnboardingStatus();
            setIsFirstTime(!hasSeen);
        };
        checkOnboarding();
    }, [isAuthenticated]); // Re-evaluamos cuando el estado de auth cambie

    if (authLoading || (isAuthenticated && isFirstTime === null)) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // 1. ¿NO está logeado? -> Directo al Login
    if (!isAuthenticated) {
        return (
            <NavigationContainer>
                <AuthNavigator />
            </NavigationContainer>
        );
    }

    // 2. ¿ESTÁ logeado pero es PRIMERA VEZ? -> Muestra Onboarding
    if (isFirstTime) {
        return (
            <OnboardingScreen
                onFinish={async () => {
                    await storage.saveOnboardingStatus(true);
                    setIsFirstTime(false);
                }}
            />
        );
    }

    // 3. ¿Logeado y NO es primera vez? -> Dashboard (Tabs)
    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});