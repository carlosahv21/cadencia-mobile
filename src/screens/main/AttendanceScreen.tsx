import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Toast } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { classService } from '../../services/clases.service';
import { DanceClass } from '../../types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface AttendanceScreenProps {
    classData: DanceClass;
    onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ classData, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<Record<number, string>>({});
    const [searchText, setSearchText] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loadData = async () => {
        try {
            if (isInitialLoad) setLoading(true);

            const today = new Date().toISOString().split('T')[0];

            const students = await classService.getEnrolledStudents(classData.id);
            setEnrolledStudents(students.data || []);

            const existingAttendance = await classService.getAttendance(classData.id, today);

            const newAttendanceData: Record<number, string> = {};

            (students.data || []).forEach((s: any) => {
                newAttendanceData[s.user_id] = 'absent';
            });

            (existingAttendance.data || []).forEach((record: any) => {
                const statusMap: Record<string, string> = {
                    'present': 'present',
                    'absent': 'absent'
                };
                newAttendanceData[record.student_id] = statusMap[record.status] || 'absent';
            });

            setAttendanceData(newAttendanceData);

        } catch (error) {
            console.error('Error loading data:', error);
            Toast.fail(t('common.error_loading_students'));
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredStudents = enrolledStudents.filter(s => {
        const full = `${s.user_first_name} ${s.user_last_name}`.toLowerCase();
        return full.includes(searchText.toLowerCase());
    });

    const handleSaveAttendance = async () => {
        if (enrolledStudents.length === 0) {
            Toast.info(t('common.no_students_to_save'));
            return;
        }
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const payload = enrolledStudents.map((student) => {
                const status = attendanceData[student.user_id] || 'absent';

                return {
                    class_id: classData.id,
                    student_id: student.user_id,
                    date: today,
                    status: status // Send lowercase as expected by the API
                };
            });

            await classService.saveAttendance(payload);

            Toast.info({
                content: (
                    <View style={{ alignItems: 'center', padding: 15 }}>
                        <Ionicons name="checkmark-circle" size={50} color="#FFF" />
                        <Text style={{ color: '#FFF', marginTop: 12, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
                            {t('dashboard.attendance.success_save')}
                        </Text>
                    </View>
                ),
                duration: 1,
                onClose: onBack
            });
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            Toast.fail(error.message || t('dashboard.attendance.error_save'));
        } finally {
            setLoading(false);
        }
    };

    if (loading && enrolledStudents.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.header, { paddingTop: insets.top + 20, minHeight: insets.top + 150, maxHeight: insets.top + 150 }]}
            >
                <View style={styles.headerTop}>
                    <Button
                        onPress={onBack}
                        icon="arrow-left"
                        type='transparent'
                        size='sm'
                    />
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.classTitle}>{classData.name}</Text>
                        <Text style={styles.classSub}>{classData.level} • {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Buscador de alumnos */}
                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <FontAwesome name="search" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                        placeholder={t('common.search', { name: t('common.student') })}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </LinearGradient>

            <ScrollView style={styles.studentsList} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.listHeader}>
                    <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
                        {t('dashboard.attendance.enrolled_students')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            const newData = { ...attendanceData };
                            filteredStudents.forEach(s => newData[s.user_id] = 'present');
                            setAttendanceData(newData);
                        }}
                    >
                        <Text style={[styles.markAllText, { color: theme.colors.primary }]}>
                            {t('dashboard.attendance.mark_all')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {filteredStudents.map((student) => {
                    const status = attendanceData[student.user_id] || 'absent';
                    const fullName = `${student.user_first_name} ${student.user_last_name || ''}`.trim();
                    return (
                        <View key={student.user_id} style={styles.studentRow}>
                            <View style={styles.studentInfo}>
                                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                                    <Image
                                        source={{ uri: student?.avatar || 'https://mockmind-api.uifaces.co/content/human/222.jpg' }}
                                        style={styles.avatar}
                                    />
                                </View>
                                <Text style={[styles.studentName, { color: theme.colors.textPrimary }]}>{fullName}</Text>
                            </View>

                            <View style={styles.statusButtons}>
                                <Button
                                    type='success'
                                    size='sm'
                                    icon="check-circle"
                                    variant={status === 'present' ? 'solid' : 'outline'}
                                    onPress={() => setAttendanceData({ ...attendanceData, [student.user_id]: 'present' })}
                                />

                                <Button
                                    type='danger'
                                    size='sm'
                                    icon="close"
                                    variant={status === 'absent' ? 'solid' : 'outline'}
                                    onPress={() => setAttendanceData({ ...attendanceData, [student.user_id]: 'absent' })}
                                />
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Button
                    title={t('dashboard.attendance.save_button')}
                    type="primary"
                    style={styles.saveButton}
                    onPress={handleSaveAttendance}
                    loading={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitleContainer: {
        marginLeft: 12,
        flex: 1,
    },
    classTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '500',
    },
    classSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '400',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    cardContainer: {
        flex: 1,
    },
    statCard: {
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 25,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        marginTop: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    markAllText: {
        fontSize: 13,
        fontWeight: '600',
    },
    studentsList: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
    studentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 15
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    avatarText: { fontSize: 14, fontWeight: '700', color: '#666' },
    studentName: { fontSize: 15, fontWeight: '600' },
    statusButtons: { flexDirection: 'row', gap: 6 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'transparent' },
    saveButton: { borderRadius: 15, height: 50, fontWeight: '700', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }
});
