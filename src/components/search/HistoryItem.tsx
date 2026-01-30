import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface HistoryItemProps {
    item: any;
    index: number;
    onPress: (query: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, index, onPress }) => {
    const { theme } = useTheme();
    const displayName = item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.name;

    return (
        <Animated.View entering={FadeInRight.delay(index * 100)}>
            <TouchableOpacity 
                style={styles.container} 
                onPress={() => onPress(displayName)}
            >
                <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
                    {(!item.first_name && item.name) ? (
                        <View style={[styles.avatar, styles.letterAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
                            <Text style={[styles.letterText, { color: theme.colors.primary }]}>
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    ) : (
                        <Image
                            source={{ uri: item.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg' }}
                            style={styles.avatar}
                        />
                    )}
                </View>
                <Text numberOfLines={1} style={[styles.name, { color: theme.colors.textPrimary }]}>
                    {displayName}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', marginRight: 16, width: 70 },
    avatarRing: {
        width: 64, height: 64, borderRadius: 32,
        borderWidth: 2, padding: 2, marginBottom: 8,
        justifyContent: 'center', alignItems: 'center'
    },
    avatar: { width: '100%', height: '100%', borderRadius: 30 },
    letterAvatar: { justifyContent: 'center', alignItems: 'center' },
    letterText: { fontWeight: 'bold', fontSize: 18 },
    name: { fontSize: 11, fontWeight: '600', textAlign: 'center' }
});