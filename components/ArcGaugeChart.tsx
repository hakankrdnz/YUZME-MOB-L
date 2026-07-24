import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface PlanSegment {
  name: string;
  percentage: number;
  color: string;
}

export const DEFAULT_SEGMENTS: PlanSegment[] = [
  { name: 'Uzun Mesafe', percentage: 38, color: Colors.secondary },
  { name: 'Interval', percentage: 26, color: Colors.accent },
  { name: 'Hibrit', percentage: 13, color: Colors.primary },
  { name: 'Uzun Hız', percentage: 13, color: Colors.green },
  { name: 'Saf Hız', percentage: 10, color: Colors.red },
];

export const ArcGaugeChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <Ionicons name="pie-chart" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Plan Özeti</Text>
        </View>

        <View style={styles.targetBadge}>
          <Text style={styles.targetBadgeText}>Haftalık 13.1 km</Text>
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
          <Text style={styles.planTitle}>Oceanman & Open Water</Text>
          <Text style={styles.planSubtitle} numberOfLines={2}>
            Dalga, akıntı ve yön bulma odaklı açık su ve kulvar dayanıklılık programı.
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
    borderColor: Colors.borderGlass,
    marginBottom: Layout.spacing.md,
    ...Layout.shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  targetBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: Colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  targetBadgeText: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  arcCard: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
  },
  multiTrack: {
    flexDirection: 'row',
    height: 10,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    gap: 3,
    marginBottom: Layout.spacing.sm,
  },
  trackSegment: {
    height: '100%',
    borderRadius: 3,
  },
  centerInfo: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    marginBottom: 4,
  },
  planTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
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
    marginTop: Layout.spacing.xs,
    paddingTop: Layout.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  percentText: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
});

