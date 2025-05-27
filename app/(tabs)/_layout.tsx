import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';

import React from 'react';
type TabBarButtonProps = React.ComponentPropsWithoutRef<typeof TouchableOpacity>;

const CustomTabBarButton = React.forwardRef<any, TabBarButtonProps>((props, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      onPress={props.onPress}
      style={props.style}
      activeOpacity={0.8}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      testID={props.testID}
    >
      {props.children}
    </TouchableOpacity>
  );
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
        headerShown: false,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              backgroundColor: colorScheme === 'dark' ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
              borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: 12,
            },
            android: {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
              elevation: 8,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
          }),
        },
        tabBarItemStyle: {
          borderRadius: 16,
          margin: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarAccessibilityLabel: 'Vai alla dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Aggiungi attività',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <MaterialIcons name="add" size={36} color="#fff" />
            </View>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          tabBarAccessibilityLabel: 'Vai al profilo',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
