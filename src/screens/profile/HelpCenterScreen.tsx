import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';

const SUPPORT_EMAIL = 'soporte@danceflow.com';
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

export const HelpCenterScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackHeader title={t('profile.options.help_center')} />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                    {t('help.faq_title')}
                </Text>

                {FAQ_KEYS.map((key) => {
                    const open = expanded === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            activeOpacity={0.8}
                            onPress={() => setExpanded(open ? null : key)}
                            style={[styles.faqCard, { backgroundColor: theme.colors.surface }]}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={[styles.question, { color: theme.colors.textPrimary }]}>
                                    {t(`help.faq.${key}.q`)}
                                </Text>
                                <FontAwesome
                                    name={open ? 'chevron-up' : 'chevron-down'}
                                    size={13}
                                    color={theme.colors.primary}
                                />
                            </View>
                            {open && (
                                <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>
                                    {t(`help.faq.${key}.a`)}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Contacto */}
                <View style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.contactIcon, { backgroundColor: theme.colors.primarySoft }]}>
                        <FontAwesome name="envelope-o" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>
                        {t('help.contact_title')}
                    </Text>
                    <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                        {t('help.contact_text')}
                    </Text>
                    <Button
                        title={t('help.contact_button')}
                        onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
                        type="primary"
                        size="md"
                        icon="envelope-o"
                    />
                </View>
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
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginLeft: 4,
    },
    faqCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    question: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    answer: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 10,
    },
    contactCard: {
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactText: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
    },
});
