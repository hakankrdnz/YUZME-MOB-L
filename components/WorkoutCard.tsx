import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Workout } from '../types/swimming';
import { Colors, Layout } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onStart: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, onStart }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Başlangıç':
        return Colors.success;
      case 'Orta':
        return Colors.warning;
      case 'İleri':
        return Colors.accent;
      default:
        return Colors.primary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.tagsRow}>
          <View style={[styles.badge, { backgroundColor: getLevelColor(workout.level) + '25' }]}>
            <Ionicons name="ribbon-outline" size={12} color={getLevelColor(workout.level)} />
            <Text style={[styles.badgeText, { color: getLevelColor(workout.level) }]}>
              {workout.level}
            </Text>
          </View>

          <View style={styles.poolBadge}>
            <MaterialCommunityIcons name="waves" size={12} color={Colors.primaryLight} />
            <Text style={styles.poolBadgeText}>{workout.poolLength}m Havuz</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{workout.description}</Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.statsGroup}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Mesafe</Text>
            <Text style={styles.statValue}>{workout.totalDistance}m</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tahmini</Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={12} color={Colors.textSecondary} style={{ marginRight: 3 }} />
              <Text style={styles.statValue}>{workout.estimatedTimeMin} dk</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Set Sayısı</Text>
            <Text style={styles.statValue}>{workout.sets.length} Set</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startButton} 
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={16} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Başlat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  poolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
    gap: 4,
  },
  poolBadgeText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Layout.spacing.xs,
    marginBottom: 4,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Layout.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Layout.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.xs,
  },
  statsGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    justifyContent: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
