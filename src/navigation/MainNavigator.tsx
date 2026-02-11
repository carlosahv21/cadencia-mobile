import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';

// Pantallas
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ClassesScreen } from '../screens/class/ClassesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AttendanceScreen } from '../screens/attendance/AttendanceScreen';
import { GlobalSearchScreen } from '../screens/search/GlobalSearchScreen';
import { ResumeStudent } from '../screens/student/ResumeStudent';
import { ResumenTeacher } from '../screens/teacher/ResumenTeacher';
import { ResumeClass } from '../screens/class/ResumeClass';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { DanceClass } from '../types';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />
      <Stack.Screen name="ResumeStudent" component={ResumeStudent} />
      <Stack.Screen name="ResumenTeacher" component={ResumenTeacher} />
      <Stack.Screen name="ResumeClass" component={ResumeClass} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null);

  // Role IDs: 1: Admin, 2: Teacher, 3: Student
  const isStaff = user?.role === 'admin' || user?.role === 'teacher';

  const tabs = [
    { key: 'home', title: t('dashboard.tabs.home'), icon: 'home' },
    ...(isStaff ? [{ key: 'classes', title: t('dashboard.tabs.attendance'), icon: 'calendar-check-o' }] : []),
    { key: 'profile', title: t('dashboard.tabs.profile'), icon: 'user' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardScreen />;
      case 'classes':
        return selectedClass ? (
          <AttendanceScreen
            classData={selectedClass}
            onBack={() => setSelectedClass(null)}
          />
        ) : (
          <ClassesScreen onSelectClass={(clase) => setSelectedClass(clase)} />
        );
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