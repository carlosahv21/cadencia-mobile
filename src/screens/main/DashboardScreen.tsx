import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { NextClassBanner } from '../../components/dashboard/NextClassBanner';
import { AttentionSection } from '../../components/dashboard/AttentionSection';
import { StatsSection } from '../../components/dashboard/StatsSection';
import { ClassesSection } from '../../components/dashboard/ClassesSection';

import { classService } from '../../services/clases.service';
import { DanceClass, DashboardStat, UserPlan } from '../../types';
import { kpiService } from '../../services/kpi.service';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Tag, Progress, WhiteSpace } from '@ant-design/react-native';

export const DashboardScreen = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [kpis, setKpis] = useState<DashboardStat[]>([]);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isStudent = user?.role_id === 3;

    const getEnglishDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        return days[today.getDay()];
    };
    const loadDashboardData = async () => {
        try {
            const day = getEnglishDayName();

            if (isStudent) {
                const [classesRes, planRes] = await Promise.all([
                    classService.getTodayClasses(day), // Assuming this is general for now, or use a student agenda endpoint
                    userService.getUserPlan()
                ]);
                setClasses(classesRes.data || []);
                setUserPlan(planRes.data);
            } else {
                const [classesRes, kpiRes] = await Promise.all([
                    classService.getTodayClasses(day),
                    kpiService.getKpis()
                ]);

                setClasses(classesRes.data || []);

                const formattedStats = [
                    {
                        id: 1,
                        label: t('dashboard.stats.students'),
                        value: kpiRes.data.activeStudents,
                        icon: 'users',
                        color: theme.colors.primary,
                        trend: "+12%",
                        isPositive: true
                    },
                    {
                        id: 2,
                        label: t('dashboard.stats.revenue'),
                        value: `$${kpiRes.data.monthlyRevenue}`,
                        icon: 'money',
                        color: theme.colors.success,
                        trend: "+12%",
                        isPositive: true
                    },
                    {
                        id: 3,
                        label: t('dashboard.stats.today_classes'),
                        value: `${kpiRes.data.todayClasses}`,
                        icon: 'calendar',
                        color: theme.colors.warning,
                        trend: "+12%",
                        isPositive: true
                    },
                ];
                setKpis(formattedStats);
            }

        } catch (error) {
            console.error("Error en Dashboard:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]} // Android
                        tintColor={theme.colors.primary} // iOS
                    />
                }
            >
                <DashboardHeader />
                <SearchInput />
                <NextClassBanner
                    className={"Advanced Contemporary"}
                    instructorName={"Judy Doe"}
                    time={"15 mins"}
                    location={"Studio A"}
                    instructorImage={"https://mockmind-api.uifaces.co/content/human/221.jpg"}
                />

                <AttentionSection users={[]} />

                {isStudent && userPlan ? (
                    <View style={styles.planSection}>
                        <Card full>
                            <Card.Header
                                title={t('dashboard.student_plan.title')}
                                extra={<Tag selected={userPlan.status === 'active'}>{userPlan.status.toUpperCase()}</Tag>}
                            />
                            <Card.Body>
                                <View style={styles.planBody}>
                                    <Text style={[styles.planLabel, { color: theme.colors.textSecondary }]}>
                                        {t('dashboard.student_plan.credits_remaining')}
                                    </Text>
                                    <Text style={[styles.planValue, { color: theme.colors.primary }]}>
                                        {userPlan.remaining_credits} / {userPlan.total_credits}
                                    </Text>
                                    <WhiteSpace size="lg" />
                                    <Progress percent={(userPlan.remaining_credits / userPlan.total_credits) * 100} />
                                    <WhiteSpace size="lg" />
                                    <View style={styles.planFooter}>
                                        <Text style={[styles.planLabel, { color: theme.colors.textSecondary }]}>
                                            {t('dashboard.student_plan.expiration')}
                                        </Text>
                                        <Text style={[styles.planDate, { color: theme.colors.textPrimary }]}>
                                            {userPlan.expiration_date}
                                        </Text>
                                    </View>
                                </View>
                            </Card.Body>
                        </Card>
                    </View>
                ) : (
                    <StatsSection stats={kpis} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 0 },
    sectionContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    viewMore: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos del Scroll Horizontal
    horizontalScroll: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    statCard: {
        width: 100,
        marginRight: 12,
        height: 105,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statContent: {
        alignItems: 'center',
        padding: 10,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    // Estilos de Clases
    classRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hourBadge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: 65,
        alignItems: 'center',
    },
    hourText: {
        fontWeight: '700',
        fontSize: 14,
    },
    classInfo: {
        flex: 1,
        marginLeft: 15,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
    },
    classSub: {
        fontSize: 13,
        marginTop: 2,
    },
    planSection: {
        paddingHorizontal: 20,
        marginTop: 15,
    },
    planBody: {
        padding: 15,
    },
    planLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    planValue: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 5,
    },
    planFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planDate: {
        fontSize: 14,
        fontWeight: '700',
    }
});