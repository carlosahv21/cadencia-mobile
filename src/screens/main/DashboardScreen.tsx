import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { NextClassBanner } from '../../components/dashboard/NextClassBanner';
import { AttentionSection } from '../../components/dashboard/AttentionSection';
import { StatsSection } from '../../components/dashboard/StatsSection';
import { ClassesSection } from '../../components/dashboard/ClassesSection';

import { classService } from '../../services/clases.service';
import { DanceClass, DashboardStat } from '../../types';
import { kpiService } from '../../services/kpi.service';

export const DashboardScreen = () => {
    const { theme } = useTheme();
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [kpis, setKpis] = useState<DashboardStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getEnglishDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        return days[today.getDay()];
    };
    const loadDashboardData = async () => {
        try {
            const day = getEnglishDayName();

            const [classesRes, kpiRes] = await Promise.all([
                classService.getTodayClasses(day),
                kpiService.getKpis()
            ]);

            setClasses(classesRes.data || []);

            const formattedStats = [
                {
                    id: 1,
                    label: 'Estudiantes',
                    value: kpiRes.data.activeStudents,
                    icon: 'users',
                    color: '#0A84FF',
                    trend: "+12%",
                    isPositive: true
                },
                {
                    id: 2,
                    label: 'Ingresos',
                    value: `$${kpiRes.data.monthlyRevenue}`,
                    icon: 'money',
                    color: '#22C55E',
                    trend: "+12%",
                    isPositive: true
                },
                {
                    id: 3,
                    label: 'Clases de hoy',
                    value: `${kpiRes.data.todayClasses}`,
                    icon: 'calendar',
                    color: '#FBBF24',
                    trend: "+12%",
                    isPositive: true
                },
            ];
            setKpis(formattedStats);

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

                <StatsSection stats={kpis} />

                {/* Sección de Clases */}
                <View style={styles.sectionContainer}>
                    {loading ? (
                        <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                        <ClassesSection classes={classes} loading={loading} />
                    )}
                </View>
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
});