import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/common/Button';

import { ClassStatsRow } from '../../components/class/ClassStatsRow';
import { SessionDetailsCard } from '../../components/class/SessionDetailsCard';
import { EnrolledStudentsSection } from '../../components/class/EnrolledStudentsSection';
import { ManagementHeader } from '../../components/common/ManagementHeader';

interface ResumeClassProps {
    classData?: any;
    onBack?: () => void;
}

export const ResumeClass: React.FC<ResumeClassProps> = ({ classData: propClassData, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    const handleBack = onBack || (() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    });

    // Mock data for display
    const classData = {
        name: 'Salsa Avanzado',
        level: 'Nivel Avanzado',
        date: '30 Ene 2026',
        stats: {
            occupancy: '85%',
            enrolled: 24,
            avgAttendance: 21
        },
        session: {
            timeRange: '19:00 - 20:00',
            duration: '60 minutos',
            location: 'Salón Principal',
            floor: 'Piso 2',
            capacity: 30
        },
        students: [
            {
                id: '1',
                name: 'Colten Gusikowski',
                avatar: 'https://mockmind-api.uifaces.co/content/human/231.jpg',
                plan: 'Plan Pro',
                credits: '12 clases rest.',
                status: 'present' as const
            },
            {
                id: '2',
                name: 'Esta Wuckert',
                avatar: 'https://mockmind-api.uifaces.co/content/human/232.jpg',
                plan: 'Bono 8',
                credits: '2 clases rest.',
                status: 'pending' as const
            },
            {
                id: '3',
                name: 'Royce Considine',
                avatar: 'https://mockmind-api.uifaces.co/content/human/233.jpg',
                plan: 'Plan Básico',
                credits: '4 clases rest.',
                status: 'present' as const
            }
        ]
    };

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    const handleTakeAttendance = () => {
        // navigation.navigate('Attendance', { classId: classData.id });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <ManagementHeader
                    title={classData?.name || 'Clase'}
                    subtitle={`${classData?.level || ''} • ${classData?.date || ''}`}
                    onBack={handleBack}
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
                    <ClassStatsRow
                        occupancy={classData?.stats?.occupancy || '0%'}
                        enrolled={classData?.stats?.enrolled || 0}
                        avgAttendance={classData?.stats?.avgAttendance || 0}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(450)}>
                    <SessionDetailsCard
                        timeRange={classData?.session?.timeRange || ''}
                        duration={classData?.session?.duration || ''}
                        location={classData?.session?.location || ''}
                        floor={classData?.session?.floor || ''}
                        capacity={classData?.session?.capacity || 0}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                    <EnrolledStudentsSection
                        students={classData?.students || []}
                        onViewAll={() => { }}
                    />
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Tomar Asistencia"
                    onPress={handleTakeAttendance}
                    icon="check-square-o"
                    size="lg"
                    fullWidth
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for floating footer
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
    },
});
