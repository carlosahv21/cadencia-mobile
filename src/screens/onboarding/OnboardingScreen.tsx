import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { storage } from '../../utils/storage';

const { width, height } = Dimensions.get('window');


const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const SLIDES = [
        {
            id: '1',
            title: t('onboarding.slides.1.title'),
            description: t('onboarding.slides.1.description'),
            image: require('../../assets/images/onboarding/onboarding_01.png'),
        },
        {
            id: '2',
            title: t('onboarding.slides.2.title'),
            description: t('onboarding.slides.2.description'),
            image: require('../../assets/images/onboarding/onboarding_02.png'),
        },
        {
            id: '3',
            title: t('onboarding.slides.3.title'),
            description: t('onboarding.slides.3.description'),
            image: require('../../assets/images/onboarding/onboarding_03.png'),
        }
    ];

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            // Calculamos el siguiente índice
            const nextIndex = currentIndex + 1;
            // Forzamos el desplazamiento físico de la lista
            flatListRef.current?.scrollToOffset({
                offset: nextIndex * width,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        await storage.saveOnboardingStatus(true);
        onFinish();
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.imageContainer}>
                            <View style={styles.circleBg} />
                            {/* Asegúrate de que la ruta de la imagen sea correcta */}
                            <Image source={item.image} style={styles.image} resizeMode="contain" />
                        </View>

                        <View style={styles.textContainer}>
                            <View style={styles.dotContainer}>
                                {SLIDES.map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.miniDot,
                                            {
                                                backgroundColor: i === currentIndex ? '#000' : '#D1D1D1',
                                                width: i === currentIndex ? 15 : 6
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleComplete}>
                    <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentIndex === SLIDES.length - 1 ? t('onboarding.start') : t('onboarding.next')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    slide: {
        width: width, // Ocupa exactamente el ancho de la pantalla
        alignItems: 'center',
        paddingTop: height * 0.08
    },
    imageContainer: {
        width: width * 0.85,
        height: width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    circleBg: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        borderRadius: 200,
        backgroundColor: '#F0F2F5'
    },
    image: { width: '80%', height: '80%' },
    textContainer: { paddingHorizontal: 30, alignItems: 'center' },
    dotContainer: { flexDirection: 'row', marginBottom: 25 },
    miniDot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1A1A1A',
        marginBottom: 10
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 22
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 40
    },
    skipText: { fontSize: 14, fontWeight: '600', color: '#999' },
    nextButton: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30
    },
    nextButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default OnboardingScreen;