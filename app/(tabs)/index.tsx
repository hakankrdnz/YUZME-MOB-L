import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { HeaderBar } from '../../components/HeaderBar';
import { WeeklyCalendarStrip } from '../../components/WeeklyCalendarStrip';
import { WorkoutExportModal } from '../../components/WorkoutExportModal';
import { INITIAL_WORKOUTS } from '../../services/workoutService';
import { Workout } from '../../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface WeeklyWorkoutItem {
  id: string;
  day: string;
  title: string;
  distanceKm: number;
  color: string;
  isRest?: boolean;
  isLightning?: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(23);
  const [exportWorkout, setExportWorkout] = useState<Workout | null>(null);

  const weeklyProgram: WeeklyWorkoutItem[] = [
    { id: '1', day: 'MON', title: 'Interval Training', distanceKm: 2.5, color: Colors.accent, isLightning: true },
    { id: '2', day: 'TUE', title: 'Long Distance', distanceKm: 3.2, color: Colors.secondary, isLightning: true },
    { id: '3', day: 'WED', title: 'Hybrid', distanceKm: 2.8, color: Colors.primary },
    { id: '4', day: 'THU', title: 'Long Speed', distanceKm: 3.0, color: Colors.green },
    { id: '5', day: 'FRI', title: 'Rest Day', distanceKm: 0, color: Colors.textMuted, isRest: true },
    { id: '6', day: 'SAT', title: 'Pure Speed', distanceKm: 2.7, color: Colors.red },
    { id: '7', day: 'SUN', title: 'Rest Day', distanceKm: 0, color: Colors.textMuted, isRest: true },
  ];

  const handleSelectWorkout = (item: WeeklyWorkoutItem) => {
    if (item.isRest) return;
    router.push({
      pathname: '/workout-detail',
      params: { title: item.title, type: item.title }
    });
  };

  const handleOpenExport = (item: WeeklyWorkoutItem, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const matched = INITIAL_WORKOUTS.find(w => w.title.toLowerCase().includes(item.title.toLowerCase())) || INITIAL_WORKOUTS[0];
    setExportWorkout(matched);
  };

  return (
    <View style={styles.screen}>
      <HeaderBar 
        onGetPro={() => Alert.alert('Pro Paket', 'Yakında aktif olacak!')}
        onSettings={() => Alert.alert('Ayarlar', 'Profil ve uygulama ayarları')}
      />

      <WeeklyCalendarStrip 
        onSelectDay={(num) => setSelectedDay(num)}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Main Welcome Hero Card */}
        <View style={styles.bannerCard}>
          <View style={styles.waveIconOuter}>
            <View style={styles.waveIconInner}>
              <MaterialCommunityIcons name="waves" size={28} color={Colors.secondary} />
            </View>
          </View>

          <Text style={styles.bannerTitle}>OPEN WATER DRAGOS</Text>
          <Text style={styles.bannerSubtitle}>
            Hoş geldin Hakan Karadeniz, haftalık 5'li özel antrenman programın hazır.
          </Text>
        </View>

        {/* Smart Tempo & CSS Card */}
        <View style={styles.cssCard}>
          <View style={styles.cssLeftInfo}>
            <View style={styles.cssTitleRow}>
              <Ionicons name="flash" size={16} color={Colors.primary} />
              <Text style={styles.cssTitle}>Akıllı Tempo & CSS</Text>
            </View>
            <Text style={styles.cssSubText}>
              Taban 100m Tempon: <Text style={styles.yellowPaceText}>01:25</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.zonesBtn}
            onPress={() => Alert.alert('CSS Temponuz', 'Zon 1: 01:35 | Zon 2: 01:28 | Zon 3: 01:20')}
            activeOpacity={0.8}
          >
            <Text style={styles.zonesBtnText}>Zonları Gör</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Program Card List */}
        <View style={styles.programCard}>
          <Text style={styles.programCardHeader}>
            OPEN WATER DRAGOS - Haftalık 5'li Program
          </Text>

          <View style={styles.divider} />

          <View style={styles.programList}>
            {weeklyProgram.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.workoutRow,
                  item.isRest && styles.restRow
                ]}
                onPress={() => handleSelectWorkout(item)}
                disabled={item.isRest}
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />

                  <Text style={[styles.dayText, item.isRest && styles.restTextMuted]}>
                    {item.day}
                  </Text>

                  {item.isRest ? (
                    <Text style={styles.restTitle}>Rest Day</Text>
                  ) : (
                    <Text style={styles.workoutTitleText}>
                      {item.title} <Text style={styles.dotSeparator}>•</Text> {item.distanceKm} km
                    </Text>
                  )}
                </View>

                {/* Right Action Icons: Watch & PDF */}
                {!item.isRest && (
                  <TouchableOpacity 
                    style={styles.actionRow} 
                    onPress={(e) => handleOpenExport(item, e)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="watch-outline" size={17} color={Colors.primary} />
                    <MaterialCommunityIcons name="file-pdf-box" size={17} color={Colors.secondary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Export Modal */}
      <WorkoutExportModal
        workout={exportWorkout}
        visible={!!exportWorkout}
        onClose={() => setExportWorkout(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  waveIconOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A172E',
    marginBottom: Layout.spacing.md,
  },
  waveIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  cssCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cssLeftInfo: {
    flex: 1,
  },
  cssTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cssTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  cssSubText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  yellowPaceText: {
    color: Colors.primary,
    fontWeight: '800',
  },
  zonesBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zonesBtnText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  programCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  programCardHeader: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: Layout.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  programList: {
    gap: 4,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.sm,
  },
  restRow: {
    opacity: 0.5,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  dayText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    width: 42,
  },
  restTextMuted: {
    color: Colors.textMuted,
  },
  workoutTitleText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  dotSeparator: {
    color: Colors.textSecondary,
  },
  restTitle: {
    color: Colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 8,
  },
});
