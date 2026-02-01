import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface SubtitleProps {
    leftText: string;
    leftType?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'secondary';
    leftToUpper?: boolean;
    rightText?: string;
    rightType?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'secondary';
    rightToUpper?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

export const Subtitle: React.FC<SubtitleProps> = ({
    leftText,
    leftType = 'default',
    leftToUpper,
    rightText,
    rightType = 'default',
    rightToUpper,
    containerStyle,
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
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.Text,  { color: getColor(leftType) }]}>
                {leftToUpper ? leftText.toUpperCase() : leftText}
            </Text>

            {rightText && (
                <View style={styles.rightContainer}>
                    <Text style={[styles.Text, styles.rightText, { color: getColor(rightType) }]}>
                        {rightToUpper ? rightText.toUpperCase() : rightText}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        width: '100%',
    },
    Text: {
        fontSize: 14,
        fontWeight: '600',
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    rightText: {
        textAlign: 'right',
    },
});