import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useTheme } from '../../contexts/ThemeContext';
import { DanceFlowNotification, NotificationCategory } from '../../types';

interface NotificationCardProps {
    notification: DanceFlowNotification;
    onPress: (notification: DanceFlowNotification) => void;
    onDelete?: (notification: DanceFlowNotification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onPress,
    onDelete,
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

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.5, 0],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={[
                    styles.deleteAction,
                    {
                        transform: [{ translateX }],
                        opacity,
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete?.(notification)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const categoryColor = getCategoryColor(notification.category);
    const backgroundColor = theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF';

    return (
        <Swipeable
            renderRightActions={onDelete ? renderRightActions : undefined}
            overshootRight={false}
            rightThreshold={40}
        >
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
                        size={20}
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
        </Swipeable>
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
        width: 44,
        height: 44,
        borderRadius: 16,
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
    deleteAction: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 6,
        marginRight: 16,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    deleteText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
});

