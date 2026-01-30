import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchResultCardProps {
    item: any;
    index: number;
    type: string;
    onPress: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ item, index, type, onPress }) => {
    const { theme } = useTheme();
    const isPerson = type === 'student' || type === 'teacher';
    const title = item.name || `${item.first_name} ${item.last_name || ''}`;

    return (
        <Animated.View entering={FadeInUp.delay(index * 50)}>
            <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.colors.surface }]} 
                onPress={onPress}
            >
                {isPerson ? (
                    <Image
                        source={{ uri: item.avatar || 'https://mockmind-api.uifaces.co/content/human/221.jpg' }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={[styles.avatar, styles.letterAvatar, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Text style={[styles.letterText, { color: theme.colors.primary }]}>
                            {title.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{title}</Text>
                    <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
                        {item.email || item.description || item.genre || type}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center', padding: 12,
        borderRadius: 16, marginBottom: 10, elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
    },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    letterAvatar: { justifyContent: 'center', alignItems: 'center' },
    letterText: { fontWeight: 'bold', fontSize: 16 },
    info: { marginLeft: 12, flex: 1 },
    name: { fontSize: 15, fontWeight: '700' },
    sub: { fontSize: 12, marginTop: 2 }
});