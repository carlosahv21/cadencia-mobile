import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TitleProps {
    title: string;
    toUpperCase?: boolean;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'secondary';
    titleStyle?: TextStyle;
}

export const Title: React.FC<TitleProps> = ({
    title,
    toUpperCase,
    type,
    titleStyle
}) => {
    const { theme } = useTheme();

    const getColor = (type: string) => {
        switch (type) {
            case 'primary': return theme.colors.primary;
            case 'success': return theme.colors.success;
            case 'warning': return theme.colors.warning;
            case 'danger': return theme.colors.error;
            case 'secondary': return theme.colors.textSecondary;
            default: return theme.colors.textPrimary;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: getColor(type || 'default') }, titleStyle]}>
                {toUpperCase ? title.toUpperCase() : title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.5,
        marginBottom: 14,
    },
});