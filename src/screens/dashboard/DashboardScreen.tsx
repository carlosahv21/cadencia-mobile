import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Componentes UI & Layout
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { NextClassBanner } from '../../components/dashboard/NextClassBanner';
import { AttentionSection } from '../../components/dashboard/AttentionSection';
import { StatsSection } from '../../components/common/StatsSection';
import { PlanInfoCard } from '../../components/student/PlanInfoCard';

// Hooks
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation<any>();

    const {
        kpis,
        usersAtRisk,
        nextClass,
        refreshing,
        onRefresh,
        isStudent
    } = useDashboardData();

    const [attentionSectionY, setAttentionSectionY] = useState(0);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount?: string | number) => {
        if (amount === undefined) return '$0.00';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `$${num.toFixed(2)}`;
    };

    return (
        <ScreenContainer
            refreshing={refreshing}
            onRefresh={onRefresh}
        >
            <DashboardHeader onSearchPress={() => navigation.navigate('GlobalSearch')} />

            <NextClassBanner nextClass={nextClass} />

            {isStudent ? (
                user?.plan && (
                    <View style={{ paddingHorizontal: 16 }}>
                        <PlanInfoCard
                            planName={user.plan.name}
                            description={user.plan.description}
                            price={formatCurrency(user.plan.price)}
                            status={user.plan.status.toUpperCase() as any}
                            usedClasses={user.plan.classes_used}
                            totalClasses={user.plan.max_classes}
                            startDate={formatDate(user.plan.start_date)}
                            endDate={formatDate(user.plan.end_date)}
                        />
                    </View>
                )
            ) : (
                <>
                    <StatsSection stats={kpis} />
                    <View onLayout={(event) => setAttentionSectionY(event.nativeEvent.layout.y)}>
                        <AttentionSection
                            users={usersAtRisk}
                        />
                    </View>
                </>
            )}
        </ScreenContainer>
    );
};