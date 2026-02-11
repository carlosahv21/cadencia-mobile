import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DanceFlowNotification, NotificationCategory } from '../../types';

interface NotificationCardProps {
    notification: DanceFlowNotification;
    onPress: (notification: DanceFlowNotification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onPress,
}) => {
    const { theme } = useTheme();

    const getCategoryIcon = (category: NotificationCategory): keyof typeof Ionicons.glyphMap => {
        switch (category) {
            case 'PAYMENT': return 'cash-outline';
            case 'CLASS': return 'calendar-outline';
            case 'SYSTEM': return 'megaphone-outline';
            case 'ATTENDANCE': return 'checkmark-circle-outline';
            case 'REGISTRATION': return 'person-add-outline';
            default: return 'notifications-outline';
        }
    };

    const getCategoryColor = (category: NotificationCategory): string => {
        switch (category) {
            case 'PAYMENT': return '#10B981'; // Green
            case 'CLASS': return '#3B82F6'; // Blue
            case 'SYSTEM': return '#EF4444'; // Red
            case 'ATTENDANCE': return '#8B5CF6'; // Purple
            case 'REGISTRATION': return '#F59E0B'; // Orange
            default: return '#6B7280'; // Gray
        }
    };

    const getRelativeTime = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Hace menos de 1 min';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
        return date.toLocaleDateString();
    };

    const categoryColor = getCategoryColor(notification.category);
    const backgroundColor = theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderColor: theme.colors.border,
                }
            ]}
            onPress={() => onPress(notification)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
                <Ionicons
                    name={getCategoryIcon(notification.category)}
                    size={24}
                    color={categoryColor}
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text
                        style={[
                            styles.title,
                            { color: theme.colors.textPrimary },
                            !notification.is_read && styles.titleUnread
                        ]}
                        numberOfLines={1}
                    >
                        {notification.title}
                    </Text>
                    {!notification.is_read && (
                        <View style={styles.unreadDot} />
                    )}
                </View>

                <Text
                    style={[styles.message, { color: theme.colors.textSecondary }]}
                    numberOfLines={2}
                >
                    {notification.message}
                </Text>

                <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                    {getRelativeTime(notification.created_at).toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    titleUnread: {
        fontWeight: '700',
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    time: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0ea5e9',
        marginLeft: 8,
    },
});
