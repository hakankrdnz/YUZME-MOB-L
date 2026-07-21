import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutSet } from '../types/swimming';
import { Colors, Layout } from '../constants/theme';

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  isActive?: boolean;
}

export const SetRow: React.FC<SetRowProps> = ({ set, index, isActive }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Isınma':
        return '#3B82F6';
      case 'Ana Set':
        return Colors.primary;
      case 'Ara Set':
        return '#8B5CF6';
      case 'Soğuma':
        return '#10B981';
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(set.category) }]}>
        <Text style={styles.categoryText}>{set.category}</Text>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.setText}>
          <Text style={styles.repsText}>{set.reps}x </Text>
          <Text style={styles.distanceText}>{set.distance}m </Text>
          <Text style={styles.strokeText}>{set.stroke}</Text>
        </Text>
        {set.description && (
          <Text style={styles.descriptionText}>{set.description}</Text>
        )}
      </View>

      <View style={styles.metaInfo}>
        <Text style={styles.totalDist}>{set.reps * set.distance}m</Text>
        {set.restSeconds > 0 && (
          <Text style={styles.restText}>⏱ {set.restSeconds}s dinlenme</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeContainer: {
    borderColor: Colors.primary,
    backgroundColor: '#1E2C52',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  mainInfo: {
    flex: 1,
  },
  setText: {
    fontSize: 15,
  },
  repsText: {
    color: Colors.accent,
    fontWeight: '700',
  },
  distanceText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  strokeText: {
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  descriptionText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  metaInfo: {
    alignItems: 'flex-end',
  },
  totalDist: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  restText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
