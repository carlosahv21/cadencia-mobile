import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
}

export const DFCard = ({ children, style, noPadding }: Props) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    padding: noPadding ? 0 : theme.spacing.md,
                    borderColor: theme.colors.border,
                    borderWidth: theme.mode === 'light' ? 1 : 0
                },
                style
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
});