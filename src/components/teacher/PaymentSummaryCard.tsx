import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Subtitle } from '../common/Subtitle';
import { Divider } from '../common/Divider';

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
        <View>
            <View>
                <SectionHeader
                    title="Resumen de pagos"
                    // actionText='Ver historial'
                    // onActionPress={() => { }}
                />
            </View>

            <Card style={styles.card}>
                <View>
                    <Subtitle
                        leftText="Por Pagar"
                        leftType="secondary"
                        rightText='Pagado este mes'
                        rightType='secondary'
                        containerStyle={{ marginBottom: 10 }}
                    />
                    <View style={styles.row} >
                        <Text style={[styles.amountValue, { color: theme.colors.textPrimary }]}>
                            {pendingAmount}
                        </Text>
                        <Text style={[styles.amountValue, { color: theme.colors.success }]}>
                            {paidAmount}
                        </Text>
                    </View>
                </View>

                <Divider
                    marginVertical={10}
                />

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
    card: {
        marginTop: 0,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: '600',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
