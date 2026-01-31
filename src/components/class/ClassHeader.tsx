import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface ClassHeaderProps {
    title: string;
    subtitle: string;
    onBack?: () => void;
    onEdit?: () => void;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
    title,
    subtitle,
    onBack,
    onEdit
}) => {
    const { theme } = useTheme();

    return (
        <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.topNav}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.navButton}>
                        <FontAwesome name="chevron-left" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} />}

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.subtitleText}>{subtitle.toUpperCase()}</Text>
                </View>

                {onEdit ? (
                    <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                        <FontAwesome name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                ) : <View style={styles.navButtonPlaceholder} />}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    navButtonPlaceholder: {
        width: 40,
    },
    titleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    titleText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitleText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
