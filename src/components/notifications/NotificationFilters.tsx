import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common/Button';
import { NotificationCategory } from '../../types';

interface NotificationFiltersProps {
    activeFilter: 'ALL' | NotificationCategory;
    onFilterChange: (filter: 'ALL' | NotificationCategory) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
    activeFilter,
    onFilterChange,
}) => {
    const filters: Array<{ key: 'ALL' | NotificationCategory; label: string }> = [
        { key: 'ALL', label: 'Todas' },
        { key: 'PAYMENT', label: 'Pagos' },
        { key: 'CLASS', label: 'Clases' },
        { key: 'SYSTEM', label: 'Sistema' },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter) => (
                <View key={filter.key} style={styles.buttonWrapper}>
                    <Button
                        title={filter.label}
                        onPress={() => onFilterChange(filter.key)}
                        variant={activeFilter === filter.key ? 'solid' : 'outline'}
                        type="primary"
                        size="sm"
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    buttonWrapper: {
        marginRight: 8,
    },
});
