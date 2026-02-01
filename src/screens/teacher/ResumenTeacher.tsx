import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ProfileResumeHeader } from '../../components/common/ProfileResumeHeader';
import { TeacherStatsRow } from '../../components/teacher/TeacherStatsRow';
import { PaymentSummaryCard } from '../../components/teacher/PaymentSummaryCard';
import { WeeklyClassesList } from '../../components/teacher/WeeklyClassesList';
import { TeacherContactInfoCard } from '../../components/teacher/TeacherContactInfoCard';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

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

    // Mock data for display (could come from navigation params or API)
    const teacherData = teacher || (route.params as any)?.teacher || {
        name: 'Adolfo Stanton',
        role: 'Instructor Senior',
        specialty: 'Salsa & Bachata Specialist',
        avatar: 'https://mockmind-api.uifaces.co/content/human/222.jpg',
        email: 'adolfo.s@studiodance.com',
        phone: '+34 612 345 678',
        stats: {
            classesCount: 142,
            rating: 4.9,
            studentsCount: 850
        },
        payments: {
            pending: '$420.00',
            paid: '$1,250.00',
            nextCut: '30 de Octubre'
        },
        weeklyClasses: [
            {
                id: '1',
                day: 'Lanes',
                time: '18:00',
                name: 'Salsa Intermedio',
                duration: '60 min',
                room: 'Sala A',
                type: 'salsa' as const
            },
            {
                id: '2',
                day: 'Miércoles',
                time: '19:30',
                name: 'Bachata Avanzado',
                duration: '90 min',
                room: 'Sala Principal',
                type: 'bachata' as const
            }
        ]
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <ProfileResumeHeader
                    name={teacherData.name}
                    role={teacherData.role}
                    avatar={teacherData.avatar}
                    specialty={teacherData.specialty}
                    title="Perfil del Instructor"
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
                    <TeacherStatsRow
                        classesCount={teacherData.stats.classesCount}
                        rating={teacherData.stats.rating}
                        studentsCount={teacherData.stats.studentsCount}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(450)}>
                    <PaymentSummaryCard
                        pendingAmount={teacherData.payments.pending}
                        paidAmount={teacherData.payments.paid}
                        nextCutDate={teacherData.payments.nextCut}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                    <WeeklyClassesList
                        classes={teacherData.weeklyClasses}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(750)}>
                    <TeacherContactInfoCard
                        email={teacherData.email}
                        phone={teacherData.phone}
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
