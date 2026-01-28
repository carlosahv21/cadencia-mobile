import React from 'react'; 
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BadgeItem } from './BadgeItem';
import { Badge } from '../../types/profile';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeShowcaseProps {
    badges: Badge[];
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.editIcon, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <MaterialIcons name="edit" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

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
    },
    editIcon: {
        position: 'absolute',
        top: -10,
        right: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
