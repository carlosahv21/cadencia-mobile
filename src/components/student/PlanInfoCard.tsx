import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Progress } from '@ant-design/react-native';

interface PlanInfoCardProps {
    planName: string;
    description: string;
    price: string;
    status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
    usedClasses: number;
    totalClasses: number;
    startDate: string;
    endDate: string;
}

export const PlanInfoCard: React.FC<PlanInfoCardProps> = ({
    planName,
    description,
    price,
    status,
    usedClasses,
    totalClasses,
    startDate,
    endDate
}) => {
    const { theme } = useTheme();
    const remainingClasses = totalClasses - usedClasses;
    const progressPercent = (usedClasses / totalClasses) * 100;

    const getStatusType = () => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'PENDING': return 'warning';
            case 'EXPIRED': return 'danger';
            default: return 'primary';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'ACTIVE': return 'ACTIVO';
            case 'PENDING': return 'PENDIENTE';
            case 'EXPIRED': return 'EXPIRADO';
            default: return status;
        }
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'light' ? '#EBF5FF' : '#1E293B' }]}>
                    <FontAwesome name="file-text" size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Información del Plan Actual</Text>
            </View>

            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Plan Asignado</Text>
                <Text style={[styles.planName, { color: theme.colors.primary }]}>{planName}</Text>
            </View>

            <View style={[styles.descriptionBox, { backgroundColor: theme.mode === 'light' ? '#F8FAFC' : '#111827' }]}>
                <Text style={[styles.descLabel, { color: theme.colors.textSecondary }]}>DESCRIPCIÓN</Text>
                <Text style={[styles.descText, { color: theme.colors.textPrimary }]}>{description}</Text>
            </View>

            <View style={styles.priceStatusRow}>
                <View>
                    <Text style={[styles.descLabel, { color: theme.colors.textSecondary }]}>PRECIO</Text>
                    <Text style={[styles.price, { color: theme.colors.textPrimary }]}>{price}</Text>
                </View>
                <View style={styles.statusCol}>
                    <Text style={[styles.descLabel, { color: theme.colors.textSecondary, textAlign: 'right' }]}>ESTADO</Text>
                    <Tag
                        label={getStatusLabel()}
                        type={getStatusType()}
                        variant="soft"
                        size="sm"
                    />
                </View>
            </View>

            <View style={styles.usageContainer}>
                <View style={styles.usageLabels}>
                    <Text style={[styles.usageLabel, { color: theme.colors.textSecondary }]}>
                        Clases Usadas ({usedClasses})
                    </Text>
                    <Text style={[styles.usageLabel, { color: theme.colors.textSecondary }]}>
                        {remainingClasses} Restantes
                    </Text>
                </View>
                <Progress
                    percent={progressPercent}
                    barStyle={{ height: 8, borderRadius: 4, backgroundColor: theme.mode === 'light' ? '#E2E8F0' : '#334155' }}
                    style={{ height: 8, backgroundColor: 'transparent' }}
                />
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateCol}>
                    <Text style={[styles.descLabel, { color: theme.colors.textSecondary }]}>INICIO</Text>
                    <View style={styles.dateInfo}>
                        <FontAwesome name="calendar-o" size={14} color={theme.colors.textSecondary} style={styles.calendarIcon} />
                        <Text style={[styles.dateText, { color: theme.colors.textPrimary }]}>{startDate}</Text>
                    </View>
                </View>
                <View style={styles.dateCol}>
                    <Text style={[styles.descLabel, { color: theme.colors.textSecondary }]}>FIN</Text>
                    <View style={styles.dateInfo}>
                        <FontAwesome name="calendar-o" size={14} color="#F87171" style={styles.calendarIcon} />
                        <Text style={[styles.dateText, { color: '#F87171' }]}>{endDate}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    planName: {
        fontSize: 15,
        fontWeight: '700',
    },
    descriptionBox: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    descLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    descText: {
        fontSize: 13,
        lineHeight: 18,
    },
    priceStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
    },
    statusCol: {
        alignItems: 'flex-end',
    },
    usageContainer: {
        marginBottom: 20,
    },
    usageLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    usageLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateCol: {
        flex: 1,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    calendarIcon: {
        marginRight: 6,
    },
    dateText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
