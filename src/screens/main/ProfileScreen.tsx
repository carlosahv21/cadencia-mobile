import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { BadgeShowcase } from '../../components/profile/BadgeShowcase';
import { SkillsCloud } from '../../components/profile/SkillsCloud';
import { ConfigList } from '../../components/profile/ConfigList';
import { Badge, Skill } from '../../types/profile';

import { Button } from '../../components/common/Button';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const MOCK_BADGES: Badge[] = [
    {
        id: '1',
        icon: 'certificate',
        label: 'Instructor Certificado',
        gradient: ['#60a5fa', '#6366f1'],
    },
    {
        id: '2',
        icon: 'trophy',
        label: 'Fundador',
        gradient: ['#fbbf24', '#f97316'],
    },
    {
        id: '3',
        icon: 'trophy',
        label: 'Nivel 2 Bachata',
        gradient: ['#c084fc', '#ec4899'],
    },
    {
        id: '4',
        icon: 'trophy',
        label: 'Top Mentor',
        gradient: ['#34d399', '#14b8a6'],
    },
];

const MOCK_SKILLS: Skill[] = [
    { id: '1', label: 'Salsa On2' },
    { id: '2', label: 'Bachata Sensual' },
    { id: '3', label: 'Gestión' },
    { id: '4', label: 'Kizomba' },
    { id: '5', label: 'Pachanga' },
    { id: '6', label: 'Mambo' },
];

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const { logout, user } = useAuth();
    const insets = useSafeAreaInsets();

    const handleLogout = () => {
        logout();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
        >
            <ProfileHeader
                name={user?.name || 'Admin Prueba'}
                role={user?.role || 'Director de Academia'}
                avatar={user?.avatar || 'https://mockmind-api.uifaces.co/content/human/222.jpg'}
            />

            <BadgeShowcase badges={MOCK_BADGES} />

            <SkillsCloud skills={MOCK_SKILLS} />

            <ConfigList />

            <View style={styles.footer}>
                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                    type="danger"
                    variant='filled'
                    icon="sign-out"
                    size="lg"
                />

                <View style={styles.versionContainer}>
                    <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
                        VERSION 1.0.0
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    versionContainer: {
        marginTop: 20,
        alignItems: 'center',
        opacity: 0.3,
    },
    versionText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
});