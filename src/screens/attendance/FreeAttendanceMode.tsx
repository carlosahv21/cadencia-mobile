import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { DanceClass } from '../../types';
import { classService } from '../../services/clases.service';
import { searchService } from '../../services/search.service';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { showErrorToast, showSuccessToast } from '../../utils/feedback';
import { buildAttendancePayload } from './buildAttendancePayload';

interface FreeAttendanceModeProps {
    classData: DanceClass;
    onBack: () => void;
}

interface SelectedStudent {
    id: string;
    name: string;
}

// Modo sin inscripciones: buscar alumnos y armar la lista de asistencia manualmente.
// ponytail: clase fija (viene seleccionada al entrar); si se quisiera cambiar de
// clase aquí, agregar un selector arriba usando classService.getTodayClasses.
export const FreeAttendanceMode: React.FC<FreeAttendanceModeProps> = ({ classData, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState<Record<string, SelectedStudent>>({});
    const [saving, setSaving] = useState(false);

    // Búsqueda de alumnos con debounce (mismo patrón que GlobalSearch)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length <= 2) {
                setResults([]);
                return;
            }
            setSearching(true);
            try {
                const response = await searchService.global(query);
                if (response.success) setResults(response.data?.estudiantes?.data || []);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    // Agregar un alumno = marcarlo presente (asistencia libre)
    const addStudent = (student: any) => {
        const id = String(student.id);
        if (selected[id]) return; // no duplicar
        const name = `${student.first_name} ${student.last_name || ''}`.trim();
        setSelected((prev) => ({ ...prev, [id]: { id, name } }));
        setQuery('');
        setResults([]);
    };

    const removeStudent = (id: string) => {
        setSelected((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const selectedList = Object.values(selected);

    const handleSave = async () => {
        if (selectedList.length === 0) return;
        setSaving(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            // Asistencia libre: todos los seleccionados están presentes
            const records = buildAttendancePayload(
                classData.id,
                today,
                selectedList.map((s) => ({ id: s.id, status: 'present' as const }))
            );
            await classService.saveAttendance(records);
            showSuccessToast(t('dashboard.attendance.success_save'), onBack);
        } catch (error: any) {
            showErrorToast(error?.message || t('dashboard.attendance.error_save'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder={t('dashboard.attendance.search_students_placeholder')}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Resultados de búsqueda: tocar para agregar */}
                {query.length > 2 && results.length > 0 && (
                    <View style={styles.resultsBlock}>
                        {results.map((student) => {
                            const id = String(student.id);
                            const added = !!selected[id];
                            return (
                                <TouchableOpacity
                                    key={id}
                                    activeOpacity={0.7}
                                    disabled={added}
                                    onPress={() => addStudent(student)}
                                    style={[styles.resultRow, { backgroundColor: theme.colors.surface, opacity: added ? 0.5 : 1 }]}
                                >
                                    <View style={[styles.avatar, { backgroundColor: theme.colors.primarySoft }]}>
                                        <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                                            {`${student.first_name?.[0] ?? ''}${student.last_name?.[0] ?? ''}`.toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.resultInfo}>
                                        <Text style={[styles.resultName, { color: theme.colors.textPrimary }]}>
                                            {student.first_name} {student.last_name}
                                        </Text>
                                        <Text style={[styles.resultSub, { color: theme.colors.textSecondary }]}>
                                            {student.email}
                                        </Text>
                                    </View>
                                    <FontAwesome
                                        name={added ? 'check' : 'plus-circle'}
                                        size={18}
                                        color={added ? theme.colors.success : theme.colors.primary}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Lista acumulada: cada alumno cuenta como presente. Desliza para quitar. */}
                {selectedList.length > 0 ? (
                    <>
                        <SectionHeader
                            title={t('dashboard.attendance.selected_count', { count: selectedList.length })}
                        />
                        <Text style={[styles.swipeHint, { color: theme.colors.textSecondary }]}>
                            {t('dashboard.attendance.swipe_hint')}
                        </Text>
                        {selectedList.map((s, index) => (
                            <Animated.View key={s.id} entering={FadeInDown.duration(400).delay(index * 60)}>
                                <Swipeable
                                    renderRightActions={(_, dragX) => {
                                        const scale = dragX.interpolate({
                                            inputRange: [-60, -20, 0],
                                            outputRange: [1, 0.6, 0.4],
                                            extrapolate: 'clamp',
                                        });
                                        return (
                                            <View style={styles.deleteAction}>
                                                <RNAnimated.View style={{ transform: [{ scale }] }}>
                                                    <Ionicons name="trash-outline" size={22} color="#fff" />
                                                </RNAnimated.View>
                                            </View>
                                        );
                                    }}
                                    onSwipeableOpen={() => removeStudent(s.id)}
                                    overshootRight={false}
                                    friction={2}
                                    rightThreshold={40}
                                >
                                    <View style={[styles.studentCard, { backgroundColor: theme.colors.surface }]}>
                                        <View style={[styles.avatar, { backgroundColor: theme.colors.primarySoft }]}>
                                            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                                                {s.name.split(' ').slice(0, 2).map((p) => p[0] ?? '').join('').toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text style={[styles.studentName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                                            {s.name}
                                        </Text>
                                        <View style={[styles.presentBadge, { backgroundColor: theme.colors.success + '20' }]}>
                                            <FontAwesome name="check" size={11} color={theme.colors.success} />
                                            <Text style={[styles.presentText, { color: theme.colors.success }]}>
                                                {t('dashboard.attendance.present')}
                                            </Text>
                                        </View>
                                    </View>
                                </Swipeable>
                            </Animated.View>
                        ))}
                    </>
                ) : (
                    query.length <= 2 && (
                        <EmptyState
                            icon="search"
                            title={t('dashboard.attendance.add_students_title')}
                            description={t('dashboard.attendance.add_students_hint')}
                        />
                    )
                )}

                {query.length > 2 && !searching && results.length === 0 && (
                    <EmptyState
                        icon="search"
                        title={t('common.no_results')}
                        description={t('common.try_again')}
                    />
                )}
            </ScrollView>

            {selectedList.length > 0 && (
                <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                    <Button
                        title={t('dashboard.attendance.save_count', { count: selectedList.length })}
                        type="primary"
                        onPress={handleSave}
                        loading={saving}
                        style={styles.saveButton}
                    />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: { flex: 1, marginTop: 14 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    resultsBlock: { marginBottom: 16 },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 14,
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { fontSize: 14, fontWeight: '700' },
    resultInfo: { flex: 1 },
    resultName: { fontSize: 15, fontWeight: '600' },
    resultSub: { fontSize: 12, marginTop: 1 },
    swipeHint: { fontSize: 12, marginBottom: 10, marginTop: -4 },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    studentName: { flex: 1, fontSize: 15, fontWeight: '600' },
    presentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    presentText: { fontSize: 12, fontWeight: '700' },
    deleteAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginBottom: 10,
        marginLeft: -20, // se mete bajo la card para que no quede como botón separado
        paddingLeft: 20,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
    saveButton: {
        borderRadius: 15,
        height: 54,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
});
