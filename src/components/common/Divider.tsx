import React from 'react';
import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface DividerProps {
    marginVertical?: number;
    type?: 'solid' | 'dashed';
    color?: string;
    thickness?: number;
    text?: string;
    textPosition?: 'start' | 'center' | 'end';
    textStyle?: TextStyle;
    style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
    marginVertical = 20,
    type = 'solid',
    color,
    thickness = 1,
    text,
    textPosition = 'center',
    textStyle,
    style,
}) => {
    const { theme } = useTheme();
    const dividerColor = color || theme.colors.border;

    const lineStyle: ViewStyle = {
        flex: 1,
        borderBottomWidth: thickness,
        borderBottomColor: dividerColor,
        borderStyle: type,
    };

    // Si no hay texto, devolvemos una línea simple más eficiente
    if (!text) {
        return (
            <View
                style={[
                    {
                        marginVertical,
                        borderBottomWidth: thickness,
                        borderBottomColor: dividerColor,
                        borderStyle: type,
                    },
                    style,
                ]}
            />
        );
    }

    return (
        <View style={[styles.container, { marginVertical }, style]}>
            {/* Línea izquierda: se oculta si el texto está al inicio */}
            {textPosition !== 'start' && <View style={lineStyle} />}

            <Text
                style={[
                    styles.text,
                    { 
                        color: theme.colors.textSecondary,
                        marginHorizontal: text ? 10 : 0 
                    },
                    textStyle,
                ]}
            >
                {text}
            </Text>

            {textPosition !== 'end' && <View style={lineStyle} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
    },
});