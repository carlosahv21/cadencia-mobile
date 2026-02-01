import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tag } from './Tag';

interface ProfileHeaderProps {
    name: string;
    role: string;
    avatar: string;
    email?: string;
    specialty?: string;
    title?: string;
    onBack?: () => void;
    onEdit?: () => void;
    showEditButton?: boolean;
}

export const ProfileResumeHeader: React.FC<ProfileHeaderProps> = ({
    name,
    role,
    avatar,
    email,
    specialty,
    title,
    onBack,
    onEdit,
    showEditButton = true
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.topNav}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.navButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} />}
            </View>

            <View style={styles.avatarContainer}>
                <View style={[styles.avatarWrapper, { borderColor: '#fff' }]}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>
                <View style={styles.onlineBadge} />
            </View>

            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>

            {email && (
                <Button
                    title={email}
                    onPress={() => { }}
                    type="transparent"
                    variant="filled"
                    size="sm"
                    style={{ height: 24 }}
                />
            )}

            {showEditButton && (
                <Button
                    title={t('profile.edit_profile')}
                    onPress={() => { }}
                    type="transparent"
                    variant="filled"
                    textToUppercase={true}
                    size="sm"
                    style={{ height: 24 }}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    navButton: {
        marginRight: 15,
        padding: 5,
    },
    navButtonPlaceholder: {
        width: 40,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '400',
        marginBottom: 10,
    },
});
