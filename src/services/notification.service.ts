import { Asset } from 'expo-asset';
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

// Tipos para los listeners
export type NotificationListener = (notification: Notifications.Notification) => void;
export type NotificationResponseListener = (response: Notifications.NotificationResponse) => void;

export const notificationService = {
    /**
     * Registra el dispositivo para recibir notificaciones push
     * @returns Token de Expo Push Notifications o undefined si falla
     */
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
            console.log('✅ Token de notificaciones obtenido:', token);
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

    /**
     * Agrega un listener para notificaciones recibidas
     * @param callback Función a ejecutar cuando se recibe una notificación
     * @returns Subscription que debe ser removida cuando ya no se necesite
     */
    addNotificationReceivedListener: (callback: NotificationListener) => {
        return Notifications.addNotificationReceivedListener(callback);
    },

    /**
     * Agrega un listener para cuando el usuario interactúa con una notificación
     * @param callback Función a ejecutar cuando el usuario toca una notificación
     * @returns Subscription que debe ser removida cuando ya no se necesite
     */
    addNotificationResponseReceivedListener: (callback: NotificationResponseListener) => {
        return Notifications.addNotificationResponseReceivedListener(callback);
    },

    /**
     * Programa una notificación local (útil para testing)
     * @param title Título de la notificación
     * @param body Cuerpo de la notificación
     * @param data Datos adicionales (opcional)
     * @param seconds Segundos de delay (por defecto 2)
     */
    scheduleLocalNotification: async (
        title: string,
        body: string,
        data?: Record<string, any>,
        seconds: number = 2
    ): Promise<string> => {
        // Cargar el asset del icono
        const iconAsset = Asset.fromModule(require('../assets/icon.png'));
        await iconAsset.downloadAsync();

        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: data || {},
                sound: true,
                attachments: [
                    {
                        identifier: 'icon',
                        url: iconAsset.localUri || iconAsset.uri,
                        type: 'image',
                    }
                ],
            },
            trigger: { 
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds,
                repeats: false
            },
        });
    },

    /**
     * Cancela todas las notificaciones programadas
     */
    cancelAllScheduledNotifications: async (): Promise<void> => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    /**
     * Obtiene todas las notificaciones presentadas
     */
    getPresentedNotifications: async (): Promise<Notifications.Notification[]> => {
        return await Notifications.getPresentedNotificationsAsync();
    },

    /**
     * Descarta todas las notificaciones presentadas
     */
    dismissAllNotifications: async (): Promise<void> => {
        await Notifications.dismissAllNotificationsAsync();
    },
};