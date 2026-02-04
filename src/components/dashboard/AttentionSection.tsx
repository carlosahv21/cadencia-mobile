import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Tag } from '../common/Tag';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface AtRiskUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    last_attendance: string;
    days_since_attendance: number;
    phone?: string;
    avatar?: string;
}

export const AttentionSection = ({ users = [], onCollapse }: { users: AtRiskUser[], onCollapse?: () => void }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [visibleCount, setVisibleCount] = React.useState(5);

    const handleWhatsApp = (name: string, phone: string) => {
        const message = t('dashboard.attention.whatsapp_message', { name });
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`);
    };

    const displayedUsers = users.slice(0, visibleCount);
    const hasMore = visibleCount < users.length;
    const allShown = users.length > 5 && !hasMore;

    const handleLoadMore = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setVisibleCount(prev => prev + 5);
    };

    const handleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setVisibleCount(5);
        if (onCollapse) {
            setTimeout(() => {
                onCollapse();
            }, 50);
        }
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(600).delay(600)}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        {t('dashboard.attention.title')}
                    </Text>
                    {users.length > 0 && (
                        <FontAwesome name="exclamation-triangle" size={18} color={theme.colors.error} />
                    )}
                </View>
                <Tag
                    label={t('dashboard.attention.count_at_risk', { count: users.length })}
                    type="danger"
                    variant="filled"
                    size='md'
                />
            </View>

            {users.length > 0 ? (
                <>
                    {displayedUsers.map((user, index) => (
                        <Animated.View
                            key={user.id}
                            entering={FadeInRight.duration(600).delay(600 + index * 100)}
                            style={styles.container}
                        >
                            <Card style={styles.userCard}>
                                <View style={styles.cardContent}>
                                    <View style={styles.avatarContainer}>
                                        {user.avatar ? (
                                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                                        ) : (
                                            <View style={[styles.initialsCircle, { backgroundColor: '#F1F5F9' }]}>
                                                <Text style={styles.initialsText}>
                                                    {user.first_name.split(' ').map(n => n[0]).join('')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.infoContainer}>
                                        <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                                            {user.first_name + ' ' + user.last_name}
                                        </Text>
                                        <Text style={styles.statusText}>
                                            {t('dashboard.attention.inactive_days', { days: user.days_since_attendance || 0 })}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.waButton}
                                        onPress={() => handleWhatsApp(user.first_name, user.phone || '+584120248199')}
                                    >
                                        <FontAwesome name="whatsapp" size={28} color="#22C55E" />
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </Animated.View>
                    ))}

                    {hasMore && (
                        <TouchableOpacity onPress={handleLoadMore} style={styles.viewMoreButton}>
                            <Text style={[styles.viewMoreText, { color: theme.colors.primary }]}>
                                Ver más ({users.length - visibleCount})
                            </Text>
                            <FontAwesome name="chevron-down" size={12} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}

                    {allShown && (
                        <TouchableOpacity onPress={handleCollapse} style={styles.viewMoreButton}>
                            <Text style={[styles.viewMoreText, { color: theme.colors.primary }]}>
                                Ver menos
                            </Text>
                            <FontAwesome name="chevron-up" size={12} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={{ color: theme.colors.textSecondary }}>
                        {t('dashboard.attention.empty_state')}
                    </Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '500', marginRight: 10 },
    userCard: { marginBottom: 0, paddingVertical: 10 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: { marginRight: 12 },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    initialsCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
    infoContainer: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '500' },
    statusText: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
    waButton: { padding: 4 },
    emptyState: { paddingVertical: 10, alignItems: 'center' },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6
    },
    viewMoreText: {
        fontSize: 14,
        fontWeight: '500'
    }
});