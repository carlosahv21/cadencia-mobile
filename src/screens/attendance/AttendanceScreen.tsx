import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { classService } from '../../services/clases.service';
import { DanceClass } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';


// Componentes Reutilizables
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { StudentRow } from '../../components/attendance/StudentRow';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Button } from '../../components/common/Button';
import { showErrorToast, showSuccessToast } from '../../utils/feedback';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';

interface AttendanceScreenProps {
    classData: DanceClass;
    onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ classData, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // Estados
    const [loading, setLoading] = useState(true);
    const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<number, 'present' | 'absent'>>({});
    const [searchText, setSearchText] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loadData = async () => {
        try {
            if (isInitialLoad) setLoading(true);
            const today = new Date().toISOString().split('T')[0];

            // 1. Cargar estudiantes inscritos
            const students = await classService.getEnrolledStudents(classData.id);
            const studentsList = students.data || [];
            setEnrolledStudents(studentsList);

            // 2. Cargar asistencia existente si la hay
            const existingAttendance = await classService.getAttendance(classData.id, today);

            // Inicializar objeto de asistencia
            const newAttendanceData: Record<number, 'present' | 'absent'> = {};

            // Valor por defecto: todos ausentes
            studentsList.forEach((s: any) => {
                newAttendanceData[s.user_id] = 'absent';
            });

            // Sobreescribir con datos reales del backend
            (existingAttendance.data || []).forEach((record: any) => {
                newAttendanceData[record.student_id] = record.status === 'present' ? 'present' : 'absent';
            });

            setAttendanceData(newAttendanceData);

        } catch (error) {
            console.error('Error loading data:', error);
            showErrorToast(t('common.error_loading_students'));
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtro de búsqueda
    const filteredStudents = enrolledStudents.filter(s => {
        const full = `${s.user_first_name} ${s.user_last_name}`.toLowerCase();
        return full.includes(searchText.toLowerCase());
    });

    // Acción para marcar a todos como presentes
    const handleMarkAllPresent = () => {
        const newData = { ...attendanceData };
        filteredStudents.forEach(s => {
            newData[s.user_id] = 'present';
        });
        setAttendanceData(newData);
    };

    const handleSaveAttendance = async () => {
        if (enrolledStudents.length === 0) {
            showErrorToast(t('common.no_students_to_save'));
            return;
        }

        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const payload = enrolledStudents.map((student) => ({
                class_id: classData.id,
                student_id: student.user_id,
                date: today,
                status: attendanceData[student.user_id] || 'absent'
            }));

            await classService.saveAttendance(payload);

            showSuccessToast(t('dashboard.attendance.success_save'), onBack);
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            showErrorToast(error.message || t('dashboard.attendance.error_save'));
        } finally {
            setLoading(false);
        }
    };

    if (loading && enrolledStudents.length === 0) {
        return <LoadingState message={t('students.loading')} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Cabecera reutilizable con buscador */}
            <ManagementHeader
                title={classData.name}
                subtitle={`${classData.level} • ${new Date().toLocaleDateString()}`}
                onBack={onBack}
                showSearch
                searchText={searchText}
                onSearchChange={setSearchText}
                placeholder={t('common.search', { name: t('common.student') })}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            >
                <SectionHeader
                    title={t('dashboard.attendance.enrolled_students')}
                    actionText={t('dashboard.attendance.mark_all')}
                    onActionPress={handleMarkAllPresent}
                />

                {filteredStudents.map((student, index) => (
                    <Animated.View
                        key={student.user_id}
                        entering={FadeInDown.duration(500).delay(index * 100)}
                    >
                        <StudentRow
                            name={`${student.user_first_name} ${student.user_last_name || ''}`.trim()}
                            avatar={"https://mockmind-api.uifaces.co/content/human/221.jpg"}
                            status={attendanceData[student.user_id] || 'absent'}
                            onStatusChange={(newStatus) =>
                                setAttendanceData({ ...attendanceData, [student.user_id]: newStatus })
                            }
                        />
                    </Animated.View>
                ))}

                {filteredStudents.length === 0 && (
                    <EmptyState 
                        icon="calendar-o" 
                        title={t('students.no_students')} 
                        description={t('common.try_again')} 
                    />
                )}
            </ScrollView>

            {/* Footer fijo con botón de acción */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Button
                    title={t('dashboard.attendance.save_button')}
                    type="primary"
                    onPress={handleSaveAttendance}
                    loading={loading}
                    style={styles.saveButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1, marginTop: 10 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    markAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent'
    },
    saveButton: {
        borderRadius: 15,
        height: 54,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
    },
    toastContainer: {
        alignItems: 'center',
        padding: 15
    },
    toastText: {
        color: '#FFF',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center'
    }
});