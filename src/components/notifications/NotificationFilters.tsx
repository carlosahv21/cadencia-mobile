import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { Button } from '../common/Button';
import { NotificationCategory } from '../../types';

interface NotificationFiltersProps {
    activeFilter: 'ALL' | NotificationCategory;
    onFilterChange: (filter: 'ALL' | NotificationCategory) => void;
    style?: ViewStyle;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
    activeFilter,
    onFilterChange,
    style,
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
            style={style}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter) => (
                <View key={filter.key} style={styles.buttonWrapper}>
                    <Button
                        title={filter.label}
                        onPress={() => onFilterChange(filter.key)}
                        variant={activeFilter === filter.key ? 'solid' : 'link'}
                        type="primary"
                        size="sm"
                        style={styles.button}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    buttonWrapper: {
        marginRight: 8,
    },
    button: {
        borderRadius: 8,
        height: 32,
        paddingHorizontal: 12
    },
});
