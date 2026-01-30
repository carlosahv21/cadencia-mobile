import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface EmptyStateProps {
    icon?: keyof typeof FontAwesome.glyphMap | any; 
    title: string;
    description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'folder-open-o', title, description }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.border + '33' }]}>
                <FontAwesome name={icon} size={40} color={theme.colors.textSecondary} style={{ opacity: 0.5 }} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
            {description && (
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    {description}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});