import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface SectionHeaderProps {
    title: string;
    actionText?: string;
    onActionPress?: () => void;
    containerStyle?: object;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionText,
    onActionPress,
    containerStyle
}) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                {title}
            </Text>

            {actionText && onActionPress && (
                <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
                    <Text style={[styles.action, { color: theme.colors.primary }]}>
                        {actionText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    action: {
        fontSize: 14,
        fontWeight: '600',
    },
});