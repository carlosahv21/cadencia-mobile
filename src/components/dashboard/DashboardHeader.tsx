import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
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
    const { user, academy } = useAuth();
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

    return (
        <Animated.View style={[styles.headerContainer, animatedStyle]}>
            <View style={styles.leftSection}>
                <TouchableOpacity style={styles.avatarContainer}>
                    <Image
                        source={{ uri: user?.avatar || 'https://mockmind-api.uifaces.co/content/human/222.jpg' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={[styles.roleText, { color: theme.colors.textSecondary }]}>
                        {academy?.academy_name || 'DanceFlow Academy'}
                    </Text>
                    <Text style={[styles.greetingText, { color: theme.colors.textPrimary }]}>
                        {t('dashboard.hello')} {user?.name || 'User'}
                    </Text>
                </View>
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
                    badge={true}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: '#F3F4F6',
    },
    avatar: {
        width: 44,
        height: 44,
    },
    userInfo: {
        justifyContent: 'center',
    },
    roleText: {
        fontSize: 12,
        fontWeight: '400', // Standard body text
        marginBottom: 2,
    },
    greetingText: {
        fontSize: 18,
        fontWeight: '500', // Standard title weight
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
});