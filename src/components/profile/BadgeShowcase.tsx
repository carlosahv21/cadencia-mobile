import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BadgeItem } from './BadgeItem';
import { Badge } from '../../types/profile';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';

interface BadgeShowcaseProps {
    badges: Badge[];
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {

    return (
        <View style={styles.container}>
            <Button
                onPress={() => { }}
                type="default"
                variant="filled"
                size="xs"
                icon="pencil"
                iconSize={12}
                floating="right"
                style={{ top: -10 }}
            />

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
        marginTop: -30,
        zIndex: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
});
