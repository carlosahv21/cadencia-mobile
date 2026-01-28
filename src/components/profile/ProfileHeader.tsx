import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@ant-design/react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProfileHeaderProps {
    name: string;
    role: string;
    avatar: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, role, avatar }) => {
    const { theme } = useTheme();

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.avatarContainer}>
                <View style={[styles.avatarWrapper, { borderColor: '#fff' }]}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>
                <View style={styles.onlineBadge} />
            </View>

            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>

            <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
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
        marginBottom: 16,
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
