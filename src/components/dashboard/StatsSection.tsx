import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeInRight } from 'react-native-reanimated';

export const StatsSection = ({ stats }: any) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {stats.map((stat: any, index: number) => (
                    <Animated.View
                        key={stat.id}
                        entering={FadeInRight.duration(500).delay(800 + index * 100)}
                    >
                        <Card style={styles.statCard} noPadding>
                            <View style={styles.content}>
                                {/* Icono en círculo perfecto */}
                                <View style={[styles.iconCircle, { backgroundColor: stat.color + '25' }]}>
                                    <FontAwesome name={stat.icon} size={18} color={stat.color} />
                                </View>

                                {/* Valor Principal */}
                                <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
                                    {stat.value}
                                </Text>

                                {/* Etiqueta en Mayúsculas */}
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
                        </Card>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    scroll: { paddingLeft: 20, paddingRight: 8, paddingVertical: 10 },
    statCard: {
        width: 110, // Ajustado para centrar mejor el contenido
        height: 155,
        marginRight: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
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