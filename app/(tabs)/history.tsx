import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { getWorkoutLogs } from '../../services/workoutService';
import { WorkoutLog } from '../../types/swimming';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
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
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="ribbon-outline" size={12} color={Colors.success} />
                <Text style={styles.badgeText}>Tamamlandı</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.workoutTitle}</Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons name="waves" size={14} color={Colors.primaryLight} />
                <Text style={styles.metricText}>{item.totalDistance} metre</Text>
              </View>

              <View style={styles.metricItem}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.metricText}>{item.durationMinutes} dakika</Text>
              </View>
            </View>

            {item.notes && (
              <Text style={styles.notesText}>Not: {item.notes}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="waves" size={48} color={Colors.textMuted} />
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Layout.spacing.md,
  },
  logCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Layout.spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 4,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  notesText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
