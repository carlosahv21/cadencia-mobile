import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { DFCard } from '../common/DFCard';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SectionHeader } from './SectionHeader';
import { DashboardStat } from '../../types';

export const StatsSection = ({ stats }: { stats: DashboardStat[] }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <SectionHeader
                title={t('dashboard.summary')}
            />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
            >
                {stats.map((stat, index) => (
                    <Animated.View
                        key={stat.id}
                        entering={FadeInRight.duration(500).delay(800 + index * 100)}
                        style={styles.cardContainer}
                    >
                        <DFCard style={styles.statCard} noPadding>
                            <View style={styles.content}>
                                <View style={styles.headerRow}>
                                    {stat.icon && (
                                        <View style={[styles.iconCircle, { backgroundColor: (stat.color || theme.colors.primary) + '20' }]}>
                                            <FontAwesome name={stat.icon as any} size={14} color={stat.color || theme.colors.primary} />
                                        </View>
                                    )}
                                    <Text style={[styles.label, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                                        {stat.label}
                                    </Text>
                                </View>

                                <Text style={[styles.value, { color: stat.color || theme.colors.textPrimary }]}>
                                    {stat.value}
                                </Text>

                                {stat.sub && (
                                    <Text style={[styles.subText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                                        {stat.sub}
                                    </Text>
                                )}

                                {stat.trend && (
                                    <View style={styles.trendRow}>
                                        <FontAwesome
                                            name={stat.isPositive ? 'arrow-up' : 'arrow-down'}
                                            size={10}
                                            color={stat.isPositive ? theme.colors.success : theme.colors.error}
                                        />
                                        <Text style={[
                                            styles.trendText,
                                            { color: stat.isPositive ? theme.colors.success : theme.colors.error }
                                        ]}>
                                            {stat.trend}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </DFCard>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        paddingBottom: 10
    },
    cardContainer: {
        width: 160,
    },
    statCard: {
        flex: 1, // Llena el alto de la fila: todas las cards iguales
        borderRadius: 18,
        padding: 16,
        minHeight: 118,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        flexShrink: 1,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subText: {
        fontSize: 11,
        marginBottom: 6,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600'
    },
});
