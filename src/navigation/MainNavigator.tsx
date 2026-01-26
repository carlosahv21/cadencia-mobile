import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar, Icon } from '@ant-design/react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

import { SafeAreaView } from 'react-native-safe-area-context';

// Pantallas
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { ClassesScreen } from '../screens/main/ClassesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

export const MainNavigator = () => {
  const { theme } = useTheme();
  const { academy } = useAuth();
  const [selectedTab, setSelectedTab] = useState('home');

  // Renderizado condicional de la pantalla (Navegación manual ultra estable)
  const renderContent = () => {
    switch (selectedTab) {
      case 'home': return <DashboardScreen />;
      case 'classes': return <ClassesScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Área de contenido */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* TabBar oficial de @ant-design/react-native */}
      <TabBar
        unselectedTintColor="#949494"
        tintColor={theme.colors.primary}
        barTintColor={theme.colors.surface}
      >
        <TabBar.Item
          title="Inicio"
          icon={<Icon name="home" />}
          selected={selectedTab === 'home'}
          onPress={() => setSelectedTab('home')}
        >
          {/* Dejar vacío porque renderizamos arriba */}
        </TabBar.Item>
        <TabBar.Item
          title="Clases"
          icon={<Icon name="ordered-list" />}
          selected={selectedTab === 'classes'}
          onPress={() => setSelectedTab('classes')}
        />
        <TabBar.Item
          title="Perfil"
          icon={<Icon name="user" />}
          selected={selectedTab === 'profile'}
          onPress={() => setSelectedTab('profile')}
        />
      </TabBar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});