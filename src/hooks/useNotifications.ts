import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notification.service';

/**
 * Hook para manejar notificaciones push
 * Configura listeners para notificaciones recibidas e interacciones del usuario
 */
export const useNotifications = (
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) => {
    const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
    const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

    useEffect(() => {
        // Listener para cuando se recibe una notificación mientras la app está abierta
        notificationListener.current = notificationService.addNotificationReceivedListener(
            (notification) => {
                console.log('📱 Notificación recibida:', notification);
                if (onNotificationReceived) {
                    onNotificationReceived(notification);
                }
            }
        );

        // Listener para cuando el usuario interactúa con una notificación
        responseListener.current = notificationService.addNotificationResponseReceivedListener(
            (response) => {
                console.log('👆 Usuario interactuó con notificación:', response);
                if (onNotificationResponse) {
                    onNotificationResponse(response);
                }
            }
        );

        // Cleanup: remover listeners cuando el componente se desmonte
        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [onNotificationReceived, onNotificationResponse]);

    return {
        scheduleNotification: notificationService.scheduleLocalNotification,
        cancelAllNotifications: notificationService.cancelAllScheduledNotifications,
        getPresentedNotifications: notificationService.getPresentedNotifications,
        dismissAllNotifications: notificationService.dismissAllNotifications,
    };
};
