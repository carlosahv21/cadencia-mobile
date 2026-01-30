import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { List } from '@ant-design/react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export const ConfigList: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const IconWrapper = ({ name, color, bgColor }: { name: string; color: string; bgColor: string }) => (
        <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
            <FontAwesome name={name as any} size={18} color={color} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Account & Security */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    {t('profile.sections.account')}
                </Text>
                <List
                    style={[styles.list, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    styles={{ Body: { borderTopWidth: 0, borderBottomWidth: 0 } }}
                >
                    <List.Item
                        extra={
                            <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                        }
                        thumb={
                            <IconWrapper name="user" color="#0A84FF" bgColor="rgba(59, 130, 246, 0.1)" />
                        }
                        style={[styles.listItem, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t('profile.options.edit_profile')}</Text>
                    </List.Item>
                    <List.Item
                        extra={
                            <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                        }
                        thumb={
                            <IconWrapper name="lock" color="#a855f7" bgColor="rgba(168, 85, 247, 0.1)" />
                        }
                        style={[styles.listItem, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t('profile.options.change_password')}</Text>
                    </List.Item>
                    <List.Item
                        extra={
                            <Switch value={true} trackColor={{ false: theme.colors.border, true: '#0A84FF' }} />
                        }
                        thumb={
                            <IconWrapper name="bell" color="#f59e0b" bgColor="rgba(245, 158, 11, 0.1)" />
                        }
                        style={styles.listItem}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t('profile.options.notifications')}</Text>
                    </List.Item>
                </List>
            </View>

            {/* Appearance */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    {t('profile.sections.appearance')}
                </Text>
                <List
                    style={[styles.list, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    styles={{ Body: { borderTopWidth: 0, borderBottomWidth: 0 } }}
                >
                    <List.Item
                        extra={
                            <Switch
                                value={themeMode === 'dark'}
                                onValueChange={toggleTheme}
                                trackColor={{ false: theme.colors.border, true: '#0A84FF' }}
                            />
                        }
                        thumb={
                            <IconWrapper name={themeMode === 'dark' ? 'moon-o' : 'sun-o'} color={themeMode === 'dark' ? '#fff' : '#000'} bgColor={themeMode === 'dark' ? '#000' : '#fff'} />
                        }
                        style={styles.listItem}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t(themeMode === 'dark' ? 'profile.options.theme_mode_dark' : 'profile.options.theme_mode_light')}</Text>
                    </List.Item>
                </List>
            </View>

            {/* Support & Legal */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    {t('profile.sections.support')}
                </Text>
                <List
                    style={[styles.list, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    styles={{ Body: { borderTopWidth: 0, borderBottomWidth: 0 } }}
                >
                    <List.Item
                        extra={
                            <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                        }
                        thumb={
                            <IconWrapper name="question-circle" color="#22C55E" bgColor="rgba(16, 185, 129, 0.1)" />
                        }
                        style={[styles.listItem, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t('profile.options.help_center')}</Text>
                    </List.Item>
                    <List.Item
                        extra={
                            <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                        }
                        thumb={
                            <IconWrapper name="file-text" color="#b9104e" bgColor="rgba(185, 16, 78, 0.1)" />
                        }
                        style={styles.listItem}
                        styles={{ Line: { borderBottomWidth: 0 } }}
                    >
                        <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>{t('profile.options.terms')}</Text>
                    </List.Item>
                </List>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
        paddingHorizontal: 32,
        letterSpacing: 0.5,
    },
    list: {
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 0,
    },
    listItem: {
        paddingVertical: 10,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
