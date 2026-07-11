import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';

interface BackHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
}

// Header limpio estilo Agenda: botón circular de volver + título sobre el fondo
export const BackHeader: React.FC<BackHeaderProps> = ({ title, subtitle, onBack }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleBack = onBack || (() => navigation.canGoBack() && navigation.goBack());

    return (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            >
                <FontAwesome name="chevron-left" size={16} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerText}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                    {title}
                </Text>
                {!!subtitle && (
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
});
