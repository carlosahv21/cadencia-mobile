import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Badge as BadgeType } from '../../types/profile';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeItemProps {
    badge: BadgeType;
}

export const BadgeItem: React.FC<BadgeItemProps> = ({ badge }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={badge.gradient}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <FontAwesome name={badge.icon as any} size={30} color="#fff" />
            </LinearGradient>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                {badge.label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 100,
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 12,
    },
});
