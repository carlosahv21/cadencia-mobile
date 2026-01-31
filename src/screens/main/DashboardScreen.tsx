import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

// Componentes del Dashboard
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { NextClassBanner } from '../../components/dashboard/NextClassBanner';
import { AttentionSection } from '../../components/dashboard/AttentionSection';
import { StatsSection } from '../../components/dashboard/StatsSection';

// UI de Ant Design
import { Card, Tag, Progress, WhiteSpace } from '@ant-design/react-native';

// Hooks
import { useDashboardData } from '../../hooks/useDashboardData';

export const DashboardScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const {
        classes,
        kpis,
        userPlan,
        loading,
        refreshing,
        onRefresh,
        isStudent
    } = useDashboardData();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
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
                {/* Header estático del Dashboard */}
                <DashboardHeader onSearchPress={() => navigation.navigate('GlobalSearch')} />

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