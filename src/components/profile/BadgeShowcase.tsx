import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BadgeItem } from './BadgeItem';
import { Badge } from '../../types/profile';
import { SectionHeader } from '../common/SectionHeader';

interface BadgeShowcaseProps {
    badges: Badge[];
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <SectionHeader title={t('profile.achievements')} />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {badges.map((badge) => (
                    <BadgeItem key={badge.id} badge={badge} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 22,
    },
    scrollContent: {
        paddingVertical: 10,
    }
});
