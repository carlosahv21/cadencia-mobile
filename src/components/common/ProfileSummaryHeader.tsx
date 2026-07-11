import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileSummaryHeaderProps {
    name: string;
    role: string;
    avatar?: string | null;
    email?: string;
    specialty?: string;
    onBack?: () => void;
}

// Header limpio de resumen: botón volver + card con avatar, nombre, rol y contacto
export const ProfileSummaryHeader: React.FC<ProfileSummaryHeaderProps> = ({
    name,
    role,
    avatar,
    email,
    specialty,
    onBack,
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleBack = onBack || (() => navigation.canGoBack() && navigation.goBack());

    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0] ?? '')
        .join('')
        .toUpperCase();

    return (
        <View style={[styles.wrapper, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            >
                <FontAwesome name="chevron-left" size={16} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: theme.colors.primarySoft }]}>
                        <Text style={[styles.initials, { color: theme.colors.primary }]}>{initials}</Text>
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {name}
                    </Text>
                    <View style={[styles.roleChip, { backgroundColor: theme.colors.primarySoft }]}>
                        <Text style={[styles.roleText, { color: theme.colors.primary }]}>
                            {specialty ? `${role} · ${specialty}` : role}
                        </Text>
                    </View>
                    {!!email && (
                        <Text style={[styles.email, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {email}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    avatarFallback: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 24,
        fontWeight: '700',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    roleChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    email: {
        fontSize: 13,
        marginTop: 6,
    },
});
