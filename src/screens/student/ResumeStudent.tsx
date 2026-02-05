import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ProfileResumeHeader } from '../../components/common/ProfileResumeHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

import { useNavigation, useRoute } from '@react-navigation/native';
import { PlanInfoCard } from '../../components/student/PlanInfoCard';
import { ActivityLogCard } from '../../components/student/ActivityLogCard';
import { studentService } from '../../services/student.service';

interface ResumeStudentProps {
    student?: any;
    onBack?: () => void;
}

export const ResumeStudent: React.FC<ResumeStudentProps> = ({ student, onBack }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    // Initial data from navigation or props
    const initialStudentData = student || (route.params as any)?.student || user;

    // State for full details
    const [studentDetails, setStudentDetails] = useState<any>(initialStudentData);
    const [loading, setLoading] = useState(false);

    // Fallback for navigation if available
    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const [refreshing, setRefreshing] = useState(false);

    const fetchStudentDetails = useCallback(async () => {
        if (initialStudentData?.id) {
            try {
                // If triggered by pull-to-refresh, don't show full loading screen
                if (!refreshing) setLoading(true);

                const response = await studentService.getById(initialStudentData.id);
                if (response.success && response.data) {
                    setStudentDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [initialStudentData?.id]);

    // Initial fetch
    React.useEffect(() => {
        fetchStudentDetails();
    }, [fetchStudentDetails]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStudentDetails();
    }, [fetchStudentDetails]);

    // Format dates and currency
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined) return '$0.00';
        return `$${amount.toFixed(2)}`;
    };

    // Derived data
    const plan = studentDetails?.plan;
    const fullName = studentDetails?.first_name
        ? `${studentDetails.first_name} ${studentDetails.last_name || ''}`
        : studentDetails?.name || 'Estudiante';

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View
                entering={FadeIn.duration(600).delay(200)}>
                <ProfileResumeHeader
                    name={fullName}
                    role={studentDetails?.role === 'student' ? 'Estudiante' : (studentDetails?.role || 'Estudiante')}
                    avatar={studentDetails?.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg'}
                    email={studentDetails?.email || ''}
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
                <Animated.View entering={FadeIn.duration(600).delay(400)}>
                    {plan ? (
                        <PlanInfoCard
                            planName={plan.name}
                            description={plan.description}
                            price={formatCurrency(plan.price)}
                            status={plan.status.toUpperCase()}
                            usedClasses={plan.classes_used}
                            totalClasses={plan.classes_total}
                            startDate={formatDate(plan.start_date)}
                            endDate={formatDate(plan.end_date)}
                        />
                    ) : (
                        // Placeholder or Empty state if no plan
                        <PlanInfoCard
                            planName={t('Sin Plan Activo')}
                            description={t('El estudiante no tiene un plan activo actualmente.')}
                            price={"-"}
                            status="INACTIVE"
                            usedClasses={0}
                            totalClasses={0}
                            startDate="-"
                            endDate="-"
                        />
                    )}
                </Animated.View>

                <Animated.View entering={FadeIn.duration(600).delay(600)}>
                    <ActivityLogCard
                        emailVerified={studentDetails?.email_verified ?? false}
                        lastLogin={studentDetails?.last_login ? formatDateTime(studentDetails.last_login) : 'Nunca'}
                        createdAt={studentDetails?.created_at ? formatDateTime(studentDetails.created_at) : 'N/A'}
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
