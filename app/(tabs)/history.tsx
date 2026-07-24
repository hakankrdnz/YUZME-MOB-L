import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { getWorkoutLogs } from '../../services/workoutService';
import { WorkoutLog } from '../../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  const fetchLogs = async () => {
    const list = await getWorkoutLogs();
    setLogs(list);
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  const totalDistanceKm = (logs.reduce((sum, l) => sum + l.totalDistance, 0) / 1000).toFixed(1);
  const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="stats-chart" size={22} color={Colors.primary} />
          <Text style={styles.pageTitle}>Geçmiş & İstatistikler</Text>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{logs.length} Seans</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* PR & Summary Stats Widgets */}
            <View style={styles.statsGrid}>
              <View style={styles.statWidget}>
                <View style={styles.statWidgetTop}>
                  <MaterialCommunityIcons name="waves" size={18} color={Colors.secondary} />
                  <Text style={styles.widgetLabel}>Toplam Mesafe</Text>
                </View>
                <Text style={styles.widgetValue}>{totalDistanceKm} <Text style={styles.unitText}>km</Text></Text>
              </View>

              <View style={styles.statWidget}>
                <View style={styles.statWidgetTop}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                  <Text style={styles.widgetLabel}>Toplam Süre</Text>
                </View>
                <Text style={styles.widgetValue}>{totalMinutes} <Text style={styles.unitText}>dk</Text></Text>
              </View>
            </View>

            {/* Sub-Header */}
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>TAMAMLATAN SEANSLAR</Text>
              <Text style={styles.timelineCount}>{logs.length} Antrenman</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.green} />
                <Text style={styles.badgeText}>Tamamlandı</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.workoutTitle}</Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="waves" size={14} color={Colors.secondary} />
                <Text style={styles.metricText}>{(item.totalDistance / 1000).toFixed(1)} km ({item.totalDistance}m)</Text>
              </View>

              <View style={styles.metricItem}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.metricText}>{item.durationMinutes} dakika</Text>
              </View>
            </View>

            {item.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>💬 {item.notes}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyWaveCircle}>
              <MaterialCommunityIcons name="waves" size={40} color={Colors.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Henüz Tamamlanan Antrenman Yok</Text>
            <Text style={styles.emptySub}>
              Antrenman kütüphanesinden bir program seçip "Başlat" butonuna tıklayarak ilk havuz antrenmanınızı kaydedin!
            </Text>
          </View>
        }
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
  totalBadge: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  totalBadgeText: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  listContent: {
    padding: Layout.spacing.md,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: Layout.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Layout.spacing.md,
  },
  statWidget: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  statWidgetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  widgetLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  widgetValue: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  unitText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timelineTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  timelineCount: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  logCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: Colors.green,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.borderRadius.full,
    gap: 4,
  },
  badgeText: {
    color: Colors.green,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  notesBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  notesText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyWaveCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Layout.shadows.glowCyan,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
