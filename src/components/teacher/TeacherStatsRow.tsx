import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';

interface StatItemProps {
    value: string | number;
    label: string;
    icon?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => {
    const { theme } = useTheme();
    return (
        <Card style={styles.statCard} noPadding>
            <View style={styles.statContent}>
                <View style={styles.valueRow}>
                    <Text style={[styles.statValue, { color: theme.colors.primary }]}>{value}</Text>
                    {icon && <FontAwesome name={icon as any} size={12} color={theme.colors.primary} style={styles.statIcon} />}
                </View>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label.toUpperCase()}</Text>
            </View>
        </Card>
    );
};

interface TeacherStatsRowProps {
    classesCount: number;
    rating: number;
    studentsCount: number;
}

export const TeacherStatsRow: React.FC<TeacherStatsRowProps> = ({
    classesCount,
    rating,
    studentsCount
}) => {
    return (
        <View style={styles.container}>
            <StatItem value={classesCount} label="clases" />
            <StatItem value={rating} label="rating" icon="star" />
            <StatItem value={studentsCount} label="alumnos" />
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
        paddingVertical: 20,
        alignItems: 'center',
    },
    statContent: {
        alignItems: 'center',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    statIcon: {
        marginLeft: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
