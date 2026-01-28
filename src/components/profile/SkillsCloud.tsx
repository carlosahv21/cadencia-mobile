import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
                    <TouchableOpacity style={[styles.editButton, { borderColor: theme.colors.border }]}>
                        <MaterialIcons name="edit" size={12} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.tagsContainer}>
                    {skills.map((skill) => (
                        <View key={skill.id} style={[styles.tag, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                            <Text style={[styles.tagText, { color: theme.colors.primary }]}>{skill.label}</Text>
                        </View>
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
    editButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        height: 'auto',
    },
    tagText: {
        color: '#0ea5e9',
        fontSize: 14,
        fontWeight: '400',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
