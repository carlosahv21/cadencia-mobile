import React from 'react';
import { Platform, LogBox, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

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

const RootContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <AppNavigator />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <RootContent />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}