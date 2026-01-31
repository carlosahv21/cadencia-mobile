import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

// UI Kit propio
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useSearchHistory } from '../../hooks/useSearchHistory';

import { searchService } from '../../services/search.service';

interface GlobalSearchProps {
    onBack: () => void;
    onSelectItem?: (item: any, type: 'student' | 'teacher' | 'class') => void;
}

export const GlobalSearchScreen: React.FC<GlobalSearchProps> = ({ onBack, onSelectItem }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { history, clearHistory, addToHistory } = useSearchHistory();
    const [query, setQuery] = useState('');

    const [results, setResults] = useState<{
        estudiantes: { data: any[], total: number },
        profesores: { data: any[], total: number },
        clases: { data: any[], total: number }
    }>({
        estudiantes: { data: [], total: 0 },
        profesores: { data: [], total: 0 },
        clases: { data: [], total: 0 },
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const fetchResults = async () => {
                if (query.trim() === '') {
                    setResults({
                        estudiantes: { data: [], total: 0 },
                        profesores: { data: [], total: 0 },
                        clases: { data: [], total: 0 }
                    });
                    return;
                }

                if (query.length > 2) {
                    try {
                        const response = await searchService.global(query);
                        if (response.success) setResults(response.data);
                    } catch (error) {
                        console.error("Error al buscar global:", error);
                    }
                }
            };

            fetchResults();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ManagementHeader
                title={t('common.seeker')}
                onBack={onBack}
                showSearch
                searchText={query}
                onSearchChange={setQuery}
                placeholder={t('common.search_placeholder')}
                autoFocus={true}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {!query && history.length > 0 && (
                    <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
                        <SectionHeader
                            title={t('search.recent')}
                            actionText={t('common.clear')}
                            onActionPress={clearHistory}
                        />
                        <FlatList
                            horizontal
                            data={history}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <Animated.View entering={FadeInRight.delay(index * 100)}>
                                    <TouchableOpacity
                                        style={styles.historyItem}
                                        onPress={() => setQuery(item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.name)}
                                    >
                                        <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
                                            {(!item.first_name && item.name) ? (
                                                <View style={[styles.historyAvatar, styles.letterAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
                                                    <Text style={[styles.letterAvatarText, { color: theme.colors.primary, fontSize: 18 }]}>
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Image
                                                    source={{ uri: item.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg' }}
                                                    style={styles.historyAvatar}
                                                />
                                            )}
                                        </View>
                                        <Text numberOfLines={1} style={[styles.historyName, { color: theme.colors.textPrimary }]}>
                                            {item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.name}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                        />
                    </Animated.View>
                )}

                {/* 2. SECCIÓN: RESULTADOS / SUGERENCIAS */}
                <View style={styles.section}>
                    <SectionHeader title={query ? t('search.results') : ""} />

                    {query && (results.estudiantes.data.length > 0 || results.profesores.data.length > 0 || results.clases.data.length > 0) ? (
                        <>
                            {/* Estudiantes */}
                            {renderSearchCategory(
                                t('common.students'),
                                results.estudiantes.data,
                                results.estudiantes.total,
                                'student'
                            )}

                            {/* Profesores */}
                            {renderSearchCategory(
                                t('common.teachers'),
                                results.profesores.data,
                                results.profesores.total,
                                'teacher'
                            )}

                            {/* Clases */}
                            {renderSearchCategory(
                                t('common.classes'),
                                results.clases.data,
                                results.clases.total,
                                'class'
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon="search"
                            title={query ? t('common.no_results') : t('search.start_typing')}
                            description={query ? t('common.try_again') : t('search.find_hint')}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );

    function renderSearchCategory(title: string, items: any[], total: number, type: string) {
        if (items.length === 0) return null;

        return (
            <View style={{ marginBottom: 20 }}>
                <Text style={[styles.categoryTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
                {items.slice(0, 3).map((item, index) => (
                    <Animated.View
                        key={`${type}-${item.id}`}
                        entering={FadeInUp.delay(index * 50)}
                    >
                        <TouchableOpacity
                            style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}
                            onPress={() => {
                                addToHistory({
                                    ...item,
                                    name: item.name || `${item.first_name} ${item.last_name || ''}`,
                                    type: title
                                });
                                onSelectItem?.(item, type as any);
                            }}
                        >
                            {type === 'student' || type === 'teacher' ? (
                                <Image
                                    source={{ uri: item.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg' }}
                                    style={styles.resultAvatar}
                                />
                            ) : (
                                <View style={[styles.resultAvatar, styles.letterAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
                                    <Text style={[styles.letterAvatarText, { color: theme.colors.primary }]}>
                                        {(item.name || title).charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.resultInfo}>
                                <Text style={[styles.resultName, { color: theme.colors.textPrimary }]}>
                                    {item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.name}
                                </Text>
                                <Text style={[styles.resultSub, { color: theme.colors.textSecondary }]}>
                                    {item.email || item.description || item.genre || title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                {total > 3 && (
                    <Button
                        title={t('search.view_all_results', { total })}
                        onPress={() => console.log('View more', type)}
                        type="primary"
                        size="sm"
                        variant="outline"
                    />
                )}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingVertical: 10 },
    section: { marginBottom: 25, paddingHorizontal: 20 },
    historyItem: { alignItems: 'center', marginRight: 16, width: 70 },
    avatarRing: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        padding: 2,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    historyAvatar: { width: '100%', height: '100%', borderRadius: 30 },
    historyName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    resultAvatar: { width: 50, height: 50, borderRadius: 25 },
    resultInfo: { marginLeft: 12, flex: 1 },
    resultName: { fontSize: 15, fontWeight: '700' },
    resultSub: { fontSize: 12, marginTop: 2 },
    categoryTitle: {
        fontSize: 13,
        marginBottom: 10,
        marginTop: 5,
        letterSpacing: 1
    },
    viewMoreButton: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 5
    },
    viewMoreText: {
        fontSize: 13,
        fontWeight: '600'
    },
    letterAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    letterAvatarText: {
        fontWeight: 'bold',
        fontSize: 16
    }
});