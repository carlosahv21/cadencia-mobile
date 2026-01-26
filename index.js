import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import { activateKeepAwake } from 'expo-keep-awake';
import App from './App';

if (__DEV__) {
    // Solo activamos KeepAwake en dispositivos móviles (iOS/Android)
    // En Web (Opera/Chrome), esto suele causar errores de permisos "WakeLock"
    if (Platform.OS !== 'web') {
        activateKeepAwake();
    }
}

registerRootComponent(App);