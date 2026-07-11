import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { SessionDetailsCard } from '../../components/class/SessionDetailsCard';
import { EnrolledStudentsSection } from '../../components/class/EnrolledStudentsSection';
import { StatsSection } from '../../components/common/StatsSection';
import { classService } from '../../services/clases.service';

interface ResumeClassProps {
    classData?: any;
    onBack?: () => void;
}

// Icono/color por posición: el backend define las stats (Ocupación, Inscritos, Asis. Promedio)
const STAT_STYLES = [
    { icon: 'pie-chart', colorKey: 'primary' },
    { icon: 'users', colorKey: 'success' },
    { icon: 'check-circle', colorKey: 'warning' },
] as const;

export const ResumeClass: React.FC<ResumeClassProps> = ({ classData: propClassData, onBack }) => {
    const { theme } = useTheme();
    const { hasModule } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    // Sin módulo de inscripciones no hay "inscritos": se muestran los
    // asistentes de la última sesión en su lugar.
    const registrationsEnabled = hasModule('registrations');

    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Initial data source
    const initialClassData = propClassData || (route.params as any)?.classData;

    // State
    const [classDetails, setClassDetails] = useState<any>(null);
    const [lastAttendees, setLastAttendees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Últimos asistentes (solo cuando inscripciones está inactivo)
    const fetchLastAttendees = useCallback(async () => {
        if (registrationsEnabled || !initialClassData?.id) return;
        try {
            const res = await classService.getRecentAttendances(initialClassData.id);
            const rows: any[] = res.data || [];
            const lastDate = rows[0]?.date;
            setLastAttendees(rows.filter((r) => r.date === lastDate));
        } catch {
            setLastAttendees([]);
        }
    }, [registrationsEnabled, initialClassData?.id]);

    const fetchClassDetails = useCallback(async () => {
        if (initialClassData?.id) {
            try {
                if (!refreshing) setLoading(true);
                const response = await classService.getDetails(initialClassData.id);
                if (response.success) {
                    setClassDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching class details:', error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [initialClassData?.id]);

    React.useEffect(() => {
        fetchClassDetails();
        fetchLastAttendees();
    }, [fetchClassDetails, fetchLastAttendees]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchClassDetails();
        fetchLastAttendees();
    }, [fetchClassDetails, fetchLastAttendees]);

    // Derived Data
    const header = classDetails?.header;
    const stats = classDetails?.stats || [];
    const session = classDetails?.session_details;
    const students = classDetails?.students || [];

    const kpis = stats
        .map((stat: any, index: number) => ({
            id: index,
            label: stat.label,
            value: stat.value,
            icon: STAT_STYLES[index]?.icon,
            color: theme.colors[STAT_STYLES[index]?.colorKey ?? 'primary'],
        }))
        // "Inscritos" no aplica con el módulo de inscripciones inactivo
        .filter((stat: any) => registrationsEnabled || stat.label !== 'Inscritos');

    // Derived class data for components
    const displayClassData = {
        name: header?.title || initialClassData?.name || 'Clase',
        level: header?.genre || initialClassData?.genre || 'General', // Using genre as subtitle part 1
        date: header?.level_tag?.split('•')[1]?.trim() || initialClassData?.date || '', // Extracting day/date
        subtitle: header ? `${header.genre} • ${header.level_tag}` : (initialClassData ? `${initialClassData.genre || ''} • ${initialClassData.date || ''}` : ''),

        session: {
            timeRange: session?.time_range || initialClassData?.session?.timeRange || '',
            duration: session?.duration_label || initialClassData?.session?.duration || '',
            location: session?.location || initialClassData?.session?.location || '',
            floor: session?.location_detail?.split('•')[0]?.trim() || initialClassData?.session?.floor || '',
            capacity: parseInt(session?.location_detail?.split('Capacidad:')[1]?.trim()) || initialClassData?.session?.capacity || 0
        },

        students: registrationsEnabled
            ? students.map((s: any) => ({
                id: s.id.toString(),
                name: s.full_name,
                avatar: s.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg',
                plan: s.plan_info?.split('•')[0]?.trim() || 'Estudiante',
                credits: s.last_attendance_date
                    ? `${s.plan_info?.split('•')[1]?.trim() || ''}\nÚltima asistencia: ${new Date(s.last_attendance_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`
                    : s.plan_info?.split('•')[1]?.trim() || '',
                status: s.has_attended ? 'present' : 'absent'
            }))
            : lastAttendees.map((a: any) => ({
                id: a.id.toString(),
                name: `${a.student_first_name} ${a.student_last_name}`,
                avatar: 'https://mockmind-api.uifaces.co/content/human/221.jpg',
                plan: t('class_resume.last_session'),
                credits: new Date(a.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                status: 'present' as const
            }))
    };



    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header estilo Agenda: limpio, sobre el fondo */}
            <Animated.View
                entering={FadeIn.duration(600).delay(200)}
                style={[styles.header, { paddingTop: insets.top + 10 }]}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
                >
                    <FontAwesome name="chevron-left" size={16} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {displayClassData.name}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {displayClassData.subtitle}
                    </Text>
                </View>
            </Animated.View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                    <StatsSection stats={kpis} />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(450)}>
                    <SessionDetailsCard
                        timeRange={displayClassData.session.timeRange}
                        duration={displayClassData.session.duration}
                        location={displayClassData.session.location}
                        floor={displayClassData.session.floor}
                        capacity={displayClassData.session.capacity}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                    <EnrolledStudentsSection
                        students={displayClassData.students}
                        title={registrationsEnabled ? undefined : t('class_resume.last_attendees')}
                        onViewAll={() => { }}
                    />
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 20,
        marginBottom: 6,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
