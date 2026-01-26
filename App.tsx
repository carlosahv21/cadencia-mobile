import React from 'react';
import { Platform, LogBox } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// --- PARCHES PARA WEB (Opera/Chrome) ---

if (Platform.OS === 'web') {
  // 1. Soluciona: "Uncaught ReferenceError: setImmediate is not defined"
  // Esto es vital para que librerías como Ant Design y Swiper funcionen
  if (typeof (global as any).setImmediate === 'undefined') {
    (global as any).setImmediate = (fn: any) => setTimeout(fn, 0);
  }

  // 2. Opcional: Ignorar advertencias específicas de la web que ensucian la consola
  LogBox.ignoreLogs([
    'request on WakeLock', // Ignora el error de KeepAwake en Opera
  ]);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}