import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Layout } from '../constants/theme';
import { WorkoutExportModal } from '../components/WorkoutExportModal';
import { REAL_SWIM_WORKOUTS, DetailedWorkoutSetItem } from '../services/workoutService';
import { Workout } from '../types/swimming';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title, type } = useLocalSearchParams<{ title?: string; type?: string }>();
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const workoutTitle = title || 'Interval Training';
  const matchedPlan = REAL_SWIM_WORKOUTS[workoutTitle] || REAL_SWIM_WORKOUTS['Interval Training'];

  const sampleSets: DetailedWorkoutSetItem[] = matchedPlan.sets;

  const getIntensityColor = (percent: number) => {
    if (percent <= 40) return '#E2E8F0'; // White / Light Grey
    if (percent <= 60) return '#3B82F6'; // Blue
    if (percent <= 70) return '#22C55E'; // Green
    if (percent <= 80) return '#FACC15'; // Yellow
    if (percent <= 90) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const sections: ('Warmup' | 'Preparation' | 'Main' | 'Cool Down')[] = [
    'Warmup',
    'Preparation',
    'Main',
    'Cool Down'
  ];

  const activeWorkoutObj: Workout = {
    id: matchedPlan.id,
    title: matchedPlan.title,
    level: matchedPlan.level as any,
    poolLength: matchedPlan.poolLength,
    totalDistance: matchedPlan.totalDistance,
    estimatedTimeMin: matchedPlan.estimatedTimeMin,
    description: matchedPlan.description,
    tags: ['Open Water', 'Swim Success'],
    sets: matchedPlan.sets.map(s => ({
      id: s.id,
      category: s.category === 'Warmup' ? 'Isınma' : s.category === 'Cool Down' ? 'Soğuma' : 'Ana Set',
      reps: s.reps,
      distance: s.distance,
      stroke: s.stroke as any,
      restSeconds: parseInt(s.restTimeFormatted.split(':')[1] || '30'),
      description: s.stroke
    }))
  };

  return (
    <View style={styles.screen}>
      {/* Top Bar Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <View style={styles.badgeIcon}>
            <Text style={styles.badgeIconText}>
              {matchedPlan.title.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.badgeTitle}>{matchedPlan.title}</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* Training Glossary Link */}
      <TouchableOpacity 
        style={styles.glossaryRow}
        onPress={() => Alert.alert('Training Glossary', 'Yüzme drilleri, hipoksik nefes ve tempo zonları rehberi.')}
      >
        <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.glossaryText}>Training Glossary</Text>
      </TouchableOpacity>

      {/* Main Content List */}
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {sections.map((sec) => {
          const secSets = sampleSets.filter(s => s.category === sec);
          if (secSets.length === 0) return null;

          return (
            <View key={sec} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{sec}</Text>

              <View style={styles.setsList}>
                {secSets.map((item) => (
                  <View key={item.id} style={styles.setRow}>
                    <View style={styles.setRowLeft}>
                      {/* Intensity Color Square */}
                      <View style={[styles.colorSquare, { backgroundColor: getIntensityColor(item.intensityPercent) }]} />

                      {/* Reps x Distance */}
                      <Text style={styles.repsText}>
                        {item.reps > 1 ? `${item.reps}×${item.distance}` : `${item.distance}`}
                      </Text>

                      {/* Stroke & Description */}
                      <Text style={styles.strokeText} numberOfLines={2}>
                        {item.stroke}
                      </Text>
                    </View>

                    {/* Rest Time */}
                    <View style={styles.restTimerRight}>
                      <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.restText}>{item.restTimeFormatted}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Button: Session Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.sessionActionsBtn}
          onPress={() => setExportModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.sessionActionsText}>Session Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Export Modal */}
      <WorkoutExportModal
        workout={activeWorkoutObj}
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  backBtn: {
    padding: 4,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#78350F',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    gap: 8,
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  badgeTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  glossaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    gap: 6,
  },
  glossaryText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Layout.spacing.md,
  },
  setsList: {
    gap: 14,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  colorSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  repsText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
    minWidth: 55,
  },
  strokeText: {
    color: Colors.textPrimary,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  restTimerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
  },
  restText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  sessionActionsBtn: {
    backgroundColor: Colors.textPrimary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: Layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sessionActionsText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});
