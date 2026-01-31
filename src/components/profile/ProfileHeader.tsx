import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';

import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

import { FontAwesome } from '@expo/vector-icons';
import { Tag } from '../common/Tag';

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

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
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

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            {(onBack || onEdit || title) && (
                <View style={styles.topNav}>
                    {onBack ? (
                        <TouchableOpacity onPress={onBack} style={styles.navButton}>
                            <FontAwesome name="chevron-left" size={16} color="#fff" />
                        </TouchableOpacity>
                    ) : <View style={styles.navButtonPlaceholder} />}

                    {title && <Text style={styles.headerTitleText}>{title}</Text>}

                    {onEdit ? (
                        <TouchableOpacity onPress={onEdit} style={styles.navButton}>
                            <FontAwesome name="pencil" size={16} color="#fff" />
                        </TouchableOpacity>
                    ) : <View style={styles.navButtonPlaceholder} />}
                </View>
            )}

            <View style={styles.avatarContainer}>
                <View style={[styles.avatarWrapper, { borderColor: '#fff' }]}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>
                <View style={styles.onlineBadge} />
            </View>

            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>

            {specialty && (
                <Tag
                    label={specialty}
                    type="transparent"
                    variant="soft"
                    size="sm"
                    style={styles.specialtyTag}
                />
            )}

            {email && (
                <Tag
                    label={email}
                    icon={<FontAwesome name="envelope" size={12} color="#fff" />}
                    type="transparent"
                    variant="soft"
                    size="sm"
                    style={styles.emailTag}
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
                    style={{ height: 24, marginTop: 10 }}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 40,
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
        marginBottom: 20,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonPlaceholder: {
        width: 40,
    },
    headerTitleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
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
    },
    specialtyTag: {
        marginTop: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    emailTag: {
        marginTop: 10,
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});
