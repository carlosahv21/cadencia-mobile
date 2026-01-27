import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

interface NextClassProps {
    className: string;
    instructorName: string;
    time: string;
    location: string;
    instructorImage: string;
}

export const NextClassBanner = ({
    className = "Advanced Contemporary",
    instructorName = "Marco",
    time = "15 mins",
    location = "Studio A",
    instructorImage = "https://mockmind-api.uifaces.co/content/human/221.jpg"
}: NextClassProps) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2563EB', '#3B82F6']} // Degradado de azul profundo a azul claro
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.leftInfo}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>NEXT CLASS</Text>
                        </View>

                        <Text style={styles.className} numberOfLines={2}>
                            {className}
                        </Text>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                {/* Icono clock-o de FontAwesome */}
                                <FontAwesome name='clock-o' size={16} color="white" />
                                <Text style={styles.detailText}>{time}</Text>
                            </View>
                            <View style={[styles.detailItem, { marginLeft: 15 }]}>
                                {/* Icono map-marker de FontAwesome */}
                                <FontAwesome name="map-marker" size={18} color="white" />
                                <Text style={styles.detailText}>{location}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        <View style={styles.instructorContainer}>
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={{ uri: instructorImage }}
                                    style={styles.instructorPhoto}
                                />
                            </View>
                            <View style={styles.instructorTag}>
                                <Text style={styles.instructorNameText}>{instructorName}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    gradient: {
        borderRadius: 20,
        padding: 24,
        minHeight: 160,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftInfo: {
        flex: 1,
    },
    tag: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    tagText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '400',
    },
    className: {
        color: 'white',
        fontSize: 26, // Título más grande e impactante
        fontWeight: '500',
        marginBottom: 18,
        lineHeight: 30,
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
        borderColor: 'rgba(255, 255, 255, 0.5)', // Aro blanco sutil
    },
    instructorPhoto: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
    },
    instructorTag: {
        backgroundColor: '#60A5FA', // Azul brillante para el nombre
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