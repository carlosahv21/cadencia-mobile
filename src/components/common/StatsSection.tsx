import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { DFCard } from '../common/DFCard';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SectionHeader } from './SectionHeader';

export const StatsSection = ({ stats }: any) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <SectionHeader
                title="Estadísticas"
            />
            <View style={styles.row}>
                {stats.map((stat: any, index: number) => (
                    <Animated.View
                        key={stat.id}
                        entering={FadeInRight.duration(500).delay(800 + index * 100)}
                        style={styles.cardContainer}
                    >
                        <DFCard style={styles.statCard} noPadding>
                            <View style={styles.content}>
                                {
                                    stat.icon && (
                                        <View style={[styles.iconCircle, { backgroundColor: stat.color + '25' }]}>
                                            <FontAwesome name={stat.icon} size={18} color={stat.color} />
                                        </View>
                                    )
                                }

                                <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
                                    {stat.value}
                                </Text>

                                <Text style={[styles.label, { color: '#94A3B8' }]}>
                                    {stat.label}
                                </Text>

                                {/* Tendencia inferior */}
                                {stat.trend && (
                                    <View style={styles.trendRow}>
                                        <Text style={[
                                            styles.trendText,
                                            { color: stat.isPositive ? '#22C55E' : '#EF4444' }
                                        ]}>
                                            {stat.trend}
                                        </Text>
                                        <FontAwesome
                                            name={stat.isPositive ? "arrow-up" : "arrow-down"}
                                            size={10}
                                            color={stat.isPositive ? "#22C55E" : "#EF4444"}
                                        />
                                    </View>
                                )}
                            </View>
                        </DFCard>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 10
    },
    cardContainer: {
        flex: 1,
    },
    statCard: {
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    value: {
        fontSize: 22,
        fontWeight: '500',
        marginBottom: 2
    },
    label: {
        fontSize: 10,
        fontWeight: '400',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    trendText: {
        fontSize: 12,
        fontWeight: '500'
    },
});