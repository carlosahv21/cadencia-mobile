import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';

interface ClassItemProps {
    day: string;
    time: string;
    className: string;
    duration: string;
    room: string;
    type: 'salsa' | 'bachata' | 'other';
    onPress?: () => void;
}

const ClassItem: React.FC<ClassItemProps> = ({ day, time, className, duration, room, type, onPress }) => {
    const { theme } = useTheme();

    const getIcon = () => {
        switch (type) {
            case 'salsa': return 'users';
            case 'bachata': return 'music';
            default: return 'star';
        }
    };

    // Paleta suave derivada del tema (sin hex hardcodeado)
    const getIconColor = () => {
        switch (type) {
            case 'salsa': return theme.colors.primary;
            case 'bachata': return theme.colors.primaryLight;
            default: return theme.colors.success;
        }
    };

    return (
        <Card onPress={onPress}>
            <View style={styles.itemContent}>
                <View style={[styles.iconBox, { backgroundColor: getIconColor() + '20' }]}>
                    <FontAwesome name={getIcon()} size={14} color={getIconColor()} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.dayTime, { color: theme.colors.primary }]}>
                        {day.toUpperCase()} • {time}
                    </Text>
                    <Text style={[styles.className, { color: theme.colors.textPrimary }]}>{className}</Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.detail}>
                            <FontAwesome name="clock-o" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{duration}</Text>
                        </View>
                        <View style={styles.detail}>
                            <FontAwesome name="map-marker" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>{room}</Text>
                        </View>
                    </View>
                </View>
                <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
            </View>
        </Card>
    );
};

interface WeeklyClassesListProps {
    classes: Array<{
        id: string;
        day: string;
        time: string;
        name: string;
        duration: string;
        room: string;
        type: 'salsa' | 'bachata' | 'other';
    }>;
    onViewAll?: () => void;
}

export const WeeklyClassesList: React.FC<WeeklyClassesListProps> = ({
    classes,
    onViewAll
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <SectionHeader
                title="Clases de la Semana"
                // actionText="Ver todas"
                // onActionPress={() => { }}
            />

            <View style={styles.list}>
                {classes.map(cls => (
                    <ClassItem
                        key={cls.id}
                        day={cls.day}
                        time={cls.time}
                        className={cls.name}
                        duration={cls.duration}
                        room={cls.room}
                        type={cls.type}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
    },
    list: {
        gap: 0,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    dayTime: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
    },
    className: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailIcon: {
        marginRight: 4,
    },
    detailText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
