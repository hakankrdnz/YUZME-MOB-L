import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,   // Electric Yellow
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "sunny" : "sunny-outline"} 
              color={color} 
              size={22} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Training',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "clipboard" : "clipboard-outline"} 
              color={color} 
              size={22} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "stats-chart" : "stats-chart-outline"} 
              color={color} 
              size={22} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Subscription',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              color={color} 
              size={22} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
