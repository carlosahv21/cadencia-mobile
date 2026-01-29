import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

export interface ButtonProps {
    title?: string;
    onPress: () => void;
    variant?: 'solid' | 'outline' | 'filled';
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'transparent';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    icon?: React.ReactNode | keyof typeof FontAwesome.glyphMap;
    iconSize?: number;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    fullWidth?: boolean;
    badge?: boolean;
    textToUppercase?: boolean;
    floating?: 'left' | 'right' | 'center';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant,
    type = 'primary',
    size = 'md',
    icon,
    iconSize = 20,
    loading = false,
    disabled = false,
    style,
    textStyle,
    fullWidth = false,
    badge = false,
    textToUppercase = false,
    floating,
}) => {
    const { theme } = useTheme();

    // Determine variant based on theme if not provided
    // Light mode -> Solid, Dark mode -> Outline (as per request)
    const activeVariant = variant || (theme.mode === 'light' ? 'solid' : 'outline');

    // Determine if it should be an icon-only circular button
    const isIconOnly = !title && !!icon;

    const getBaseColor = () => {
        switch (type) {
            case 'default': return theme.mode === 'dark' ? 'rgb(30, 30, 30)' : '#FFFFFF';
            case 'success': return theme.mode === 'dark' ? 'rgb(16, 185, 129, 0.2)' : '#10B981';
            case 'warning': return theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : '#F59E0B';
            case 'danger': return theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : theme.colors.error;
            case 'primary': return theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.2)' : theme.colors.primary;
            case 'transparent': return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            default: return theme.colors.primary;
        }
    };

    const getBackgroundColor = () => {
        if (disabled) return theme.colors.border;

        const baseColor = getBaseColor();

        switch (activeVariant) {
            case 'solid':
                // Solid uses the strong color (or standard theme color)
                if (type === 'primary') return theme.colors.primary;
                if (type === 'danger') return theme.colors.error;
                if (type === 'success') return '#10B981';
                if (type === 'warning') return '#F59E0B';
                return baseColor;
            case 'filled':
                // Filled uses the soft/rgba color
                if (theme.mode === 'dark') return baseColor; // Already rgba in dark mode baseColor
                // Light mode 'filled' (soft)
                switch (type) {
                    case 'default': return '#FFFFFF';
                    case 'success': return '#D1FAE5';
                    case 'warning': return '#FEF3C7';
                    case 'danger': return '#FEE2E2';
                    case 'primary': return '#DBEAFE';
                    case 'transparent': return 'rgba(255, 255, 255, 0.2)';
                    default: return theme.colors.primary;
                }
            case 'outline': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textSecondary;

        if (activeVariant === 'solid') return '#FFFFFF';

        // For Outline and Filled, we use the specific text color
        switch (type) {
            case 'default': return theme.mode === 'dark' ? 'rgb(224, 224, 224)' : '#2D3436';
            case 'success': return '#22C55E';
            case 'warning': return '#FBBF24';
            case 'danger': return '#EF4444';
            case 'primary': return '#0EA5E9';
            case 'transparent': return '#FFFFFF';
            default: return theme.colors.primary;
        }
    };

    const getHeight = () => {
        switch (size) {
            case 'xs': return 32;
            case 'sm': return 40;
            case 'lg': return 56;
            default: return 48; // md
        }
    };

    // For icon-only, width equals height to make it a square/circle
    const getWidth = () => {
        if (fullWidth) return '100%';
        if (isIconOnly) return getHeight();
        return undefined;
    };

    const getPadding = () => {
        if (isIconOnly) return 0; // Center content for circular button
        switch (size) {
            case 'xs': return 6;
            case 'sm': return 10;
            case 'lg': return 24;
            default: return 16; // md
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'xs': return 10;
            case 'sm': return 12;
            case 'lg': return 18;
            default: return 16; // md
        }
    };

    const getBorderColor = () => {
        if (activeVariant !== 'outline') return 'transparent';

        // Return text color for border
        return getTextColor();
    };

    const renderIcon = () => {
        if (!icon) return null;

        if (typeof icon === 'string') {
            return (
                <FontAwesome
                    name={icon as any}
                    size={iconSize}
                    color={getTextColor()}
                />
            );
        }

        return icon;
    };

    const getFloatingStyle = (): ViewStyle => {
        if (!floating) return {};

        const baseStyle: ViewStyle = {
            position: 'absolute',
            zIndex: 10,
        };

        switch (floating) {
            case 'left': return { ...baseStyle, left: 16 };
            case 'right': return { ...baseStyle, right: 16 };
            case 'center': return { ...baseStyle, alignSelf: 'center' };
            default: return baseStyle;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                getFloatingStyle(),
                {
                    backgroundColor: getBackgroundColor(),
                    height: getHeight(),
                    width: getWidth(),
                    paddingHorizontal: getPadding(),
                    borderRadius: isIconOnly ? getHeight() / 2 : theme.borderRadius.md,
                    borderColor: getBorderColor(),
                    borderWidth: activeVariant === 'outline' ? 1 : 0,
                    opacity: disabled ? 0.7 : 1,
                },
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <View style={styles.contentContainer}>
                    {icon && <View style={[styles.iconContainer, !title && { marginRight: 0 }]}>{renderIcon()}</View>}
                    {title && (
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
                            {textToUppercase ? title.toUpperCase() : title}
                        </Text>
                    )}
                </View>
            )}
            {badge && (
                <View style={[styles.badge, { borderColor: getBackgroundColor() === 'transparent' ? theme.colors.background : getBackgroundColor() }]} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontWeight: '600',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
    },
});
