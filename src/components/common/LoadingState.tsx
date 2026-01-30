import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message, fullScreen = true }) => {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.container, 
            fullScreen && styles.fullScreen, 
            { backgroundColor: theme.colors.background }
        ]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            {message && (
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    {message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fullScreen: {
        flex: 1,
    },
    text: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '500',
    },
});