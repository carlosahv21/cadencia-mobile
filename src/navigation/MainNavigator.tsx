import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Pantallas
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { ClassesScreen } from '../screens/main/ClassesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

export const MainNavigator = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { key: 'home', title: 'Inicio', icon: 'home' }, // Icono de cuadrícula
    { key: 'classes', title: 'Clases', icon: 'calendar-o' }, // Icono calendario lineal
    { key: 'profile', title: 'Perfil', icon: 'user' }, // Icono de usuario
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardScreen />;
      case 'classes': return <ClassesScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* TabBar Fijo Estilo Dashboard */}
      <View style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.surface,
          paddingBottom: Math.max(insets.bottom, 15),
          height: 60 + Math.max(insets.bottom, 15),
          borderTopColor: theme.colors.border,
        }
      ]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <FontAwesome
                name={tab.icon as any}
                size={22}
                color={isActive ? '#3B82F6' : '#94A3B8'} // Azul activo vs gris suave
              />
              <Text style={[
                styles.tabTitle,
                { color: isActive ? '#3B82F6' : '#94A3B8' }
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9', // Línea divisoria muy sutil
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  tabTitle: {
    fontSize: 12, // Texto pequeño como en el diseño
    fontWeight: '600', // Texto en extra negrita
    marginTop: 2,
    letterSpacing: 0.5,
  }
});