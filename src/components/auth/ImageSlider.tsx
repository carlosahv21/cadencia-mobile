import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface ImageSliderProps {
  images: ImageSourcePropType[];
  height?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  height: sliderHeight = height * 0.4,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { height: sliderHeight }]}>
      <Swiper
        autoplay
        autoplayTimeout={4}
        loop
        showsPagination
        dotColor="rgba(255, 255, 255, 0.3)"
        activeDotColor="#ffffff"
        paginationStyle={styles.pagination}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </Swiper>

      {/* Gradient overlay for smooth transition to form */}
      <LinearGradient
        colors={['transparent', theme.colors.background]}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'relative',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  pagination: {
    bottom: 20,
  },
});
