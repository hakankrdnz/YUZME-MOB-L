import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface DayItem {
  dayName: string;   // MON, TUE, etc.
  dayNum: number;    // 20, 21, etc.
  isCompleted?: boolean;
  isSelected?: boolean;
}

interface WeeklyCalendarStripProps {
  days?: DayItem[];
  selectedDay?: number;
  onSelectDay?: (dayNum: number) => void;
}

export const DEFAULT_DAYS: DayItem[] = [
  { dayName: 'PZT', dayNum: 20, isCompleted: true },
  { dayName: 'SAL', dayNum: 21, isCompleted: true },
  { dayName: 'ÇAR', dayNum: 22, isCompleted: true },
  { dayName: 'PER', dayNum: 23, isSelected: true },
  { dayName: 'CUM', dayNum: 24 },
  { dayName: 'CMT', dayNum: 25 },
  { dayName: 'PAZ', dayNum: 26 },
];

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  days = DEFAULT_DAYS,
  selectedDay = 23,
  onSelectDay
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stripRow}>
        {days.map((item) => {
          const isSelected = item.isSelected || item.dayNum === selectedDay;
          const isCompleted = item.isCompleted;

          return (
            <TouchableOpacity
              key={item.dayNum}
              style={[
                styles.dayColumn,
                isSelected && styles.selectedColumn
              ]}
              onPress={() => onSelectDay && onSelectDay(item.dayNum)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayNameText,
                isSelected && styles.selectedDayNameText,
                isCompleted && !isSelected && styles.completedDayNameText
              ]}>
                {item.dayName}
              </Text>

              <View style={[
                styles.numCircle,
                isCompleted && styles.completedCircle,
                isSelected && styles.selectedCircle
              ]}>
                {isCompleted && !isSelected ? (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                ) : (
                  <Text style={[
                    styles.dayNumText,
                    isSelected && styles.selectedDayNumText
                  ]}>
                    {item.dayNum}
                  </Text>
                )}
              </View>

              {isCompleted && (
                <View style={styles.yellowDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    backgroundColor: Colors.background,
  },
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  dayColumn: {
    alignItems: 'center',
    width: 42,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.md,
  },
  selectedColumn: {
    backgroundColor: Colors.surfaceLight,
  },
  dayNameText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  completedDayNameText: {
    color: Colors.textSecondary,
  },
  selectedDayNameText: {
    color: Colors.secondary,
  },
  numCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
  },
  selectedCircle: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    ...Layout.shadows.glowCyan,
  },
  dayNumText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  selectedDayNumText: {
    color: '#070C16',
    fontWeight: '900',
  },
  yellowDot: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
});

