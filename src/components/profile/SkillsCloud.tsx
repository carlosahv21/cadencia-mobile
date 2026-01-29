import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Tag } from '../common/Tag';
import { Button } from '../common/Button';

import { Skill } from '../../types/profile';
import { useTheme } from '../../contexts/ThemeContext';

interface SkillsCloudProps {
    skills: Skill[];
}

export const SkillsCloud: React.FC<SkillsCloudProps> = ({ skills }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        Especialidades
                    </Text>
                    <Button
                        onPress={() => { }}
                        type="default"
                        variant="filled"
                        size="xs"
                        icon="pencil"
                        iconSize={12}
                        style={{ top: -5 }}
                    />
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.tagsContainer}>
                    {skills.map((skill) => (
                        <Tag
                            key={skill.id}
                            label={skill.label}
                            type="primary"
                            size="md"
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
        paddingHorizontal: 10,
        letterSpacing: 0.5,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
