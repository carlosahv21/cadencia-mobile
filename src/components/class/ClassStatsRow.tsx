import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';

interface StatItemProps {
    value: string | number;
    label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
    const { theme } = useTheme();
    return (
        <Card style={styles.statCard} noPadding>
            <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label.toUpperCase()}</Text>
            </View>
        </Card>
    );
};

interface ClassStatsRowProps {
    occupancy: string;
    enrolled: number;
    avgAttendance: number;
}

export const ClassStatsRow: React.FC<ClassStatsRowProps> = ({
    occupancy,
    enrolled,
    avgAttendance
}) => {
    return (
        <View style={styles.container}>
            <StatItem value={occupancy} label="ocupación" />
            <StatItem value={enrolled} label="inscritos" />
            <StatItem value={avgAttendance} label="asist. prom" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 4,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 16,
        alignItems: 'center',
    },
    statContent: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
