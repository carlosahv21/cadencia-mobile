import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card } from '../common/Card';
import { Tag } from '../common/Tag';
import { useTheme } from '../../contexts/ThemeContext';

import { DanceClass } from '../../types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface ClassesSectionProps {
    classes: DanceClass[];
    loading: boolean;
    onViewAll?: () => void;
    onClassPress?: (clase: DanceClass) => void;
}

export const ClassesSection = ({ classes, loading, onViewAll, onClassPress }: ClassesSectionProps) => {
    const { theme } = useTheme();

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Clases de hoy
                </Text>
                <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={[styles.viewAllText, { color: theme.colors.textSecondary }]}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
                classes.map((clase, index) => (
                    <Animated.View
                        key={clase.id}
                        entering={FadeInDown.duration(500).delay(1000 + index * 100)}
                        style={styles.timelineRow}
                    >
                        <View style={styles.hourCol}>
                            <View style={[styles.lineBase, { backgroundColor: theme.colors.border, top: 0, height: '40%' }]} />

                            <View style={styles.centerContent}>
                                <Text style={[styles.hourLabel, { color: theme.colors.textSecondary }]}>
                                    {clase.hour}
                                </Text>
                                <View style={[
                                    styles.timelineDot,
                                    { backgroundColor: index === 0 ? theme.colors.primary : theme.colors.border }
                                ]} />
                            </View>

                            <View style={[styles.lineBase, { backgroundColor: theme.colors.border, bottom: -15, top: '60%' }]} />
                        </View>

                        <Card
                            style={styles.classCard}
                            onPress={() => onClassPress?.(clase)}
                            noPadding
                        >
                            <View style={styles.cardInternal}>
                                <View style={styles.infoWrapper}>
                                    <View style={styles.topRow}>
                                        <Text style={[styles.genreText, { color: theme.colors.primary }]}>
                                            {clase.genre.toUpperCase()} • {clase.level}
                                        </Text>
                                        <Tag
                                            label="Baja ocupación"
                                            type="danger"
                                            variant="filled"
                                            size='sm'
                                        />
                                    </View>

                                    <Text style={[styles.className, { color: theme.colors.textPrimary }]}>
                                        {clase.name}
                                    </Text>

                                    <View style={styles.footerRow}>
                                        <View style={styles.metaContainer}>
                                            <View style={styles.metaItem}>
                                                <Ionicons name="person-outline" size={13} color={theme.colors.textSecondary} />
                                                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                                                    Prof. {clase.teacher_id}
                                                </Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Ionicons name="time-outline" size={13} color={theme.colors.textSecondary} />
                                                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                                                    {clase.duration} min
                                                </Text>
                                            </View>
                                        </View>

                                        <FontAwesome name="angle-right" size={16} color={theme.colors.border} />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </Animated.View>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginBottom: 20 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    sectionTitle: { fontSize: 18, fontWeight: '500' },
    viewAllText: { fontSize: 12, fontWeight: '400' },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 110
    },
    hourCol: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        position: 'relative'
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    hourLabel: {
        fontSize: 11, // Ajustado a escala de 12px base
        fontWeight: '500',
        marginBottom: 3
    },
    timelineDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    lineBase: {
        position: 'absolute',
        width: 1.5,
        left: '50%',
        marginLeft: -0.75,
        backgroundColor: '#E0E0E0',
    },
    classCard: {
        flex: 1,
        marginLeft: 12,
        marginBottom: 15,
        borderRadius: 16, // theme.borderRadius.xl
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
    },
    cardInternal: { padding: 14 },
    infoWrapper: { flex: 1 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    genreText: { fontSize: 10, fontWeight: '500', letterSpacing: 0.4 },
    badgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '400',
        color: "#EF4444"
    },
    className: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 8,
        marginTop: 4
    },
    metaContainer: { flexDirection: 'row', gap: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    metaText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#6C757D'
    },
});