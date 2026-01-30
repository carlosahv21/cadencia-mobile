import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

// UI Kit propio
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useSearchHistory } from '../../hooks/useSearchHistory';

interface GlobalSearchProps {
    onBack: () => void;
}

export const GlobalSearchScreen: React.FC<GlobalSearchProps> = ({ onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { history, clearHistory, addToHistory } = useSearchHistory();
    const [query, setQuery] = useState('');

    // Simulación de resultados (Aquí conectarías con tu API)
    const [results, setResults] = useState<any[]>([]);

    // Efecto para limpiar resultados si se borra el texto
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
        } else {
            // Aquí llamarías a un servicio de búsqueda real
            // setResults(await searchService.global(query));
        }
    }, [query]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header con búsqueda activa */}
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
                {/* 1. SECCIÓN: HISTORIAL RECIENTE */}
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
                                            <Image source={{ uri: item.avatar }} style={styles.historyAvatar} />
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

                {/* 2. SECCIÓN: RESULTADOS / SUGERENCIAS */}
                <View style={styles.section}>
                    <SectionHeader title={query ? t('search.results') : t('search.suggested')} />

                    {results.length > 0 ? (
                        results.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInUp.delay(index * 50)}
                            >
                                <TouchableOpacity
                                    style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}
                                    onPress={() => addToHistory(item)}
                                >
                                    <Image source={{ uri: item.avatar }} style={styles.resultAvatar} />
                                    <View style={styles.resultInfo}>
                                        <Text style={[styles.resultName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                                        <Text style={[styles.resultSub, { color: theme.colors.textSecondary }]}>{item.type}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
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
    resultSub: { fontSize: 12, marginTop: 2 }
});