import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Tag } from '../common/Tag';

interface AtRiskUser {
    id: string;
    name: string;
    daysInactive: number;
    phone: string;
    avatar?: string;
}

export const AttentionSection = ({ users = [] }: { users: AtRiskUser[] }) => {
    const { theme } = useTheme();

    const handleWhatsApp = (name: string, phone: string) => {
        const message = `Hola ${name}, te extrañamos en DanceFlow. ¡Esperamos verte pronto en clase!`;
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`);
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(600).delay(600)}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    {/* Icono corregido para FontAwesome */}
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        Alumnos en riesgo
                        {users.length > 0 && (
                            <FontAwesome name="exclamation-triangle" size={20} color="#EF4444" />
                        )}
                    </Text>
                </View>
                <Tag
                    label={`${users.length} en riesgo`}
                    type="danger"
                    variant="filled"
                    size='sm'
                    style={{ marginBottom: 12, borderRadius: 8 }}
                />

            </View>

            {users.length > 0 ? (
                users.map((user) => (
                    <Card key={user.id} style={styles.userCard}>
                        <View style={styles.cardContent}>
                            <View style={styles.avatarContainer}>
                                {user.avatar ? (
                                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.initialsCircle, { backgroundColor: '#F1F5F9' }]}>
                                        <Text style={styles.initialsText}>
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                                    {user.name}
                                </Text>
                                <Text style={styles.statusText}>
                                    Inactive: {user.daysInactive} days
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.waButton}
                                onPress={() => handleWhatsApp(user.name, user.phone)}
                            >
                                <FontAwesome name="whatsapp" size={28} color="#22C55E" />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={{ color: theme.colors.textSecondary }}>
                        No hay alumnos en riesgo
                    </Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, marginTop: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '500', marginRight: 10 },
    userCard: { marginBottom: 1, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: { marginRight: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    initialsCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
    infoContainer: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '500' },
    statusText: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
    waButton: { padding: 4 },
    emptyState: { paddingVertical: 10, alignItems: 'center' } // Reducido de 20
});