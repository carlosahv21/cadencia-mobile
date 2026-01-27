import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export const SearchInput = () => {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: 32.5,
            }
        ]}>
            <FontAwesome
                name="search"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.icon}
            />
            <TextInput
                placeholder="Buscar clases, profesores o eventos..."
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.input, { color: theme.colors.textPrimary }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        // Sombra muy sutil para dar profundidad
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
});