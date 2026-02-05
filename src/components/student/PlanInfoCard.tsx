import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { Title } from '../common/Title';
import { Subtitle } from '../common/Subtitle';
import { Divider } from '../common/Divider';

interface PlanInfoCardProps {
    planName: string;
    description: string;
    price: string;
    status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'INACTIVE';
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
            case 'INACTIVE': return 'default';
            default: return 'primary';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'ACTIVE': return 'ACTIVO';
            case 'PENDING': return 'PENDIENTE';
            case 'EXPIRED': return 'EXPIRADO';
            case 'INACTIVE': return 'INACTIVO';
            default: return status;
        }
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Title title="Información del Plan" />
            </View>

            <View style={styles.row}>
                <Subtitle
                    leftText="Plan Asignado"
                    leftType="secondary"
                    rightText={planName}
                    rightType="primary"
                />
            </View>

            <View style={[styles.descriptionBox, { backgroundColor: theme.colors.background }]}>
                <Subtitle
                    leftText="Descripción"
                    leftType="secondary"
                />
                <Text style={[styles.descText, { color: theme.colors.textPrimary }]}>{description}</Text>
            </View>

            <View>
                <Subtitle
                    leftText="Precio"
                    leftType="secondary"
                    rightText='Estado'
                    rightType='secondary'
                    containerStyle={{ marginBottom: 10 }}
                />
                <View style={styles.row} >
                    <Text style={[styles.price, { color: theme.colors.textPrimary }]}>{price}</Text>
                    <Tag
                        label={getStatusLabel()}
                        type={getStatusType()}
                        variant="soft"
                        size="md"
                    />
                </View>
            </View>

            <Divider
                marginVertical={10}
            />

            <View style={styles.usageContainer}>
                <View>
                    <Subtitle
                        leftText={"Clases Usadas (" + usedClasses.toString() + ")"}
                        rightText={remainingClasses.toString() + " Restantes"}
                        rightType="secondary"
                    />
                </View>
                <View>
                    <View style={[
                        styles.customBarContainer,
                        { backgroundColor: theme.mode === 'dark' ? '#334155' : '#E2E8F0' }
                    ]}>
                        <View
                            style={[
                                styles.customBarFill,
                                {
                                    width: `${Math.min(progressPercent, 100)}%`,
                                    backgroundColor: progressPercent < 80 ? theme.colors.primary : theme.colors.error
                                }
                            ]}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateCol}>
                    <Text style={[styles.smallLabel, { color: theme.colors.textPrimary }]}>Inicio</Text>
                    <View style={styles.dateInfo}>
                        <FontAwesome name="calendar-o" size={12} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={[styles.dateText, { color: theme.colors.textPrimary }]}>{startDate}</Text>
                    </View>
                </View>

                <View style={[styles.dateCol, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.smallLabel, { color: theme.colors.textPrimary }]}>Fin</Text>
                    <View style={styles.dateInfo}>
                        <FontAwesome name="calendar-o" size={12} color={theme.colors.error} style={{ marginRight: 6 }} />
                        <Text style={[styles.dateText, { color: theme.colors.error }]}>{endDate}</Text>
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
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    descText: {
        fontSize: 14,
        lineHeight: 20,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusCol: {
        alignItems: 'flex-end',
    },
    usageContainer: {
        marginBottom: 14,
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
        fontSize: 14,
        fontWeight: '400',
    },
    customBarContainer: {
        height: 8,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    customBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    smallLabel: {
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
});
