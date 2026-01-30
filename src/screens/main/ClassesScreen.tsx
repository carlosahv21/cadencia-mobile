import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Button, Card as AntCard, Toast } from '@ant-design/react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { classService } from '../../services/clases.service';
import { DanceClass } from '../../types';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Tag } from '../../components/common/Tag';

interface ClassesScreenProps {
    onSelectClass: (clase: DanceClass) => void;
}

export const ClassesScreen: React.FC<ClassesScreenProps> = ({ onSelectClass }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
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
            console.error('Error loading classes:', error);
            Toast.fail(t('common.error_loading'));
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

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header con gradiente (Identidad de la App) */}
            <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.topHeader, { paddingTop: insets.top + 10, minHeight: insets.top + 150, maxHeight: insets.top + 150 }]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>{t('dashboard.attendance.title')}</Text>
                            <Text style={styles.headerSubtitle}>{t('dashboard.classes.today_classes')}</Text>
                        </View>
                    </View>
                </View>
                {/* Buscador */}
                <View style={styles.searchSection}>
                    <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <FontAwesome name="search" size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                            placeholder={t('common.search', { name: t('common.class') })}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Lista de Clases */}
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <View style={styles.listHeaderLeft}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                                {t('dashboard.classes.title')}
                            </Text>
                            <Tag
                                label={filteredClasses.length.toString()}
                                color={theme.colors.primary}
                                style={{ marginLeft: 10 }}
                            />
                        </View>
                        <TouchableOpacity>
                            <Text style={[styles.viewAllText, { color: theme.colors.textSecondary }]}>{t('dashboard.classes.view_all')}</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && !refreshing ? (
                        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        filteredClasses.map((clase, index) => (
                            <Animated.View
                                key={clase.id}
                                entering={FadeInDown.duration(500).delay(index * 100)}
                                style={styles.timelineRow}
                            >
                                <View style={styles.hourCol}>
                                    <View style={[styles.lineBase, { backgroundColor: theme.colors.border, top: 0, height: '40%' }]} />
                                    <View style={styles.centerContent}>
                                        <Text style={[styles.hourLabel, { color: theme.colors.textSecondary }]}>
                                            {clase.hour}
                                        </Text>
                                        <View style={[
                                            styles.timelineDot,
                                            { backgroundColor: index === 0 ? theme.colors.primary : theme.colors.border }
                                        ]} />
                                    </View>
                                    <View style={[styles.lineBase, { backgroundColor: theme.colors.border, bottom: -15, top: '60%' }]} />
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => onSelectClass(clase)}
                                    style={styles.cardWrapper}
                                >
                                    <AntCard style={styles.classCard}>
                                        <View style={styles.cardInternal}>
                                            <View style={styles.infoWrapper}>
                                                <View style={styles.topRow}>
                                                    <Text style={[styles.genreText, { color: theme.colors.primary }]}>
                                                        {clase.genre.toUpperCase()} • {clase.level}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.classNameText, { color: theme.colors.textPrimary }]}>
                                                    {clase.name}
                                                </Text>
                                                <View style={styles.footerRow}>
                                                    <View style={styles.metaContainer}>
                                                        <View style={styles.metaItem}>
                                                            <FontAwesome name="clock-o" size={13} color={theme.colors.textSecondary} />
                                                            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                                                                {t('dashboard.classes.duration', { minutes: clase.duration })}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.metaItem}>
                                                            <FontAwesome name="user" size={13} color={theme.colors.textSecondary} />
                                                            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                                                                {t('dashboard.classes.teacher', { name: clase.teacher_id })}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        style={{ borderRadius: 8, height: 30 }}
                                                        onPress={() => onSelectClass(clase)}
                                                    >
                                                        {t('dashboard.attendance.mark_attendance')}
                                                    </Button>
                                                </View>
                                            </View>
                                        </View>
                                    </AntCard>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}

                    {filteredClasses.length === 0 && !loading && (
                        <View style={styles.emptyState}>
                            <FontAwesome name="calendar-o" size={48} color={theme.colors.textSecondary} style={{ opacity: 0.3 }} />
                            <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>{t('common.no_classes')}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topHeader: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        padding: 2,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
    },
    headerTextContainer: {
        marginLeft: 12,
        marginTop: 12,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '500',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '400',
    },
    headerAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchSection: {
        marginTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
    },
    listContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    listHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    countBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countText: {
        fontSize: 12,
        fontWeight: '700',
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: '600',
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 110
    },
    hourCol: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        position: 'relative'
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    hourLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 3
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    lineBase: {
        position: 'absolute',
        width: 1.5,
        left: '50%',
        marginLeft: -0.75,
    },
    cardWrapper: {
        flex: 1,
    },
    classCard: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 15,
        borderRadius: 16,
        borderWidth: 0,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardInternal: { padding: 14 },
    infoWrapper: { flex: 1 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    genreText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    classNameText: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 8,
        marginTop: 4
    },
    metaContainer: { flexDirection: 'row', gap: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    metaText: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
});