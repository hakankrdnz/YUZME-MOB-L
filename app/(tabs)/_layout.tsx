import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderGlass,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bugün',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons 
                name={focused ? "flash" : "flash-outline"} 
                color={color} 
                size={22} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Antrenmanlar',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialCommunityIcons 
                name={focused ? "swim" : "swim"} 
                color={color} 
                size={24} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: 'Oluşturucu',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons 
                name={focused ? "add-circle" : "add-circle-outline"} 
                color={color} 
                size={24} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Geçmiş',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                color={color} 
                size={22} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    padding: 3,
    borderRadius: 12,
    backgroundColor: Colors.primaryGlow,
  }
});

