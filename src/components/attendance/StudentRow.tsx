// src/components/attendance/StudentRow.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface StudentRowProps {
    name: string;
    avatar?: string;
    status: 'present' | 'absent';
    onStatusChange: (status: 'present' | 'absent') => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ name, avatar, status, onStatusChange }) => {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.info}>
                <Image 
                    source={{ uri: 'https://mockmind-api.uifaces.co/content/human/221.jpg' }} 
                    style={styles.avatar} 
                />
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{name}</Text>
            </View>
            <View style={styles.actions}>
                <Button 
                    type="success" size="sm" icon="check-circle"
                    variant={status === 'present' ? 'solid' : 'outline'}
                    onPress={() => onStatusChange('present')}
                />
                <Button 
                    type="danger" size="sm" icon="close"
                    variant={status === 'absent' ? 'solid' : 'outline'}
                    onPress={() => onStatusChange('absent')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    info: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    name: { fontSize: 15, fontWeight: '600' },
    actions: { flexDirection: 'row', gap: 8 }
});