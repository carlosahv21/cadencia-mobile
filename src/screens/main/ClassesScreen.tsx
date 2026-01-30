import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Card as AntCard } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { classService } from '../../services/clases.service';
import { DanceClass } from '../../types';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Importación de tus nuevos componentes reutilizables
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { LoadingState } from '../../components/common/LoadingState';

import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { showErrorToast } from '../../utils/feedback';

interface ClassesScreenProps {
    onSelectClass: (clase: DanceClass) => void;
}

export const ClassesScreen: React.FC<ClassesScreenProps> = ({ onSelectClass }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadClasses = async () => {
        try {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[new Date().getDay()];
            const response = await classService.getTodayClasses(dayName);
            setClasses(response.data || []);
        } catch (error) {
            showErrorToast(t('common.error_loading'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadClasses();
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Estado de carga inicial centralizado
    if (loading && !refreshing) {
        return <LoadingState message={t('classes.loading')} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* 1. Header Reutilizable */}
            <ManagementHeader
                title={t('dashboard.attendance.title')}
                subtitle={t('dashboard.classes.today_classes')}
                showSearch
                searchText={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder={t('common.search', { name: t('common.class') })}
            />

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* 2. Sección de Título Reutilizable */}
                <SectionHeader
                    title={t('dashboard.classes.title')}
                    actionText={t('dashboard.classes.view_all')}
                    onActionPress={() => { }} // Aquí iría la navegación a todas las clases
                    containerStyle={styles.sectionMargin}
                />

                {/* Lista de Clases con Timeline */}
                {filteredClasses.map((clase, index) => (
                    <Animated.View
                        key={clase.id}
                        entering={FadeInDown.duration(500).delay(index * 100)}
                        style={styles.timelineRow}
                    >
                        {/* Columna de Tiempo */}
                        <View style={styles.hourCol}>
                            <View style={[styles.lineBase, { backgroundColor: theme.colors.border, height: '25%', top: 0 }]} />
                            <View style={styles.centerContent}>
                                <Text style={[styles.hourLabel, { color: theme.colors.textSecondary }]}>{clase.hour}</Text>
                                <View style={[styles.timelineDot, { backgroundColor: index === 0 ? theme.colors.primary : theme.colors.border }]} />
                            </View>
                            <View style={[styles.lineBase, { backgroundColor: theme.colors.border, height: '55%', bottom: -15 }]} />
                        </View>

                        {/* Card de Clase */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onSelectClass(clase)}
                            style={styles.cardWrapper}
                        >
                            <AntCard style={[styles.classCard, { backgroundColor: theme.colors.surface }]}>
                                <View style={styles.cardInternal}>
                                    <Text style={[styles.genreText, { color: theme.colors.primary }]}>
                                        {clase.genre.toUpperCase()} • {clase.level}
                                    </Text>
                                    <Text style={[styles.classNameText, { color: theme.colors.textPrimary }]}>{clase.name}</Text>

                                    <View style={styles.footerRow}>
                                        <View style={styles.metaContainer}>
                                            <View style={styles.metaItem}>
                                                <FontAwesome name="clock-o" size={13} color={theme.colors.textSecondary} />
                                                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>{clase.duration} min</Text>
                                            </View>
                                        </View>
                                        <Button
                                            title={t('dashboard.attendance.mark_attendance')}
                                            type="primary"
                                            size="sm"
                                            style={styles.actionButton}
                                            onPress={() => onSelectClass(clase)}
                                        />
                                    </View>
                                </View>
                            </AntCard>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                {/* Empty State */}
                {filteredClasses.length === 0 && (
                    <EmptyState
                        icon="calendar-o"
                        title={t('classes.no_classes')}
                        description={t('common.try_again')}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { marginTop: 20, paddingHorizontal: 20 },
    sectionMargin: { marginBottom: 20 },
    timelineRow: { flexDirection: 'row', alignItems: 'center', minHeight: 110 },
    hourCol: { width: 60, alignItems: 'center', alignSelf: 'stretch', position: 'relative' },
    centerContent: { alignItems: 'center', justifyContent: 'center', zIndex: 2, marginTop: 40 },
    hourLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    timelineDot: { width: 10, height: 10, borderRadius: 5 },
    lineBase: { position: 'absolute', width: 2, left: '50%', marginLeft: -1 },
    cardWrapper: { flex: 1, marginLeft: 10 },
    classCard: { marginBottom: 15, borderRadius: 16, borderWidth: 0, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardInternal: { padding: 14 },
    genreText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
    classNameText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 10 },
    metaContainer: { flexDirection: 'row', gap: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, fontWeight: '500' },
    actionButton: { borderRadius: 8, height: 32, paddingHorizontal: 12 },
    emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
});