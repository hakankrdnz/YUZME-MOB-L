import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { HeaderBar } from '../../components/HeaderBar';
import { WeeklyCalendarStrip } from '../../components/WeeklyCalendarStrip';
import { ArcGaugeChart } from '../../components/ArcGaugeChart';
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
  stroke: string;
  isRest?: boolean;
  isLightning?: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(23);
  const [activePoolType, setActivePoolType] = useState<'25m' | '50m' | 'OpenWater'>('50m');

  const [exportWorkout, setExportWorkout] = useState<Workout | null>(null);

  // Dynamic ISO week helper
  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const currentWeekNum = getWeekNumber(new Date());

  // Rotates through our 77+ preset workouts pool automatically each week
  const getWeeklyProgram = (): WeeklyWorkoutItem[] => {
    const pool = INITIAL_WORKOUTS;
    const offset = (currentWeekNum * 5) % pool.length;

    const w1 = pool[offset % pool.length];
    const w2 = pool[(offset + 1) % pool.length];
    const w3 = pool[(offset + 2) % pool.length];
    const w4 = pool[(offset + 3) % pool.length];
    const w5 = pool[(offset + 4) % pool.length];

    return [
      { id: '1', day: 'PZT', title: w1.title, distanceKm: parseFloat((w1.totalDistance / 1000).toFixed(1)), color: Colors.accent, stroke: w1.sets[0]?.stroke || 'Serbest + Drill', isLightning: true },
      { id: '2', day: 'SAL', title: w2.title, distanceKm: parseFloat((w2.totalDistance / 1000).toFixed(1)), color: Colors.secondary, stroke: w2.sets[0]?.stroke || 'Serbest Negatif Split', isLightning: true },
      { id: '3', day: 'ÇAR', title: w3.title, distanceKm: parseFloat((w3.totalDistance / 1000).toFixed(1)), color: Colors.purple, stroke: w3.sets[0]?.stroke || 'Hipoksik Nefes' },
      { id: '4', day: 'PER', title: w4.title, distanceKm: parseFloat((w4.totalDistance / 1000).toFixed(1)), color: Colors.green, stroke: w4.sets[0]?.stroke || 'Palet + Tahta' },
      { id: '5', day: 'CUM', title: 'Dinlenme Günü', distanceKm: 0, color: Colors.textMuted, stroke: '-', isRest: true },
      { id: '6', day: 'CMT', title: w5.title, distanceKm: parseFloat((w5.totalDistance / 1000).toFixed(1)), color: Colors.red, stroke: w5.sets[0]?.stroke || 'Depar + Sprint' },
      { id: '7', day: 'PAZ', title: 'Dinlenme Günü', distanceKm: 0, color: Colors.textMuted, stroke: '-', isRest: true },
    ];
  };

  const weeklyProgram = getWeeklyProgram();
  const totalWeeklyKm = weeklyProgram.reduce((sum, item) => sum + item.distanceKm, 0).toFixed(1);


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
        userName="Hakan Karadeniz"
        streakCount={5}
        onGetPro={() => Alert.alert('Pro Paket 👑', 'Yakında aktif olacağını bildirmek isteriz! Özel performans grafiklerine erişebileceksiniz.')}
        onSettings={() => Alert.alert('Ayarlar', 'Profil, Havuz Boyu (25m/50m) ve Garim Entegrasyonu ayarları')}
      />

      {/* Pool Type Quick Switcher */}
      <View style={styles.poolSwitchRow}>
        <TouchableOpacity 
          style={[styles.poolPill, activePoolType === '25m' && styles.poolPillActive]}
          onPress={() => setActivePoolType('25m')}
          activeOpacity={0.8}
        >
          <Text style={[styles.poolPillText, activePoolType === '25m' && styles.poolPillTextActive]}>🏊 25m Havuz</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.poolPill, activePoolType === '50m' && styles.poolPillActive]}
          onPress={() => setActivePoolType('50m')}
          activeOpacity={0.8}
        >
          <Text style={[styles.poolPillText, activePoolType === '50m' && styles.poolPillTextActive]}>🏊‍♀️ 50m Olimpik</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.poolPill, activePoolType === 'OpenWater' && styles.poolPillActive]}
          onPress={() => setActivePoolType('OpenWater')}
          activeOpacity={0.8}
        >
          <Text style={[styles.poolPillText, activePoolType === 'OpenWater' && styles.poolPillTextActive]}>🌊 Açık Su</Text>
        </TouchableOpacity>
      </View>

      <WeeklyCalendarStrip 
        selectedDay={selectedDay}
        onSelectDay={(num) => setSelectedDay(num)}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Welcome Hero Card */}
        <View style={styles.bannerCard}>
          <View style={styles.waveIconOuter}>
            <View style={styles.waveIconInner}>
              <MaterialCommunityIcons name="waves" size={30} color={Colors.secondary} />
            </View>
          </View>

          <View style={styles.bannerTextCol}>
            <View style={styles.bannerBadgeRow}>
              <Text style={styles.bannerBadge}>OPEN WATER DRAGOS</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={styles.bannerTitle}>Bugünkü Hedef Antrenmanın</Text>
            <Text style={styles.bannerSubtitle}>
              Haftalık 5'li özel antrenman programın hazır. Bugünün antrenmanı: <Text style={{ color: Colors.primary, fontWeight: '800' }}>Long Speed (2.9 km)</Text>
            </Text>

            <TouchableOpacity 
              style={styles.heroStartBtn}
              onPress={() => router.push({ pathname: '/workout-detail', params: { title: 'Long Speed', type: 'Long Speed' } })}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={16} color="#070C16" />
              <Text style={styles.heroStartBtnText}>CANLI MODDA BAŞLAT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan Summary Chart Component */}
        <ArcGaugeChart />

        {/* Smart Tempo & CSS Card */}
        <View style={styles.cssCard}>
          <View style={styles.cssHeaderRow}>
            <View style={styles.cssLeftInfo}>
              <View style={styles.cssTitleRow}>
                <Ionicons name="flash" size={16} color={Colors.primary} />
                <Text style={styles.cssTitle}>Akıllı Tempo & CSS</Text>
              </View>
              <Text style={styles.cssSubText}>
                Kritik Yüzme Hızı (CSS): <Text style={styles.yellowPaceText}>01:25 / 100m</Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.zonesBtn}
              onPress={() => Alert.alert('CSS Nabız Zonları', 'Zon 1 Toparlanma: 01:35\nZon 2 Aerobik: 01:28\nZon 3 CSS Temposu: 01:25\nZon 4 Anaerobik Sprint: 01:18')}
              activeOpacity={0.8}
            >
              <Text style={styles.zonesBtnText}>Zonları Gör</Text>
            </TouchableOpacity>
          </View>

          {/* Zones Visual Bar */}
          <View style={styles.zonesTrack}>
            <View style={[styles.zoneBar, { flex: 2, backgroundColor: Colors.secondary }]} />
            <View style={[styles.zoneBar, { flex: 3, backgroundColor: Colors.green }]} />
            <View style={[styles.zoneBar, { flex: 3, backgroundColor: Colors.primary }]} />
            <View style={[styles.zoneBar, { flex: 2, backgroundColor: Colors.red }]} />
          </View>

          <View style={styles.zoneLabelsRow}>
            <Text style={styles.zoneLabel}>Z1 Toparlanma</Text>
            <Text style={styles.zoneLabel}>Z2 Aerobik</Text>
            <Text style={[styles.zoneLabel, { color: Colors.primary }]}>Z3 CSS Pace</Text>
            <Text style={styles.zoneLabel}>Z4 Depar</Text>
          </View>
        </View>

        {/* Weekly Program Card List */}
        <View style={styles.programCard}>
          <View style={styles.programCardTop}>
            <Text style={styles.programCardHeader}>
              HAFTALIK PROGRAM AKIŞI
            </Text>
            <Text style={styles.programKmBadge}>{currentWeekNum}. HAFTA • {totalWeeklyKm} km</Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.programList}>
            {weeklyProgram.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.workoutRow,
                  item.isRest && styles.restRow
                ]}
              >
                <TouchableOpacity 
                  style={styles.rowLeft}
                  onPress={() => handleSelectWorkout(item)}
                  disabled={item.isRest}
                  activeOpacity={0.7}
                >
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />

                  <Text style={[styles.dayText, item.isRest && styles.restTextMuted]}>
                    {item.day}
                  </Text>

                  {item.isRest ? (
                    <Text style={styles.restTitle}>Dinlenme Günü 💤</Text>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workoutTitleText} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.workoutSubText}>
                        {item.stroke} • <Text style={{ color: Colors.secondary, fontWeight: '700' }}>{item.distanceKm} km</Text>
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Right Action Icons: Start & Export */}
                {!item.isRest && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={styles.iconBtn} 
                      onPress={() => handleOpenExport(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="file-pdf-box" size={22} color={Colors.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.playMiniBtn} 
                      onPress={() => handleSelectWorkout(item)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="play" size={13} color="#070C16" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
  poolSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    gap: 8,
  },
  poolPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  poolPillActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.secondary,
  },
  poolPillText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  poolPillTextActive: {
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
  bannerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginBottom: Layout.spacing.md,
    gap: 14,
    ...Layout.shadows.card,
  },
  waveIconOuter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    ...Layout.shadows.glowCyan,
  },
  waveIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  bannerBadge: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  heroStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
    alignSelf: 'flex-start',
    ...Layout.shadows.glowYellow,
  },
  heroStartBtnText: {
    color: '#070C16',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cssCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  cssHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cssLeftInfo: {
    flex: 1,
  },
  cssTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
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
    fontWeight: '900',
  },
  zonesBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  zonesBtnText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  zonesTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 3,
    marginBottom: 6,
  },
  zoneBar: {
    height: '100%',
    borderRadius: 2,
  },
  zoneLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoneLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  programCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  programCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  programCardHeader: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  programKmBadge: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginBottom: Layout.spacing.xs,
  },
  programList: {
    gap: 6,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceLight + '40',
  },
  restRow: {
    opacity: 0.4,
    backgroundColor: 'transparent',
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
    fontSize: 12,
    fontWeight: '900',
    width: 38,
  },
  restTextMuted: {
    color: Colors.textMuted,
  },
  workoutTitleText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  workoutSubText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  restTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  iconBtn: {
    padding: 4,
  },
  playMiniBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.glowYellow,
  },
});

