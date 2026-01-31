import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';

interface PaymentSummaryCardProps {
    pendingAmount: string;
    paidAmount: string;
    nextCutDate: string;
    onViewHistory?: () => void;
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
    pendingAmount,
    paidAmount,
    nextCutDate,
    onViewHistory
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.outerContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Resumen de Pagos</Text>
                <TouchableOpacity onPress={onViewHistory}>
                    <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>Ver Historial</Text>
                </TouchableOpacity>
            </View>

            <Card style={styles.card}>
                <View style={styles.amountsRow}>
                    <View style={styles.amountCol}>
                        <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Por Pagar</Text>
                        <Text style={[styles.amountValue, { color: theme.colors.textPrimary }]}>{pendingAmount}</Text>
                    </View>
                    <View style={styles.amountCol}>
                        <Text style={[styles.amountLabel, { color: theme.colors.textSecondary, textAlign: 'right' }]}>Pagado este mes</Text>
                        <Text style={[styles.amountValue, { color: theme.colors.success, textAlign: 'right' }]}>{paidAmount}</Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                <View style={styles.infoRow}>
                    <FontAwesome name="info-circle" size={14} color={theme.colors.textSecondary} style={styles.infoIcon} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                        Próximo corte: {nextCutDate}
                    </Text>
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        marginTop: 0,
    },
    amountsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    amountCol: {
        flex: 1,
    },
    amountLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 6,
    },
    amountValue: {
        fontSize: 22,
        fontWeight: '800',
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
        opacity: 0.5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
