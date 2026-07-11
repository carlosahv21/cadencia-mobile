import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { showSuccessToast } from '../../utils/feedback';

const LANGUAGES = ['es', 'en'] as const;

interface RowProps {
    icon: string;
    iconColor: string;
    label: string;
    isLast?: boolean;
    onPress?: () => void;
    right?: React.ReactNode;
}

const SettingsRow: React.FC<RowProps> = ({ icon, iconColor, label, isLast, onPress, right }) => {
    const { theme } = useTheme();
    const content = (
        <View style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: iconColor + '20' }]}>
                <FontAwesome name={icon as any} size={16} color={iconColor} />
            </View>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
            {right ?? <FontAwesome name="chevron-right" size={13} color={theme.colors.border} />}
        </View>
    );
    return onPress
        ? <TouchableOpacity activeOpacity={0.7} onPress={onPress}>{content}</TouchableOpacity>
        : content;
};

const SettingsGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.group}>
            <Text style={[styles.groupTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
            <View style={[styles.groupCard, { backgroundColor: theme.colors.surface }]}>
                {children}
            </View>
        </View>
    );
};

export const ConfigList = () => {
    const { theme, themeMode, toggleTheme } = useTheme();
    const { subscription } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const comingSoon = () => showSuccessToast(t('common.coming_soon'));

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        storage.saveLanguage(lang);
    };

    const trialEnds = subscription?.trial_ends_at
        ? new Date(subscription.trial_ends_at).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })
        : null;

    return (
        <View>
            {/* Cuenta y Seguridad */}
            <SettingsGroup title={t('profile.sections.account')}>
                <SettingsRow
                    icon="user"
                    iconColor={theme.colors.primary}
                    label={t('profile.options.edit_profile')}
                    onPress={comingSoon}
                />
                <SettingsRow
                    icon="lock"
                    iconColor={theme.colors.warning}
                    label={t('profile.options.change_password')}
                    onPress={comingSoon}
                />
                <SettingsRow
                    icon="bell"
                    iconColor={theme.colors.error}
                    label={t('profile.options.notifications')}
                    onPress={() => navigation.navigate('Notifications')}
                    isLast
                />
            </SettingsGroup>

            {/* Apariencia */}
            <SettingsGroup title={t('profile.sections.appearance')}>
                <SettingsRow
                    icon={themeMode === 'dark' ? 'moon-o' : 'sun-o'}
                    iconColor={theme.colors.primaryLight}
                    label={themeMode === 'dark' ? t('profile.options.theme_mode_dark') : t('profile.options.theme_mode_light')}
                    right={
                        <Switch
                            value={themeMode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    }
                />
                <SettingsRow
                    icon="globe"
                    iconColor={theme.colors.success}
                    label={t('profile.options.language')}
                    isLast
                    right={
                        <View style={styles.langRow}>
                            {LANGUAGES.map((lang) => {
                                const active = i18n.language?.startsWith(lang);
                                return (
                                    <TouchableOpacity
                                        key={lang}
                                        onPress={() => changeLanguage(lang)}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.langPill,
                                            { backgroundColor: active ? theme.colors.primary : theme.colors.primarySoft },
                                        ]}
                                    >
                                        <Text style={[styles.langText, { color: active ? '#fff' : theme.colors.primary }]}>
                                            {lang.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    }
                />
            </SettingsGroup>

            {/* Suscripción */}
            {subscription && (
                <SettingsGroup title={t('profile.sections.subscription')}>
                    <SettingsRow
                        icon="star"
                        iconColor={theme.colors.warning}
                        label={subscription.plan?.name || '-'}
                        isLast
                        right={
                            <View style={styles.subRight}>
                                {subscription.is_trial && (
                                    <View style={[styles.trialBadge, { backgroundColor: theme.colors.primarySoft }]}>
                                        <Text style={[styles.trialText, { color: theme.colors.primary }]}>Trial</Text>
                                    </View>
                                )}
                                {trialEnds && (
                                    <Text style={[styles.subDate, { color: theme.colors.textSecondary }]}>
                                        {t('profile.subscription.trial_until', { date: trialEnds })}
                                    </Text>
                                )}
                            </View>
                        }
                    />
                </SettingsGroup>
            )}

            {/* Soporte y Legal */}
            <SettingsGroup title={t('profile.sections.support')}>
                <SettingsRow
                    icon="question-circle"
                    iconColor={theme.colors.success}
                    label={t('profile.options.help_center')}
                    onPress={comingSoon}
                />
                <SettingsRow
                    icon="file-text"
                    iconColor={theme.colors.textSecondary}
                    label={t('profile.options.terms')}
                    onPress={comingSoon}
                    isLast
                />
            </SettingsGroup>
        </View>
    );
};

const styles = StyleSheet.create({
    group: {
        marginTop: 22,
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    groupCard: {
        borderRadius: 16,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    langRow: {
        flexDirection: 'row',
        gap: 6,
    },
    langPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    langText: {
        fontSize: 12,
        fontWeight: '700',
    },
    subRight: {
        alignItems: 'flex-end',
        gap: 3,
    },
    trialBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
    },
    trialText: {
        fontSize: 11,
        fontWeight: '700',
    },
    subDate: {
        fontSize: 11,
    },
});
