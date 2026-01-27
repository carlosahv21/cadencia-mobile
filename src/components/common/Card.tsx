import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, noPadding }) => {
    const { theme } = useTheme();

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.xl,
                    padding: noPadding ? 0 : 16,
                },
                style
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        marginBottom: 12,
    },
});