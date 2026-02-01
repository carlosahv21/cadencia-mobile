import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { Title } from '../common/Title';

interface ActivityLogItemProps {
    icon: keyof typeof FontAwesome.glyphMap;
    label: string;
    value: string;
    isLast?: boolean;
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ icon, label, value, isLast }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.itemWrapper}>
            <View style={styles.timelineLeft}>
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.background }]}>
                    <FontAwesome name={icon} size={14} color={theme.colors.primary} />
                </View>
                {!isLast && <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />}
            </View>
            <View style={styles.itemContent}>
                <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>{label.toUpperCase()}</Text>
                <Text style={[styles.itemValue, { color: theme.colors.textPrimary }]}>{value}</Text>
            </View>
        </View>
    );
};

interface ActivityLogCardProps {
    emailVerified: boolean;
    lastLogin: string;
    createdAt: string;
}

export const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
    emailVerified,
    lastLogin,
    createdAt
}) => {
    const { theme } = useTheme();

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Title title="Registro de Actividad" />
            </View>

            <View style={styles.list}>
                <ActivityLogItem
                    icon="envelope-o"
                    label="Email Verificado"
                    value={emailVerified ? 'Verificado' : 'No verificado'}
                />
                <ActivityLogItem
                    icon="sign-in"
                    label="Último Login"
                    value={lastLogin || 'Nunca'}
                />
                <ActivityLogItem
                    icon="user-plus"
                    label="Creado En"
                    value={createdAt}
                    isLast
                />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerIcon: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    list: {
        paddingLeft: 4,
    },
    itemWrapper: {
        flexDirection: 'row',
        minHeight: 60,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        marginVertical: -12,
    },
    itemContent: {
        paddingTop: 4,
        paddingBottom: 20,
    },
    itemLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    itemValue: {
        fontSize: 15,
        fontWeight: '600',
    },
});
