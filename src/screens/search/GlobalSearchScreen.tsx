import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

// Layout & UI Kit
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';

// Business Logic
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { searchService } from '../../services/search.service';

interface GlobalSearchProps {
    onBack?: () => void;
    onSelectItem?: (item: any, type: 'student' | 'teacher' | 'class') => void;
}

export const GlobalSearchScreen: React.FC<GlobalSearchProps> = ({ onBack, onSelectItem }) => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { history, clearHistory, addToHistory } = useSearchHistory();
    const [query, setQuery] = useState('');

    const [results, setResults] = useState<{
        estudiantes: { data: any[]; total: number };
        profesores: { data: any[]; total: number };
        clases: { data: any[]; total: number };
    }>({
        estudiantes: { data: [], total: 0 },
        profesores: { data: [], total: 0 },
        clases: { data: [], total: 0 },
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const fetchResults = async () => {
                if (query.trim().length <= 2) {
                    setResults({
                        estudiantes: { data: [], total: 0 },
                        profesores: { data: [], total: 0 },
                        clases: { data: [], total: 0 }
                    });
                    return;
                }

                try {
                    const response = await searchService.global(query);
                    if (response.success) setResults(response.data);
                } catch (error) {
                    console.error("Error al buscar global:", error);
                }
            };

            fetchResults();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // --- Render Helpers ---

    const renderSearchCategory = (title: string, items: any[], total: number, type: string) => {
        if (items.length === 0) return null;

        return (
            <View style={styles.categoryContainer}>
                <Text style={[styles.categoryTitle, { color: theme.colors.textSecondary }]}>
                    {title.toUpperCase()}
                </Text>
                {items.slice(0, 3).map((item, index) => (
                    <Animated.View
                        key={`${type}-${item.id}`}
                        entering={FadeInUp.delay(index * 50)}
                    >
                        <TouchableOpacity
                            style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}
                            onPress={() => handleNavigation(item, type, title)}
                        >
                            {renderAvatar(item, type, title)}
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
    };

    const renderAvatar = (item: any, type: string, title: string) => {
        const isPerson = type === 'student' || type === 'teacher';
        if (isPerson && item.avatar) {
            return <Image source={{ uri: item.avatar }} style={styles.resultAvatar} />;
        }
        return (
            <View style={[styles.resultAvatar, styles.letterAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.letterAvatarText, { color: theme.colors.primary }]}>
                    {(item.name || title).charAt(0).toUpperCase()}
                </Text>
            </View>
        );
    };

    const handleNavigation = (item: any, type: string, title: string) => {
        addToHistory({
            ...item,
            name: item.name || `${item.first_name} ${item.last_name || ''}`,
            type: type // Guardamos el tipo crudo para lógica interna
        });

        onSelectItem?.(item, type as any);

        const screenMap: Record<string, string> = {
            student: 'ResumeStudent',
            teacher: 'ResumenTeacher',
            class: 'ResumeClass'
        };

        navigation.navigate(screenMap[type], {
            [type === 'class' ? 'classData' : type]: item
        });
    };

    return (
        <ScreenContainer
            withScroll={false}
            edges={[]} // Dejamos que el header maneje el SafeArea con su gradiente
        >
            <ManagementHeader
                title={t('common.seeker')}
                onBack={onBack || (() => navigation.goBack())}
                showSearch
                searchText={query}
                onSearchChange={setQuery}
                placeholder={t('common.search_placeholder')}
                autoFocus={true}
            />

            <FlatList
                data={[]} // Usamos FlatList para manejar el teclado y scroll eficientemente
                renderItem={null}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View style={styles.scrollContent}>
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
                                                onPress={() => setQuery(item.name)}
                                            >
                                                <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
                                                    {renderAvatar(item, item.type, item.type)}
                                                </View>
                                                <Text numberOfLines={1} style={[styles.historyName, { color: theme.colors.textPrimary }]}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    )}
                                />
                            </Animated.View>
                        )}

                        <View style={styles.section}>
                            {query ? (
                                results.estudiantes.data.length > 0 || results.profesores.data.length > 0 || results.clases.data.length > 0 ? (
                                    <>
                                        <SectionHeader title={t('search.results')} />
                                        {renderSearchCategory(t('common.students'), results.estudiantes.data, results.estudiantes.total, 'student')}
                                        {renderSearchCategory(t('common.teachers'), results.profesores.data, results.profesores.total, 'teacher')}
                                        {renderSearchCategory(t('common.classes'), results.clases.data, results.clases.total, 'class')}
                                    </>
                                ) : (
                                    <EmptyState
                                        icon="search"
                                        title={t('common.no_results')}
                                        description={t('common.try_again')}
                                    />
                                )
                            ) : (
                                <EmptyState
                                    icon="search"
                                    title={t('search.start_typing')}
                                    description={t('search.find_hint')}
                                />
                            )}
                        </View>
                    </View>
                }
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 25 },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 15 },
    categoryContainer: { marginBottom: 20 },
    historyItem: { alignItems: 'center', marginRight: 16, width: 70 },
    avatarRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        padding: 2,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    historyName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        // Sombras suaves Electric Blue
        shadowColor: '#0ea5e9',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3
    },
    resultAvatar: { width: 48, height: 48, borderRadius: 24 },
    resultInfo: { marginLeft: 12, flex: 1 },
    resultName: { fontSize: 15, fontWeight: '700' },
    resultSub: { fontSize: 12, marginTop: 2 },
    categoryTitle: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 12,
        letterSpacing: 1.2
    },
    letterAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterAvatarText: {
        fontWeight: 'bold',
        fontSize: 16
    }
});