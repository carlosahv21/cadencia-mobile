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

    // In a real scenario, these could come from navigation params or an API call
    const studentData = student || (route.params as any)?.student || user;

    // Fallback for navigation if available
    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View
                entering={FadeIn.duration(600).delay(200)}>
                <ProfileResumeHeader
                    name={studentData?.name || 'Adolfo Stanton'}
                    role={studentData?.role || 'Estudiante'}
                    avatar={studentData?.avatar || 'https://mockmind-api.uifaces.co/content/human/222.jpg'}
                    email={studentData?.email || 'zora18@hotmail.com'}
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
                    <PlanInfoCard
                        planName="Paquete de 8 Clases"
                        description="Bono de 8 clases ideal para estudiantes frecuentes que buscan mejorar su técnica."
                        price="$20.00"
                        status="ACTIVE"
                        usedClasses={2}
                        totalClasses={8}
                        startDate="11 Ene 2026"
                        endDate="10 Feb 2026"
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(600).delay(600)}>
                    <ActivityLogCard
                        emailVerified={false}
                        lastLogin="Nunca"
                        createdAt="11 Dic 2025 • 09:14 AM"
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
