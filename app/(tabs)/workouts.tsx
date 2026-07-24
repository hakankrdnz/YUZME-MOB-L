import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { WorkoutExportModal } from '../../components/WorkoutExportModal';
import { INITIAL_WORKOUTS } from '../../services/workoutService';
import { Workout } from '../../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type FilterCategory = 'Tümü' | '25m Havuz' | '50m Havuz' | 'Açık Su' | 'Başlangıç' | 'İleri';

export default function TrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Tümü');
  const [exportWorkout, setExportWorkout] = useState<Workout | null>(null);

  const filters: FilterCategory[] = ['Tümü', '25m Havuz', '50m Havuz', 'Açık Su', 'Başlangıç', 'İleri'];

  const filteredWorkouts = INITIAL_WORKOUTS.filter(w => {
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === '25m Havuz') return w.poolLength === 25;
    if (activeFilter === '50m Havuz') return w.poolLength === 50;
    if (activeFilter === 'Açık Su') return w.title.toLowerCase().includes('marathon') || w.title.toLowerCase().includes('swimathon');
    if (activeFilter === 'Başlangıç') return (w.level as string) === 'Başlangıç' || (w.level as string) === 'Intermediate Level';
    if (activeFilter === 'İleri') return (w.level as string) === 'İleri' || (w.level as string) === 'Advanced Level';
    return true;
  });


  const handleSelectWorkout = (workout: Workout) => {
    router.push({
      pathname: '/workout-detail',
      params: { title: workout.title, type: workout.title }
    });
  };

  const handleOpenExport = (workout: Workout, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setExportWorkout(workout);
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="swim" size={24} color={Colors.primary} />
          <Text style={styles.pageTitle}>Antrenman Kütüphanesi</Text>
        </View>

        <TouchableOpacity 
          style={styles.getProPill} 
          onPress={() => Alert.alert('Pro Paket 👑', 'Yakında aktif olacağını bildirmek isteriz.')}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={12} color="#070C16" style={{ marginRight: 3 }} />
          <Text style={styles.getProText}>PRO</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.chip,
                activeFilter === filter && styles.chipActive
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.chipText,
                activeFilter === filter && styles.chipTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Count Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            Program Listesi <Text style={{ color: Colors.secondary }}>({filteredWorkouts.length})</Text>
          </Text>
          <Text style={styles.listSubText}>Resmi 10-Haftalık & Seviye Antrenmanları</Text>
        </View>

        {/* Workouts Grid / Cards List */}
        <View style={styles.workoutListGroup}>
          {filteredWorkouts.map((workout) => (
            <View
              key={workout.id}
              style={styles.workoutCard}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.badgesRow}>
                  <View style={[
                    styles.levelBadge,
                    { backgroundColor: (workout.level as string).includes('Advanced') || (workout.level as string) === 'İleri' ? Colors.accent + '20' : Colors.secondary + '20' }
                  ]}>
                    <Text style={[
                      styles.levelBadgeText,
                      { color: (workout.level as string).includes('Advanced') || (workout.level as string) === 'İleri' ? Colors.accent : Colors.secondary }
                    ]}>
                      {workout.level}
                    </Text>
                  </View>

                  <View style={styles.poolBadge}>
                    <Text style={styles.poolBadgeText}>🏊 {workout.poolLength}m</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.exportBtn}
                  onPress={() => handleOpenExport(workout)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="file-pdf-box" size={22} color={Colors.secondary} />
                  <Ionicons name="watch-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => handleSelectWorkout(workout)} activeOpacity={0.85}>
                <Text style={styles.cardTitle}>{workout.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{workout.description}</Text>

                {/* Set Category Visual Progress Bar */}
                <View style={styles.cardSetTrack}>
                  <View style={[styles.setSegment, { flex: 2, backgroundColor: Colors.secondary }]} />
                  <View style={[styles.setSegment, { flex: 3, backgroundColor: Colors.primary }]} />
                  <View style={[styles.setSegment, { flex: 5, backgroundColor: Colors.accent }]} />
                  <View style={[styles.setSegment, { flex: 2, backgroundColor: Colors.green }]} />
                </View>
              </TouchableOpacity>

              <View style={styles.cardFooter}>
                <View style={styles.cardStat}>
                  <Text style={styles.statLabel}>Mesafe</Text>
                  <Text style={styles.statValue}>{(workout.totalDistance / 1000).toFixed(1)} km</Text>
                </View>

                <View style={styles.cardStat}>
                  <Text style={styles.statLabel}>Tahmini</Text>
                  <Text style={styles.statValue}>{workout.estimatedTimeMin} dk</Text>
                </View>

                <View style={styles.cardStat}>
                  <Text style={styles.statLabel}>Set Sayısı</Text>
                  <Text style={styles.statValue}>{workout.sets.length} Set</Text>
                </View>

                <TouchableOpacity 
                  style={styles.cardStartBtn}
                  onPress={() => handleSelectWorkout(workout)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play" size={14} color="#070C16" />
                  <Text style={styles.cardStartBtnText}>Başlat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

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
    paddingBottom: Layout.spacing.xs,
    backgroundColor: Colors.background,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  getProPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadows.glowYellow,
  },
  getProText: {
    color: '#070C16',
    fontSize: 11,
    fontWeight: '900',
  },
  filterBar: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  filterContent: {
    paddingHorizontal: Layout.spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  chipActive: {
    backgroundColor: Colors.secondary + '20',
    borderColor: Colors.secondary,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: Colors.secondary,
    fontWeight: '900',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
    paddingBottom: 40,
  },
  listHeaderRow: {
    marginBottom: Layout.spacing.sm,
  },
  listHeaderTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  listSubText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  workoutListGroup: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.sm,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  poolBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.sm,
  },
  poolBadgeText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  cardSetTrack: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    gap: 2,
    marginBottom: 12,
  },
  setSegment: {
    height: '100%',
    borderRadius: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  cardStat: {
    justifyContent: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1,
  },
  cardStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.borderRadius.md,
    gap: 4,
    ...Layout.shadows.glowYellow,
  },
  cardStartBtnText: {
    color: '#070C16',
    fontSize: 12,
    fontWeight: '900',
  },
});

