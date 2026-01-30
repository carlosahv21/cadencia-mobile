import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Componentes del Dashboard
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { NextClassBanner } from '../../components/dashboard/NextClassBanner';
import { AttentionSection } from '../../components/dashboard/AttentionSection';
import { StatsSection } from '../../components/dashboard/StatsSection';

// Pantalla de Búsqueda
import { GlobalSearchScreen } from '../../screens/search/GlobalSearchScreen';

// Services & Contexts
import { classService } from '../../services/clases.service';
import { kpiService } from '../../services/kpi.service';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { DanceClass, DashboardStat, UserPlan } from '../../types';

// UI de Ant Design
import { Card, Tag, Progress, WhiteSpace } from '@ant-design/react-native';

export const DashboardScreen = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    
    // Estados de Datos
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [kpis, setKpis] = useState<DashboardStat[]>([]);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Estado de la Capa de Búsqueda
    const [isSearching, setIsSearching] = useState(false);

    const isStudent = user?.role_id === 3;

    const getEnglishDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    const loadDashboardData = async () => {
        try {
            const day = getEnglishDayName();

            if (isStudent) {
                const [classesRes, planRes] = await Promise.all([
                    classService.getTodayClasses(day),
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
                    },
                    {
                        id: 2,
                        label: t('dashboard.stats.revenue'),
                        value: `$${kpiRes.data.monthlyRevenue}`,
                        icon: 'money',
                        color: theme.colors.success,
                    },
                    {
                        id: 3,
                        label: t('dashboard.stats.today_classes'),
                        value: `${kpiRes.data.todayClasses}`,
                        icon: 'calendar',
                        color: theme.colors.warning,
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            
            {/* CAPA DE BÚSQUEDA GLOBAL */}
            {isSearching && (
                <Animated.View 
                    entering={FadeIn.duration(250)} 
                    exiting={FadeOut.duration(200)}
                    style={[StyleSheet.absoluteFill, { zIndex: 99, backgroundColor: theme.colors.background }]}
                >
                    <GlobalSearchScreen onBack={() => setIsSearching(false)} />
                </Animated.View>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                scrollEnabled={!isSearching}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {/* Header estático del Dashboard */}
                <DashboardHeader />

                {/* Disparador de Búsqueda */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => setIsSearching(true)}
                    style={styles.searchTrigger}
                >
                    <View pointerEvents="none">
                        <SearchInput />
                    </View>
                </TouchableOpacity>

                {/* Contenido Principal */}
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
                                extra={<Tag selected>{userPlan.status.toUpperCase()}</Tag>}
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
    scrollContent: { paddingBottom: 30 },
    searchTrigger: {
        marginTop: -10, // Ajuste para que se solape ligeramente si es necesario
        marginBottom: 10,
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