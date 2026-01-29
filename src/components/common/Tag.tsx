import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface TagProps {
    label: string | React.ReactNode;
    variant?: 'filled' | 'outline' | 'soft';
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'transparent';
    color?: string;
    textToUpperCase?: boolean;
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const Tag: React.FC<TagProps> = ({
    label,
    variant = 'soft',
    type,
    color,
    textToUpperCase = false,
    size = 'md',
    icon,
    onPress,
    style,
    textStyle,
}) => {
    const { theme } = useTheme();
    const baseColor = color || theme.colors.primary;

    const getBackgroundColor = () => {
        if (color) {
            // If explicit color is provided, respect variant logic (unless it's filled)
            switch (variant) {
                case 'filled': return color;
                case 'outline': return 'transparent';
                case 'soft': return theme.mode === 'dark' ? `${color}20` : `${color}15`;
                default: return color;
            }
        }

        if (type && type !== 'default') {
            if (theme.mode === 'light') {
                switch (type) {
                    case 'success': return '#D1FAE5';
                    case 'warning': return '#FEF3C7';
                    case 'danger': return '#FEE2E2';
                    case 'primary': return '#DBEAFE';
                    case 'transparent': return 'rgba(255, 255, 255, 0.2)';
                    default: return theme.colors.primary;
                }
            } else {
                switch (type) {
                    case 'success': return 'rgb(16, 185, 129, 0.2)';
                    case 'warning': return 'rgba(245, 158, 11, 0.2)';
                    case 'danger': return 'rgba(239, 68, 68, 0.2)';
                    case 'primary': return 'rgba(14, 165, 233, 0.2)';
                    case 'transparent': return 'rgba(255, 255, 255, 0.2)';

                    default: return theme.colors.primary;
                }
            }
        }

        switch (variant) {
            case 'filled': return baseColor;
            case 'outline': return 'transparent';
            case 'soft': return 'rgba(255, 255, 255, 0.2)';
            default: return baseColor;
        }
    };

    const getBorderColor = () => {
        if (variant === 'outline') {
            if (color) return color;
            if (type) {
                switch (type) {
                    case 'success': return theme.colors.success;
                    case 'warning': return theme.colors.warning;
                    case 'danger': return theme.colors.error;
                    case 'primary': return theme.colors.primary;
                    case 'transparent': return 'rgba(255, 255, 255, 0.2)';
                }
            }
            return baseColor;
        }
        return 'transparent';
    };

    const getTextColor = () => {
        if (color) return variant === 'filled' ? '#FFFFFF' : color;

        if (type && type !== 'default') {
            switch (type) {
                case 'success': return '#22C55E';
                case 'warning': return '#FBBF24';
                case 'danger': return '#EF4444';
                case 'primary': return '#0EA5E9';
                case 'transparent': return '#FFFFFF';
            }
        }

        switch (variant) {
            case 'filled': return '#FFFFFF';
            case 'outline': return baseColor;
            case 'soft': return '#FFFFFF';
            default: return '#FFFFFF';
        }
    };

    const getPaddingVertical = () => {
        switch (size) {
            case 'sm': return 4;
            case 'md': return 6;
            case 'lg': return 8;
            default: return 6;
        }
    };

    const getPaddingHorizontal = () => {
        switch (size) {
            case 'sm': return 8;
            case 'md': return 10;
            case 'lg': return 12;
            default: return 12;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return 10;
            case 'md': return 12;
            case 'lg': return 14;
            default: return 12;
        }
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    paddingVertical: getPaddingVertical(),
                    paddingHorizontal: getPaddingHorizontal(),
                    borderRadius: 6,
                },
                style,
            ]}
        >
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text
                style={[
                    styles.text,
                    {
                        color: getTextColor(),
                        fontSize: getFontSize(),
                    },
                    textStyle,
                ]}
            >
                {textToUpperCase && typeof label === 'string' ? label.toUpperCase() : label}
            </Text>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 6,
    },
    text: {
        fontWeight: '400',
    },
});
