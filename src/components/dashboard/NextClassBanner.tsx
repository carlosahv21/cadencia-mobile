import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface NextClassProps {
    nextClass?: {
        title: string;
        teacher: { name: string };
        location: string;
        startTime: string;
        dayName: string;
        rawHour: string;
    } | null;
}

export const NextClassBanner = ({ nextClass }: NextClassProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
            <View style={styles.labelRow}>
                <View style={[styles.iconBadge, { backgroundColor: theme.colors.primarySoft }]}>
                    <FontAwesome name="calendar" size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.labelText, { color: theme.colors.textPrimary }]}>
                    {t('dashboard.next_class.label')}
                </Text>
            </View>

            {nextClass ? (
                <>
                    <Text style={[styles.className, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                        {nextClass.title}
                    </Text>
                    <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                        {nextClass.dayName}, {nextClass.rawHour}
                    </Text>
                    <View style={styles.detailItem}>
                        <FontAwesome name="map-marker" size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                            {nextClass.location}
                        </Text>
                    </View>
                </>
            ) : (
                <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                    {t('dashboard.next_class.empty')}
                </Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    iconBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 15,
        fontWeight: '600',
    },
    className: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 6,
    },
    timeText: {
        fontSize: 15,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
