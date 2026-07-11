import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BackHeader } from '../../components/common/BackHeader';

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

export const TermsScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackHeader title={t('profile.options.terms')} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.updated, { color: theme.colors.textSecondary }]}>
                    {t('terms.last_updated')}
                </Text>

                {SECTION_KEYS.map((key) => (
                    <View key={key} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                            {t(`terms.sections.${key}.title`)}
                        </Text>
                        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
                            {t(`terms.sections.${key}.body`)}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    updated: {
        fontSize: 12,
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
    body: {
        fontSize: 13,
        lineHeight: 21,
    },
});
