import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';

import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { BadgeShowcase } from '../../components/profile/BadgeShowcase';
import { SkillsCloud } from '../../components/profile/SkillsCloud';
import { ConfigList } from '../../components/profile/ConfigList';
import { Badge, Skill } from '../../types/profile';

import { Button } from '../../components/common/Button';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { achievementsService } from '../../services/achievements.service';
import { teacherService } from '../../services/teacher.service';

export const ProfileScreen = () => {
    const { theme } = useTheme();
    const { logout, user, hasModule } = useAuth();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const isStudent = user?.role === 'student';
    const isTeacher = user?.role === 'teacher';

    const [badges, setBadges] = useState<Badge[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);

    // Logros reales del estudiante (si el módulo está activo)
    useEffect(() => {
        if (!isStudent || !hasModule('achievements')) return;
        achievementsService.getMyCatalog().then((catalog) => {
            setBadges(catalog.map((a) => ({
                id: String(a.id),
                icon: a.earned ? 'trophy' : 'lock',
                label: a.name,
                gradient: a.earned
                    ? theme.colors.gradient
                    : [theme.colors.border, theme.colors.textSecondary] as [string, string],
            })));
        });
    }, [isStudent, hasModule, theme.colors]);

    // Especialidades del profesor: géneros únicos de sus clases
    useEffect(() => {
        if (!isTeacher || !user?.id) return;
        teacherService.getById(user.id)
            .then((res) => {
                const genres = [...new Set((res.data?.weekly_classes || []).map((c) => c.genre).filter(Boolean))];
                setSkills(genres.map((g, i) => ({ id: String(i), label: g })));
            })
            .catch(() => setSkills([]));
    }, [isTeacher, user?.id]);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View entering={FadeIn.duration(600).delay(100)}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    {t('profile.title')}
                </Text>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <ProfileHeader
                    name={user?.name || 'Passo'}
                    role={user?.role || ''}
                    email={user?.email}
                    avatar={user?.avatar}
                />
            </Animated.View>

            {isStudent && badges.length > 0 && (
                <Animated.View entering={FadeInRight.delay(250).duration(600)}>
                    <BadgeShowcase badges={badges} />
                </Animated.View>
            )}

            {isTeacher && skills.length > 0 && (
                <Animated.View entering={FadeInRight.delay(250).duration(600)}>
                    <SkillsCloud skills={skills} />
                </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(350).duration(600)}>
                <ConfigList />
            </Animated.View>

            <Animated.View
                style={styles.footer}
                entering={FadeInRight.delay(450).duration(600)}
            >
                <Button
                    title={t('common.logout')}
                    onPress={logout}
                    type="danger"
                    variant='filled'
                    icon="sign-out"
                    size="lg"
                />

                <View style={styles.versionContainer}>
                    <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
                        {t('profile.version', { version: '1.0.0' })}
                    </Text>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 16,
    },
    footer: {
        marginTop: 28,
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
