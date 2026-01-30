import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Toast } from '@ant-design/react-native';
import { Ionicons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';

export const showSuccessToast = (message: string, onClose?: () => void) => {
    // Feedback físico
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Toast.info({
        content: (
            <View style={styles.container}>
                <Ionicons name="checkmark-circle" size={50} color="#FFF" />
                <Text style={styles.text}>{message}</Text>
            </View>
        ),
        duration: 1.5,
        onClose: onClose,
    });
};

export const showErrorToast = (message: string) => {
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Toast.fail({
        content: (
            <View style={styles.container}>
                <Ionicons name="close-circle" size={50} color="#FFF" />
                <Text style={styles.text}>{message}</Text>
            </View>
        ),
        duration: 2,
    });
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        minWidth: 160,
    },
    text: {
        color: '#FFF',
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
});