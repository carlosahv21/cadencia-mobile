import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../common/Button';

interface DashboardHeaderProps {
    onSearchPress?: () => void;
    onNotificationsPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    onSearchPress,
    onNotificationsPress
}) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { unreadCount } = useNotifications();
    const { t } = useTranslation();

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-20);

    useEffect(() => {
        opacity.value = withSpring(1);
        translateY.value = withSpring(0);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const firstName = user?.name?.split(' ')[0] || 'User';

    return (
        <Animated.View style={[styles.headerContainer, animatedStyle]}>
            <View style={styles.leftSection}>
                <Text style={[styles.greetingText, { color: theme.colors.textPrimary }]}>
                    {t('dashboard.greeting', { name: firstName })} 👋
                </Text>
                <Text style={[styles.subtitleText, { color: theme.colors.textSecondary }]}>
                    {t('dashboard.subtitle')}
                </Text>
                <Text style={[styles.accentText, { color: theme.colors.primary }]}>
                    {t('dashboard.next_awaits')}
                </Text>
            </View>

            <View style={styles.actionsContainer}>
                {user?.role === 'admin' && (
                    <Button
                        onPress={() => onSearchPress?.()}
                        type="default"
                        variant="filled"
                        size="sm"
                        icon="search"
                    />
                )}

                <Button
                    onPress={() => onNotificationsPress?.()}
                    type="default"
                    variant="filled"
                    size="sm"
                    icon="bell"
                    badge={unreadCount > 0}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 20,
    },
    leftSection: {
        flex: 1,
        paddingRight: 12,
    },
    greetingText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitleText: {
        fontSize: 14,
        marginBottom: 4,
    },
    accentText: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});
