import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { classService } from '../../services/clases.service';
import { DanceClass } from '../../types';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';

interface AgendaScreenProps {
    onSelectClass: (clase: DanceClass) => void;
}

interface ClassEnrollment {
    initials: string[]; // hasta 4 alumnos
    total: number;
}

const API_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_AVATARS = 4;

// Semana actual empezando en lunes
const getWeekDays = (): Date[] => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
};

const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

export const AgendaScreen: React.FC<AgendaScreenProps> = ({ onSelectClass }) => {
    const { theme } = useTheme();
    const { hasModule } = useAuth();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    // Con el módulo de inscripciones inactivo no existen "inscritos":
    // mostramos los asistentes de la última sesión de cada clase.
    const registrationsEnabled = hasModule('registrations');

    const weekDays = getWeekDays();
    const today = new Date();

    const [selectedDay, setSelectedDay] = useState<Date>(today);
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [enrollments, setEnrollments] = useState<Record<number, ClassEnrollment>>({});
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ponytail: una llamada por clase (≤10/día); si crece, endpoint agregado en backend
    const loadEnrollments = useCallback(async (list: DanceClass[]) => {
        const entries = await Promise.all(list.map(async (clase) => {
            try {
                if (registrationsEnabled) {
                    const res = await classService.getEnrolledStudents(clase.id, MAX_AVATARS);
                    const initials = (res.data || []).map((r: any) =>
                        `${r.user_first_name?.[0] ?? ''}${r.user_last_name?.[0] ?? ''}`.toUpperCase()
                    );
                    return [clase.id, { initials, total: res.pagination?.total ?? initials.length }] as const;
                }

                // Sin inscripciones: asistentes de la última sesión registrada
                const res = await classService.getRecentAttendances(clase.id);
                const rows: any[] = res.data || [];
                const lastDate = rows[0]?.date;
                const lastSession = rows.filter((r) => r.date === lastDate);
                const initials = lastSession.slice(0, MAX_AVATARS).map((r) =>
                    `${r.student_first_name?.[0] ?? ''}${r.student_last_name?.[0] ?? ''}`.toUpperCase()
                );
                return [clase.id, { initials, total: lastSession.length }] as const;
            } catch {
                return [clase.id, { initials: [], total: 0 }] as const;
            }
        }));
        setEnrollments(Object.fromEntries(entries));
    }, [registrationsEnabled]);

    const loadClasses = useCallback(async (day: Date) => {
        setLoadingClasses(true);
        try {
            const response = await classService.getTodayClasses(API_DAY_NAMES[day.getDay()]);
            const list = response.data || [];
            setClasses(list);
            loadEnrollments(list);
        } catch {
            setClasses([]);
        } finally {
            setLoadingClasses(false);
            setRefreshing(false);
        }
    }, [loadEnrollments]);

    useEffect(() => { loadClasses(selectedDay); }, [selectedDay, loadClasses]);

    const onRefresh = () => {
        setRefreshing(true);
        loadClasses(selectedDay);
    };

    const monthLabel = selectedDay.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top + 10 }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('agenda.title')}</Text>
                <Text style={[styles.monthLabel, { color: theme.colors.textSecondary }]}>{monthLabel}</Text>
            </View>

            {/* Calendario semanal */}
            <View style={[styles.weekStrip, { backgroundColor: theme.colors.surface }]}>
                {weekDays.map((day) => {
                    const selected = isSameDay(day, selectedDay);
                    const isToday = isSameDay(day, today);
                    return (
                        <TouchableOpacity
                            key={day.toISOString()}
                            style={styles.dayColumn}
                            onPress={() => setSelectedDay(day)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.dayLabel,
                                { color: isToday ? theme.colors.textPrimary : theme.colors.textSecondary },
                                isToday && styles.dayLabelToday,
                            ]}>
                                {day.toLocaleDateString(i18n.language, { weekday: 'short' }).replace('.', '')}
                            </Text>
                            <View style={[
                                styles.dayCircle,
                                { backgroundColor: selected ? theme.colors.primary : theme.colors.background },
                            ]}>
                                <Text style={[
                                    styles.dayNumber,
                                    { color: selected ? '#fff' : theme.colors.textPrimary },
                                ]}>
                                    {day.getDate()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
            >
                {/* Clases del día */}
                <SectionHeader
                    title={t('agenda.classes')}
                    containerStyle={styles.sectionMargin}
                />

                {!loadingClasses && classes.length === 0 && (
                    <EmptyState
                        icon="calendar-o"
                        title={t('classes.no_classes')}
                        description={t('agenda.pick_another_day')}
                    />
                )}

                {classes.map((clase, index) => {
                    const enrollment = enrollments[clase.id];
                    const extra = enrollment ? enrollment.total - enrollment.initials.length : 0;
                    return (
                        <Animated.View key={clase.id} entering={FadeInDown.duration(400).delay(index * 80)}>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => onSelectClass(clase)}
                                style={[styles.classCard, { backgroundColor: theme.colors.surface }]}
                            >
                                <View style={styles.cardTop}>
                                    <View style={styles.classInfo}>
                                        <Text style={[styles.classNameText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                                            {clase.name}
                                        </Text>
                                        <Text style={[styles.genreText, { color: theme.colors.textSecondary }]}>
                                            {clase.genre} • {clase.level}
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                                </View>

                                <View style={styles.bottomRow}>
                                    <View style={styles.metaRow}>
                                        <View style={[styles.hourBadge, { backgroundColor: theme.colors.primarySoft }]}>
                                            <FontAwesome name="clock-o" size={12} color={theme.colors.primary} />
                                            <Text style={[styles.hourText, { color: theme.colors.primary }]}>{clase.hour}</Text>
                                        </View>
                                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                                            {clase.duration} min
                                        </Text>
                                    </View>

                                    {/* Alumnos: avatares con iniciales + restante, a la derecha */}
                                    {enrollment && enrollment.initials.length > 0 && (
                                        <View style={styles.avatarsRow}>
                                            {enrollment.initials.map((ini, i) => (
                                                <View
                                                    key={i}
                                                    style={[
                                                        styles.avatar,
                                                        {
                                                            backgroundColor: theme.colors.primarySoft,
                                                            borderColor: theme.colors.surface,
                                                            marginLeft: i === 0 ? 0 : -10,
                                                        },
                                                    ]}
                                                >
                                                    <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{ini}</Text>
                                                </View>
                                            ))}
                                            {extra > 0 && (
                                                <View style={[styles.avatar, styles.extraChip, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
                                                    <Text style={styles.extraText}>+{extra}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
    },
    monthLabel: {
        fontSize: 14,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    weekStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    dayColumn: {
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    dayLabel: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    dayLabelToday: {
        fontWeight: '700',
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionMargin: { marginBottom: 12 },
    classCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    classInfo: { flex: 1 },
    classNameText: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    genreText: {
        fontSize: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    hourBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    hourText: {
        fontSize: 12,
        fontWeight: '700',
    },
    metaText: {
        fontSize: 12,
    },
    avatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 11,
        fontWeight: '700',
    },
    extraChip: {
        marginLeft: -10,
    },
    extraText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
});
