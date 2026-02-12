import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { DanceFlowNotification, NotificationCategory } from '../../types';
import { ManagementHeader } from '../../components/common/ManagementHeader';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { NotificationFilters } from '../../components/notifications/NotificationFilters';
import { EmptyState } from '../../components/common/EmptyState';

interface NotificationsScreenProps {
    navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const {
        notifications,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications();

    const [filteredNotifications, setFilteredNotifications] = useState<DanceFlowNotification[]>([]);
    const [activeFilter, setActiveFilter] = useState<'ALL' | NotificationCategory>('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Initial filter when notifications change
        filterNotifications();
    }, [notifications]);

    useEffect(() => {
        filterNotifications();
    }, [activeFilter, notifications, searchText]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchNotifications();
        setIsRefreshing(false);
    };

    const filterNotifications = () => {
        let filtered = notifications;

        // Filter by category
        if (activeFilter !== 'ALL') {
            filtered = filtered.filter((n) => n.category === activeFilter);
        }

        // Filter by search text
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(lowerSearch) ||
                    n.message.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredNotifications(filtered);
    };

    const handleNotificationPress = async (notification: DanceFlowNotification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
    };

    const onSearchChange = (text: string) => {
        setSearchText(text);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleNotificationDelete = async (notification: DanceFlowNotification) => {
        await deleteNotification(notification.id);
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const renderHeader = () => (
        <View>
            <ManagementHeader
                title="Notificaciones"
                subtitle={`Tienes ${unreadCount} mensaje${unreadCount !== 1 ? 's' : ''} nuevo${unreadCount !== 1 ? 's' : ''} sin leer`}
                onBack={() => navigation.goBack()}
                showSearch={true}
                searchText={searchText}
                onSearchChange={onSearchChange}
                placeholder="Buscar notificaciones"
            />

            <View style={styles.filterRow}>
                <NotificationFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    style={styles.filters}
                />

                {unreadCount > 0 && (
                    <TouchableOpacity
                        style={[
                            styles.markAllButton,
                        ]}
                        onPress={handleMarkAllAsRead}
                    >
                        <Text style={[styles.markAllButtonText, { color: theme.colors.primary }]}>
                            Marcar leídos
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View>
            <EmptyState
                icon="bell"
                title="No tienes notificaciones"
                description="Intente de nuevo más tarde"
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ManagementHeader
                    title="Notificaciones"
                    onBack={() => navigation.goBack()}
                />
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NotificationCard
                        notification={item}
                        onPress={handleNotificationPress}
                        onDelete={handleNotificationDelete}
                    />
                )}
                ListHeaderComponent={renderHeader()}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={[
                    styles.listContent,
                    filteredNotifications.length === 0 && styles.listContentEmpty
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    listContentEmpty: {
        flexGrow: 1,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    filters: {
        flex: 1,
    },
    markAllButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 8,
    },
    markAllButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
