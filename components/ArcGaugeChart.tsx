import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants/theme';

export interface PlanSegment {
  name: string;
  percentage: number;
  color: string;
}

export const DEFAULT_SEGMENTS: PlanSegment[] = [
  { name: 'Long Distance', percentage: 38, color: Colors.secondary },
  { name: 'Hybrid', percentage: 13, color: Colors.primary },
  { name: 'Interval Training', percentage: 26, color: Colors.accent },
  { name: 'Long Speed', percentage: 13, color: Colors.green },
  { name: 'Pure Speed', percentage: 10, color: Colors.red },
];

export const ArcGaugeChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>📊</Text>
          </View>
          <Text style={styles.headerTitle}>Plan Summary</Text>
        </View>
      </View>

      {/* Colorful Segmented Arc Gauge Bar */}
      <View style={styles.arcCard}>
        <View style={styles.multiTrack}>
          {DEFAULT_SEGMENTS.map((seg) => (
            <View 
              key={seg.name} 
              style={[
                styles.trackSegment, 
                { flex: seg.percentage, backgroundColor: seg.color }
              ]} 
            />
          ))}
        </View>

        <View style={styles.centerInfo}>
          <Text style={styles.planTitle}>Oceanman</Text>
          <Text style={styles.planSubtitle} numberOfLines={2}>
            Train to stay strong, confident, and efficient in open water. Our main focus will be to help you hold pace through waves...
          </Text>
        </View>
      </View>

      {/* Legend list */}
      <View style={styles.legendRow}>
        {DEFAULT_SEGMENTS.map((seg) => (
          <View key={seg.name} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendText}>
              {seg.name} <Text style={styles.percentText}>{seg.percentage}%</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  chartHeader: {
    marginBottom: Layout.spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  arcCard: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  multiTrack: {
    flexDirection: 'row',
    height: 12,
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    gap: 4,
    marginBottom: Layout.spacing.md,
  },
  trackSegment: {
    height: '100%',
    borderRadius: 4,
  },
  centerInfo: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
  },
  planTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  planSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: Layout.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  percentText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
