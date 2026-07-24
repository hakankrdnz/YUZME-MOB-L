import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Layout } from '../constants/theme';
import { WorkoutExportModal } from '../components/WorkoutExportModal';
import { RestTimer } from '../components/RestTimer';
import { REAL_SWIM_WORKOUTS, DetailedWorkoutSetItem, saveWorkoutLog } from '../services/workoutService';
import { Workout } from '../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title, type } = useLocalSearchParams<{ title?: string; type?: string }>();
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [activeRestSeconds, setActiveRestSeconds] = useState<number | null>(null);

  const workoutTitle = title || 'Interval Training';
  const matchedPlan = REAL_SWIM_WORKOUTS[workoutTitle] || REAL_SWIM_WORKOUTS['Interval Training'];
  const sampleSets: DetailedWorkoutSetItem[] = matchedPlan.sets;

  const getIntensityColor = (percent: number) => {
    if (percent <= 40) return Colors.secondary; 
    if (percent <= 60) return Colors.green; 
    if (percent <= 70) return Colors.primary; 
    if (percent <= 80) return Colors.warning; 
    if (percent <= 90) return Colors.accent; 
    return Colors.red; 
  };

  const sections: ('Warmup' | 'Preparation' | 'Main' | 'Cool Down')[] = [
    'Warmup',
    'Preparation',
    'Main',
    'Cool Down'
  ];

  const getSectionTurkishTitle = (sec: string) => {
    switch (sec) {
      case 'Warmup': return ' Isınma Bölümü';
      case 'Preparation': return ' Hazırlık & Teknik Sets';
      case 'Main': return '🔥 Ana Set';
      case 'Cool Down': return '❄️ Soğuma Bölümü';
      default: return sec;
    }
  };

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

  const handleFinishWorkout = async () => {
    await saveWorkoutLog({
      id: 'log-' + Date.now(),
      workoutId: matchedPlan.id,
      workoutTitle: matchedPlan.title,
      completedAt: new Date().toISOString(),
      durationMinutes: matchedPlan.estimatedTimeMin,
      totalDistance: matchedPlan.totalDistance,
      notes: 'Antrenman tamamlandı.'

    });

    Alert.alert('Tebrikler! 🏆', `${matchedPlan.totalDistance}m antrenmanı tamamlandı ve geçmişe kaydedildi!`, [
      { text: 'Ana Sayfaya Dön', onPress: () => router.push('/(tabs)') }
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* Top Bar Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <Text style={styles.badgeTitle}>{matchedPlan.title}</Text>
        </View>

        <TouchableOpacity 
          style={styles.exportHeaderBtn}
          onPress={() => setExportModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="file-pdf-box" size={20} color={Colors.secondary} />
          <Ionicons name="watch-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Training Summary Header Strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryMetric}>
          <Text style={styles.summaryLabel}>TOPLAM MESAFE</Text>
          <Text style={styles.summaryVal}>{(matchedPlan.totalDistance / 1000).toFixed(1)} km</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryMetric}>
          <Text style={styles.summaryLabel}>TAHMİNİ SÜRE</Text>
          <Text style={styles.summaryVal}>{matchedPlan.estimatedTimeMin} dk</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryMetric}>
          <Text style={styles.summaryLabel}>HAVUZ KULVARI</Text>
          <Text style={styles.summaryVal}>{matchedPlan.poolLength}m</Text>
        </View>
      </View>

      {/* Main Content List */}
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((sec) => {
          const secSets = sampleSets.filter(s => s.category === sec);
          if (secSets.length === 0) return null;

          return (
            <View key={sec} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{getSectionTurkishTitle(sec)}</Text>

              <View style={styles.setsList}>
                {secSets.map((item) => (
                  <View key={item.id} style={styles.setRow}>
                    <View style={styles.setRowLeft}>
                      {/* Intensity Color Bar */}
                      <View style={[styles.colorBar, { backgroundColor: getIntensityColor(item.intensityPercent) }]} />

                      <View style={styles.setTextCol}>
                        <View style={styles.repsRow}>
                          <Text style={styles.repsText}>
                            {item.reps > 1 ? `${item.reps} × ${item.distance}m` : `${item.distance}m`}
                          </Text>
                          <View style={[styles.intensityPill, { backgroundColor: getIntensityColor(item.intensityPercent) + '20' }]}>
                            <Text style={[styles.intensityPillText, { color: getIntensityColor(item.intensityPercent) }]}>
                              %{item.intensityPercent} Yoğunluk
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.strokeText} numberOfLines={2}>
                          {item.stroke}
                        </Text>
                      </View>
                    </View>

                    {/* Rest Timer Button */}
                    <TouchableOpacity 
                      style={styles.restTimerRight}
                      onPress={() => {
                        const secNum = parseInt(item.restTimeFormatted.split(':')[1] || '30');
                        setActiveRestSeconds(secNum);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="timer-outline" size={14} color={Colors.primary} />
                      <Text style={styles.restText}>{item.restTimeFormatted}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={handleFinishWorkout}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-done" size={20} color="#070C16" />
          <Text style={styles.finishBtnText}>ANTRENMANI TAMAMLADIM 🏆</Text>
        </TouchableOpacity>
      </View>

      {/* Rest Timer Modal Overlay */}
      {activeRestSeconds !== null && (
        <RestTimer
          initialSeconds={activeRestSeconds}
          onClose={() => setActiveRestSeconds(null)}
          onFinish={() => {
            setActiveRestSeconds(null);
            Alert.alert('Mola Bitti! 🏊', 'Bir sonraki sete hazırsın!');
          }}
        />
      )}

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
    paddingBottom: Layout.spacing.xs,
    backgroundColor: Colors.background,
  },
  backBtn: {
    padding: 6,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
  },
  badgeTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  exportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  summaryMetric: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryVal: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.borderGlass,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.xs,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Layout.spacing.md,
  },
  setsList: {
    gap: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  setRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  colorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  setTextCol: {
    flex: 1,
  },
  repsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  repsText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  intensityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
  },
  intensityPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  strokeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  restTimerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
  },
  restText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.spacing.md,
    paddingTop: 10,
    backgroundColor: Colors.background + 'EE',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Layout.borderRadius.full,
    gap: 8,
    ...Layout.shadows.glowYellow,
  },
  finishBtnText: {
    color: '#070C16',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

