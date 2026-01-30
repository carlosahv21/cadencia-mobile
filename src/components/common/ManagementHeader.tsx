import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ManagementHeaderProps {
    title: string;
    subtitle?: string;
    showSearch?: boolean;
    searchText?: string;
    onSearchChange?: (text: string) => void;
    placeholder?: string;
    // Nuevas propiedades para la búsqueda global
    onBack?: () => void;
    autoFocus?: boolean;
}

export const ManagementHeader: React.FC<ManagementHeaderProps> = ({
    title,
    subtitle,
    showSearch,
    searchText,
    onSearchChange,
    placeholder,
    onBack,
    autoFocus = false,
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, { paddingTop: insets.top + 10 }]}
        >
            <Animated.View
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(200)}
                style={[styles.topRow, { zIndex: 99 }]}>
                <View style={styles.titleContainer}>
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                </View>
            </Animated.View>

            {showSearch && (
                <Animated.View
                    entering={FadeIn.duration(600).delay(200)}
                    style={[
                        styles.searchSection,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            borderRadius: 32.5,
                        }
                    ]}>
                    <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                            placeholder={placeholder}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchText}
                            onChangeText={onSearchChange}
                            autoFocus={autoFocus} // <--- Ahora TS no se quejará
                        />
                        {searchText !== '' && (
                            <TouchableOpacity onPress={() => onSearchChange?.('')}>
                                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    searchSection: {
        marginTop: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 45,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        paddingVertical: 0, // Evita saltos en Android
    },
});