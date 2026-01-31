import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { classService } from '../services/clases.service';
import { kpiService } from '../services/kpi.service';
import { userService } from '../services/user.service';
import { DanceClass, DashboardStat, UserPlan } from '../types';

export const useDashboardData = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();

    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [rawKpis, setRawKpis] = useState<any>(null);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isStudent = user?.role_id === 3;

    const getEnglishDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    const loadDashboardData = useCallback(async () => {
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
                setRawKpis(kpiRes.data);
            }
        } catch (error) {
            console.error("Error en Dashboard Data Hook:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isStudent]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, [loadDashboardData]);

    const kpis = useMemo((): DashboardStat[] => {
        if (!rawKpis) return [];

        return [
            {
                id: 1,
                label: t('dashboard.stats.students'),
                value: rawKpis.activeStudents,
                icon: 'users',
                color: theme.colors.primary,
            },
            {
                id: 2,
                label: t('dashboard.stats.revenue'),
                value: `$${rawKpis.monthlyRevenue}`,
                icon: 'money',
                color: theme.colors.success,
            },
            {
                id: 3,
                label: t('dashboard.stats.today_classes'),
                value: `${rawKpis.todayClasses}`,
                icon: 'calendar',
                color: theme.colors.warning,
            },
        ];
    }, [rawKpis, t, theme.colors]);

    return {
        classes,
        kpis,
        userPlan,
        loading,
        refreshing,
        onRefresh,
        isStudent
    };
};
