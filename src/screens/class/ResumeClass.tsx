import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/common/Button';

import { SessionDetailsCard } from '../../components/class/SessionDetailsCard';
import { EnrolledStudentsSection } from '../../components/class/EnrolledStudentsSection';
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { StatsSection } from '../../components/common/StatsSection';
import { classService } from '../../services/clases.service';

interface ResumeClassProps {
    classData?: any;
    onBack?: () => void;
}

const kpis = [
    {
        id: 1,
        label: 'Ocupación',
        value: '85%',
    },
    {
        id: 2,
        label: 'Inscritos',
        value: '24',
    },
    {
        id: 3,
        label: 'Asis. Promedio',
        value: '21'
    }
];

export const ResumeClass: React.FC<ResumeClassProps> = ({ classData: propClassData, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Initial data source
    const initialClassData = propClassData || (route.params as any)?.classData;

    // State
    const [classDetails, setClassDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
    }, [fetchClassDetails]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchClassDetails();
    }, [fetchClassDetails]);

    // Derived Data
    const header = classDetails?.header;
    const stats = classDetails?.stats || [];
    const session = classDetails?.session_details;
    const students = classDetails?.students || [];

    const kpis = stats.map((stat: any, index: number) => ({
        id: index,
        label: stat.label,
        value: stat.value
    }));

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

        students: students.map((s: any) => ({
            id: s.id.toString(),
            name: s.full_name,
            avatar: s.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg',
            plan: s.plan_info?.split('•')[0]?.trim() || 'Estudiante',
            credits: s.last_attendance_date
                ? `${s.plan_info?.split('•')[1]?.trim() || ''}\nÚltima asistencia: ${new Date(s.last_attendance_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`
                : s.plan_info?.split('•')[1]?.trim() || '',
            status: s.has_attended ? 'present' : 'absent'
        }))
    };



    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <ManagementHeader
                    title={displayClassData.name}
                    subtitle={displayClassData.subtitle}
                    onBack={handleBack}
                />
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});
