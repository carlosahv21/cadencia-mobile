import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ProfileResumeHeader } from '../../components/common/ProfileResumeHeader';
import { PaymentSummaryCard } from '../../components/teacher/PaymentSummaryCard';
import { WeeklyClassesList } from '../../components/teacher/WeeklyClassesList';
import { TeacherContactInfoCard } from '../../components/teacher/TeacherContactInfoCard';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatsSection } from '../../components/common/StatsSection';
import { teacherService } from '../../services/teacher.service';

interface ResumenTeacherProps {
    teacher?: any;
    onBack?: () => void;
}

export const ResumenTeacher: React.FC<ResumenTeacherProps> = ({ teacher, onBack }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Initial data source
    const initialTeacherData = teacher || (route.params as any)?.teacher || (route.params as any)?.user || user;

    // State
    const [teacherDetails, setTeacherDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTeacherDetails = useCallback(async () => {
        if (initialTeacherData?.id) {
            try {
                if (!refreshing) setLoading(true);
                const response = await teacherService.getById(initialTeacherData.id);
                if (response.success) {
                    setTeacherDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching teacher details:', error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [initialTeacherData?.id]);

    React.useEffect(() => {
        fetchTeacherDetails();
    }, [fetchTeacherDetails]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTeacherDetails();
    }, [fetchTeacherDetails]);

    // Helpers
    const formatCurrency = (amount?: number) => {
        if (amount === undefined) return '$0.00';
        return `$${amount.toFixed(2)}`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long'
        });
    };

    // Derived Data
    const header = teacherDetails?.header;
    const stats = teacherDetails?.stats;
    const payment = teacherDetails?.payment_summary;
    const weeklyClasses = teacherDetails?.weekly_classes || [];

    const kpis = [
        {
            id: 1,
            label: 'Clases',
            value: stats?.classes_count?.toString() || '0',
        },
        {
            id: 2,
            label: 'Rating',
            value: stats?.rating?.toString() || '0.0',
        },
        {
            id: 3,
            label: 'Alumnos',
            value: stats?.students_count?.toString() || '0',
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <ProfileResumeHeader
                    name={header?.full_name || initialTeacherData?.name || 'Profesor'}
                    role={header?.role_label || 'Profesor'}
                    avatar={header?.avatar || initialTeacherData?.avatar || 'https://mockmind-api.uifaces.co/content/human/222.jpg'}
                    email={header?.email || initialTeacherData?.email || ''}
                    onBack={handleBack}
                    onEdit={() => { }}
                    showEditButton={false}
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
                    <StatsSection
                        stats={kpis}
                    />
                </Animated.View>

                {payment && (
                    <Animated.View entering={FadeInDown.duration(600).delay(450)}>
                        <PaymentSummaryCard
                            pendingAmount={formatCurrency(payment.pending_amount)}
                            paidAmount={formatCurrency(payment.paid_amount)}
                            nextCutDate={formatDate(payment.next_cutoff_date)}
                        />
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                    <WeeklyClassesList
                        classes={weeklyClasses.map((c: any) => ({
                            id: c.id.toString(),
                            name: c.name,
                            time: c.schedule.split('•')[1]?.trim() || '',
                            day: c.schedule.split('•')[0]?.trim() || '',
                            duration: c.duration,
                            room: c.location,
                            type: c.genre.toLowerCase(),
                        }))}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(750)}>
                    <TeacherContactInfoCard
                        email={header?.email || initialTeacherData?.email || ''}
                        phone={header?.phone || '+584120248199'}
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
