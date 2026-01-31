import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';

interface SessionDetailsCardProps {
    timeRange: string;
    duration: string;
    location: string;
    floor: string;
    capacity: number;
}

export const SessionDetailsCard: React.FC<SessionDetailsCardProps> = ({
    timeRange,
    duration,
    location,
    floor,
    capacity
}) => {
    const { theme } = useTheme();

    return (
        <Card style={styles.card}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>DETALLES DE SESIÓN</Text>

            <View style={styles.itemRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.mode === 'light' ? '#F1F5F9' : '#1E293B' }]}>
                    <FontAwesome name="clock-o" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.itemText}>
                    <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{timeRange}</Text>
                    <Text style={[styles.subValue, { color: theme.colors.textSecondary }]}>Duración: {duration}</Text>
                </View>
            </View>

            <View style={styles.itemRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.mode === 'light' ? '#F5F3FF' : '#1E293B' }]}>
                    <FontAwesome name="building-o" size={18} color="#8B5CF6" />
                </View>
                <View style={styles.itemText}>
                    <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{location}</Text>
                    <Text style={[styles.subValue, { color: theme.colors.textSecondary }]}>{floor} • Capacidad: {capacity}</Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemText: {
        flex: 1,
    },
    value: {
        fontSize: 15,
        fontWeight: '700',
    },
    subValue: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
});
