import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { ArcGaugeChart } from '../../components/ArcGaugeChart';
import { WorkoutExportModal } from '../../components/WorkoutExportModal';
import { INITIAL_WORKOUTS } from '../../services/workoutService';
import { Workout } from '../../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [exportWorkout, setExportWorkout] = useState<Workout | null>(null);

  const currentWeekWorkouts = [
    { day: 'MON', title: 'Interval Training', dist: '2.4 km', color: Colors.accent },
    { day: 'WED', title: 'Long Distance', dist: '3 km', color: Colors.secondary },
    { day: 'FRI', title: 'Long Speed', dist: '2.8 km', color: Colors.green },
    { day: 'SAT', title: 'Long Distance', dist: '2.5 km', color: Colors.secondary },
    { day: 'SUN', title: 'Interval Training', dist: '2.4 km', color: Colors.accent },
  ];

  const handleSelectWorkout = (item: { day: string; title: string; dist: string }) => {
    router.push({
      pathname: '/workout-detail',
      params: { title: item.title, type: item.title }
    });
  };

  const handleOpenExport = (title: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const matched = INITIAL_WORKOUTS.find(w => w.title.toLowerCase().includes(title.toLowerCase())) || INITIAL_WORKOUTS[0];
    setExportWorkout(matched);
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
        <View style={styles.avatarMini}>
          <Text style={{ fontSize: 16 }}>🐤</Text>
        </View>

        <Text style={styles.pageTitle}>Training</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.getProPill} onPress={() => Alert.alert('Pro Paket', 'Yakında aktif olacağını bildirmek isteriz.')}>
            <Text style={styles.getProText}>Get Pro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-menu Links */}
      <View style={styles.subLinksRow}>
        <TouchableOpacity style={styles.subLinkItem}>
          <Text style={styles.subLinkText}>Session History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subLinkItem}>
          <Text style={styles.subLinkText}>Rearrange Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subLinkItem}>
          <Text style={styles.subLinkText}>Connected Apps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subLinkItem}>
          <Text style={styles.subLinkText}>Manage Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Arc Gauge Plan Summary Card */}
        <ArcGaugeChart />

        {/* Current Week Plan Card */}
        <View style={styles.currentWeekCard}>
          <Text style={styles.weekDateSub}>WEEK 8 : 18 MAY - 24 MAY</Text>
          <Text style={styles.currentWeekTitle}>Current Week</Text>

          {/* 5-Segment Progress Bar */}
          <View style={styles.segmentTrack}>
            <View style={[styles.segment, { backgroundColor: Colors.secondary }]} />
            <View style={[styles.segment, { backgroundColor: Colors.primary }]} />
            <View style={[styles.segment, { backgroundColor: Colors.accent }]} />
            <View style={[styles.segment, { backgroundColor: Colors.green }]} />
            <View style={[styles.segment, { backgroundColor: Colors.red }]} />
          </View>

          <View style={styles.weekStatsRow}>
            <Text style={styles.weekStatText}>Total Sessions: <Text style={styles.boldVal}>5</Text></Text>
            <Text style={styles.weekStatText}>Distance: <Text style={styles.boldVal}>13.1 km</Text></Text>
          </View>

          <View style={styles.divider} />

          {/* List of Workouts for Current Week */}
          <View style={styles.listGroup}>
            {currentWeekWorkouts.map((w, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.weekWorkoutRow}
                onPress={() => handleSelectWorkout(w)}
                activeOpacity={0.8}
              >
                <View style={[styles.colorSquare, { backgroundColor: w.color + '40' }]}>
                  <View style={[styles.innerSquare, { backgroundColor: w.color }]} />
                </View>

                <Text style={styles.dayTag}>{w.day}</Text>
                
                <Text style={styles.workoutInfoText}>
                  {w.title} <Text style={styles.dot}>•</Text> {w.dist}
                </Text>

                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={(e) => handleOpenExport(w.title, e)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="watch-outline" size={17} color={Colors.primary} />
                  <MaterialCommunityIcons name="file-pdf-box" size={17} color={Colors.secondary} />
                </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.background,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  getProPill: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Layout.borderRadius.full,
  },
  getProText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  bellBtn: {
    padding: 6,
  },
  subLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subLinkItem: {
    paddingVertical: 4,
  },
  subLinkText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
    paddingBottom: 40,
  },
  currentWeekCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekDateSub: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  currentWeekTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: Layout.spacing.sm,
  },
  segmentTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 4,
    marginBottom: Layout.spacing.sm,
  },
  segment: {
    flex: 1,
  },
  weekStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  weekStatText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  boldVal: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  listGroup: {
    gap: 6,
  },
  weekWorkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.sm,
  },
  colorSquare: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  innerSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  dayTag: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    width: 38,
  },
  workoutInfoText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  dot: {
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
