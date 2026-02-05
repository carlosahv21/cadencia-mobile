import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Tag } from '../common/Tag';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface NextClassProps {
    nextClass?: {
        title: string;
        teacher: { name: string };
        location: string;
        startTime: string;
        dayName: string;
        rawHour: string;
    } | null;
}

export const NextClassBanner = ({ nextClass }: NextClassProps) => {
    const { t } = useTranslation();

    if (!nextClass) {
        return (
            <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.container}>
                <LinearGradient
                    colors={['#2563EB', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={[styles.content, { justifyContent: 'center' }]}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>
                            ¡Has terminado por hoy! ✨
                            No hay más clases programadas.
                        </Text>
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.container}
        >
            <LinearGradient
                colors={['#2563EB', '#3B82F6']} // Degradado de azul profundo a azul claro
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.leftInfo}>
                        <Tag
                            label={t('dashboard.next_class.label')}
                            type="transparent"
                            textToUpperCase={true}
                            size="sm"
                            style={{ marginBottom: 12 }}
                        />

                        <Text style={styles.className} numberOfLines={2}>
                            {nextClass.title}
                        </Text>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                {/* Icono clock-o de FontAwesome */}
                                <FontAwesome name='clock-o' size={16} color="white" />
                                <Text style={styles.detailText}>{nextClass.rawHour}</Text>
                            </View>
                            <View style={[styles.detailItem, { marginLeft: 15 }]}>
                                {/* Icono map-marker de FontAwesome */}
                                <FontAwesome name="map-marker" size={18} color="white" />
                                <Text style={styles.detailText}>{nextClass.location}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        <View style={styles.instructorContainer}>
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={{ uri: 'https://mockmind-api.uifaces.co/content/human/221.jpg' }}
                                    style={styles.instructorPhoto}
                                />
                            </View>
                            <View style={styles.instructorTag}>
                                <Text style={styles.instructorNameText}>{nextClass.teacher.name.split(' ')[0]}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
    },
    gradient: {
        borderRadius: 16,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 14,
        minHeight: 130,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftInfo: {
        flex: 1,
    },
    className: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 14,
        lineHeight: 26,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },
    rightSection: {
        marginLeft: 10,
    },
    instructorContainer: {
        alignItems: 'center',
    },
    avatarWrapper: {
        padding: 4,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    instructorPhoto: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
    },
    instructorTag: {
        backgroundColor: '#60A5FA',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: -12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    instructorNameText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
});