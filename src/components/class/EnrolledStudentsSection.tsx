import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';

interface StudentItemProps {
    name: string;
    avatar: string;
    plan: string;
    credits: string;
    status: 'present' | 'absent' | 'pending';
    onPress?: () => void;
}

const StudentItem: React.FC<StudentItemProps> = ({ name, avatar, plan, credits, status, onPress }) => {
    const { theme } = useTheme();

    const getStatusIcon = () => {
        switch (status) {
            case 'present': return <FontAwesome name="check-circle-o" size={18} color="#10B981" />;
            case 'absent': return <FontAwesome name="times-circle-o" size={18} color="#EF4444" />;
            case 'pending': return <FontAwesome name="exclamation-circle" size={18} color="#F59E0B" />;
        }
    };

    const getStatusBg = () => {
        switch (status) {
            case 'present': return '#D1FAE5';
            case 'absent': return '#FEE2E2';
            case 'pending': return '#FEF3C7';
        }
    };

    return (
        <Card style={styles.itemCard} noPadding>
            <View style={styles.itemContent}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={styles.infoContainer}>
                    <Text style={[styles.studentName, { color: theme.colors.textPrimary }]}>{name}</Text>
                    <Text style={[styles.planInfo, { color: theme.colors.textSecondary }]}>
                        {plan} {credits ? `• ${credits}` : ''}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
                    {getStatusIcon()}
                </View>
            </View>
        </Card>
    );
};

interface EnrolledStudentsSectionProps {
    students: Array<{
        id: string;
        name: string;
        avatar: string;
        plan: string;
        credits: string;
        status: 'present' | 'absent' | 'pending';
    }>;
    onViewAll?: () => void;
}

export const EnrolledStudentsSection: React.FC<EnrolledStudentsSectionProps> = ({
    students,
    onViewAll
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <SectionHeader
                title="Alumnos Inscritos"
            // actionText="Ver Todos"
            // onActionPress={() => onViewAll?.()}
            />
            <View style={styles.list}>
                {students.map(student => (
                    <StudentItem key={student.id} {...student} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        gap: 0,
    },
    itemCard: {
        marginBottom: 12,
        padding: 10,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    studentName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    planInfo: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuButton: {
        padding: 8,
    },
});
