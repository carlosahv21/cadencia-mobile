import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    error?: string | null;
    hint?: string;
    secure?: boolean;
    editable?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    error,
    hint,
    secure = false,
    editable = true,
    keyboardType,
    autoCapitalize = 'sentences',
}) => {
    const { theme } = useTheme();
    const [hidden, setHidden] = useState(secure);

    return (
        <View style={styles.field}>
            <View style={styles.labelRow}>
                {icon && <Ionicons name={icon} size={15} color={theme.colors.primary} />}
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
            </View>
            <View style={[
                styles.wrapper,
                {
                    backgroundColor: editable ? theme.colors.surface : theme.colors.primarySoft + '55',
                    borderColor: error ? theme.colors.error : theme.colors.border,
                },
            ]}>
                <TextInput
                    style={[styles.input, { color: editable ? theme.colors.textPrimary : theme.colors.textSecondary }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textSecondary + '66'}
                    secureTextEntry={hidden}
                    editable={editable}
                    keyboardType={keyboardType}
                    autoCapitalize={secure ? 'none' : autoCapitalize}
                />
                {secure && (
                    <TouchableOpacity onPress={() => setHidden(!hidden)} activeOpacity={0.7}>
                        <Ionicons
                            name={hidden ? 'eye-off-outline' : 'eye-outline'}
                            size={18}
                            color={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
                {!editable && (
                    <Ionicons name="lock-closed-outline" size={16} color={theme.colors.textSecondary} />
                )}
            </View>
            {!!error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
            {!error && !!hint && <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>{hint}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
    hint: {
        fontSize: 12,
        marginTop: 4,
        opacity: 0.7,
    },
});
