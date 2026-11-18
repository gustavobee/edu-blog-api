import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

// Telas
import { HomeScreen } from '../screens/HomeScreen';
import { PostDetailsScreen } from '../screens/PostDetailsScreen';
import { PostFormScreen } from '../screens/PostFormScreen';
import { AdminPostsScreen } from '../screens/AdminPostsScreen';
import { TeachersScreen } from '../screens/TeachersScreen';
import { TeacherFormScreen } from '../screens/TeacherFormScreen';
import { StudentsScreen } from '../screens/StudentsScreen';
import { StudentFormScreen } from '../screens/StudentFormScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { isTeacher } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Aulas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {isTeacher && (
        <>
          <Tab.Screen
            name="AdminPostsTab"
            component={AdminPostsScreen}
            options={{
              tabBarLabel: 'Posts Admin',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="newspaper-outline" size={size} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="TeachersTab"
            component={TeachersScreen}
            options={{
              tabBarLabel: 'Docentes',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="school-outline" size={size} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="StudentsTab"
            component={StudentsScreen}
            options={{
              tabBarLabel: 'Alunos',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
        <Stack.Screen name="PostForm" component={PostFormScreen} />
        <Stack.Screen name="TeacherForm" component={TeacherFormScreen} />
        <Stack.Screen name="StudentForm" component={StudentFormScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 6,
    paddingBottom: 10,
    minHeight: 68,
    height: 'auto',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 2,
  },
});
