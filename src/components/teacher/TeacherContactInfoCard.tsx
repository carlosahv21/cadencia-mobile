import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';
import { SectionHeader } from '../common/SectionHeader';

interface ContactItemProps {
    icon: keyof typeof FontAwesome.glyphMap;
    label: string;
    value: string;
    onPress: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, onPress }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity style={styles.itemRow} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: theme.mode === 'light' ? '#F1F5F9' : '#1E293B' }]}>
                <FontAwesome name={icon} size={14} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.itemText}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label.toUpperCase()}</Text>
                <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{value}</Text>
            </View>
        </TouchableOpacity>
    );
};

interface TeacherContactInfoCardProps {
    email: string;
    phone: string;
}

export const TeacherContactInfoCard: React.FC<TeacherContactInfoCardProps> = ({
    email,
    phone
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <SectionHeader
                title="Información de Contacto"
            />
            <Card style={styles.card}>
                <ContactItem icon="envelope" label="Email" value={email} onPress={() => { }} />
                <View style={styles.spacer} />
                <ContactItem icon="phone" label="Teléfono" value={phone} onPress={() => { }} />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
        marginBottom: 10,
    },
    card: {
        marginTop: 0,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemText: {
        flex: 1,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
    },
    spacer: {
        height: 20,
    },
});
