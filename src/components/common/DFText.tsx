import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { textStyles } from '../../theme/typography';

interface Props {
    variant?: keyof typeof textStyles;
    color?: 'primary' | 'secondary' | 'error';
    children: React.ReactNode;
    style?: TextStyle;
}

export const DFText = ({ variant = 'body', color = 'primary', children, style }: Props) => {
    const { theme } = useTheme();

    const colorMap = {
        primary: theme.colors.textPrimary,
        secondary: theme.colors.textSecondary,
        error: theme.colors.error,
    };

    return (
        <Text style={[textStyles[variant], { color: colorMap[color] }, style]}>
            {children}
        </Text>
    );
};