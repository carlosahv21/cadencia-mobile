import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/dashboard.service';
import { userService } from '../services/user.service';
import { classService, NextClassData } from '../services/clases.service';
import { DashboardStat, UserPlan } from '../types';

export const useDashboardData = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();

    const [rawKpis, setRawKpis] = useState<any>(null);
    const [usersRisk, setUsersRisk] = useState<any>(null);
    const [nextClass, setNextClass] = useState<NextClassData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isStudent = user?.role === 'student';


    const loadDashboardData = useCallback(async () => {
        try {
            if (isStudent) {
                const [nextClassRes] = await Promise.all([
                    classService.getNextClass()
                ]);
                setNextClass(nextClassRes.data);
            } else {
                const [kpiRes, usersRiskRes, nextClassRes] = await Promise.all([
                    dashboardService.getKpis(),
                    dashboardService.getUsersRisk(),
                    classService.getNextClass()
                ]);

                setRawKpis(kpiRes.data);
                setUsersRisk(usersRiskRes.data);
                setNextClass(nextClassRes.data);
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

    const usersAtRisk = useMemo(() => {
        if (!usersRisk) return [];
        return usersRisk;
    }, [usersRisk]);

    return {
        kpis,
        usersAtRisk,
        nextClass,
        loading,
        refreshing,
        onRefresh,
        isStudent
    };
};
