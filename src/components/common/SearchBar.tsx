import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

// Barra de búsqueda estilo card (surface redondeada, sombra suave)
export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder, autoFocus }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} />
            <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary + '99'}
                autoFocus={autoFocus}
                autoCapitalize="none"
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        marginHorizontal: 20,
        marginTop: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
});
