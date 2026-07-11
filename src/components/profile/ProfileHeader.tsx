import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileHeaderProps {
    name: string;
    role: string;
    email?: string;
    avatar?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, role, email, avatar }) => {
    const { theme } = useTheme();

    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0] ?? '')
        .join('')
        .toUpperCase();

    return (
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
                {!!email && (
                    <Text style={[styles.email, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {email}
                    </Text>
                )}
                <View style={[styles.roleChip, { backgroundColor: theme.colors.primarySoft }]}>
                    <Text style={[styles.roleText, { color: theme.colors.primary }]}>{role}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        width: 76,
        height: 76,
        borderRadius: 38,
    },
    avatarFallback: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 26,
        fontWeight: '700',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
    },
    email: {
        fontSize: 13,
        marginTop: 2,
    },
    roleChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 8,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
});
