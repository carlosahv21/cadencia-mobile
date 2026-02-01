import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuración corregida para cumplir con la interfaz NotificationBehavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    registerForPushNotificationsAsync: async (): Promise<string | undefined> => {
        let token: string | undefined;

        if (!Device.isDevice) {
            console.warn('Debes usar un dispositivo físico para notificaciones push');
            return undefined;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.error('Fallo al obtener el token para notificaciones push');
            return undefined;
        }

        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (error) {
            console.error('Error al obtener el token de Expo:', error);
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#0ea5e9',
            });
        }

        return token;
    },
};