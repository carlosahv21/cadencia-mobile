import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Toast } from '@ant-design/react-native';
import { Ionicons } from '@expo/vector-icons';

export const showSuccessToast = (message: string, onClose?: () => void) => {
    Toast.show({
        content: (
            <View style={styles.container}>
                <Ionicons name="checkmark-circle" size={50} color="#FFF" />
                <Text style={styles.text}>{message}</Text>
            </View>
        ),
        duration: 1.5,
        onClose: onClose,
        mask: true,
    });
};

export const showErrorToast = (message: string) => {
    Toast.show({
        content: (
            <View style={styles.container}>
                <Ionicons name="close-circle" size={50} color="#FFF" />
                <Text style={styles.text}>{message}</Text>
            </View>
        ),
        duration: 2,
        mask: true,
    });
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        minWidth: 160,
    },
    text: {
        color: '#FFF',
        marginTop: 12,
        fontSize: 15, // Un poco más pequeño para mejor legibilidad
        fontWeight: '700',
        textAlign: 'center',
    },
});