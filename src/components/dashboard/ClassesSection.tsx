import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { DanceClass } from '../../types';

interface ClassesSectionProps {
    classes: DanceClass[];
    loading: boolean;
    onViewAll?: () => void;
    onClassPress?: (clase: DanceClass) => void;
}

export const ClassesSection = ({ classes, loading, onViewAll, onClassPress }: ClassesSectionProps) => {
    const { theme } = useTheme();

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Today's Classes
                </Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : classes.length > 0 ? (
                classes.map((clase, index) => (
                    <View key={clase.id} style={styles.timelineRow}>
                        {/* Columna Izquierda: Hora y Línea de tiempo */}
                        <View style={styles.hourCol}>
                            <Text style={[styles.hourLabel, { color: '#64748B' }]}>{clase.hour}</Text>
                            {/* La línea no se dibuja en el último elemento */}
                            {index !== classes.length - 1 && <View style={styles.timelineLine} />}
                            <View style={[styles.timelineDot, index === 0 && styles.activeDot]} />
                        </View>

                        {/* Columna Derecha: Tarjeta de Clase */}
                        <Card 
                            style={styles.classCard} 
                            onPress={() => onClassPress?.(clase)}
                            noPadding
                        >
                            <View style={styles.cardInternal}>
                                <View style={styles.infoWrapper}>
                                    <Text style={[styles.className, { color: theme.colors.textPrimary }]}>
                                        {clase.name}
                                    </Text>
                                    <View style={styles.detailsRow}>
                                        <Text style={[styles.classSub, { color: '#94A3B8' }]}>
                                            {clase.level} • Studio A
                                        </Text>
                                        
                                        <View style={styles.lowOccBadge}>
                                            <Text style={styles.lowOccText}>LOW OCCUPANCY</Text>
                                        </View>
                                    </View>
                                </View>
                                <FontAwesome name="angle-right" size={20} color="#CBD5E1" />
                            </View>
                        </Card>
                    </View>
                ))
            ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    No hay clases programadas
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    viewAllText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    timelineRow: { flexDirection: 'row', marginBottom: 15, minHeight: 90 },
    hourCol: { width: 50, alignItems: 'center', position: 'relative' },
    hourLabel: { fontSize: 13, fontWeight: '600', marginBottom: 5 },
    timelineLine: {
        position: 'absolute',
        top: 25,
        bottom: -15,
        width: 2,
        backgroundColor: '#F1F5F9', // Línea gris suave
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
        marginTop: 8,
        zIndex: 1,
    },
    activeDot: { backgroundColor: '#3B82F6', borderWidth: 2, borderColor: '#DBEAFE' },
    classCard: { flex: 1, marginLeft: 10, alignSelf: 'stretch' },
    cardInternal: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        flex: 1,
    },
    infoWrapper: { flex: 1 },
    className: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    detailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    classSub: { fontSize: 12, fontWeight: '500' },
    lowOccBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lowOccText: { color: '#EF4444', fontSize: 10, fontWeight: '800' },
    emptyText: { textAlign: 'center', marginTop: 20 },
});