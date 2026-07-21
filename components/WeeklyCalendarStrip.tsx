import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Layout } from '../constants/theme';

export interface DayItem {
  dayName: string;   // MON, TUE, etc.
  dayNum: number;    // 20, 21, etc.
  isCompleted?: boolean;
  isSelected?: boolean;
}

interface WeeklyCalendarStripProps {
  days?: DayItem[];
  onSelectDay?: (dayNum: number) => void;
}

export const DEFAULT_DAYS: DayItem[] = [
  { dayName: 'MON', dayNum: 20, isCompleted: true },
  { dayName: 'TUE', dayNum: 21, isCompleted: true },
  { dayName: 'WED', dayNum: 22 },
  { dayName: 'THU', dayNum: 23, isSelected: true },
  { dayName: 'FRI', dayNum: 24 },
  { dayName: 'SAT', dayNum: 25 },
  { dayName: 'SUN', dayNum: 26 },
];

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  days = DEFAULT_DAYS,
  onSelectDay
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stripRow}>
        {days.map((item) => {
          return (
            <TouchableOpacity
              key={item.dayNum}
              style={styles.dayColumn}
              onPress={() => onSelectDay && onSelectDay(item.dayNum)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayNameText,
                (item.isSelected || item.isCompleted) && styles.activeDayNameText
              ]}>
                {item.dayName}
              </Text>

              <View style={[
                styles.numCircle,
                item.isCompleted && styles.completedCircle,
                item.isSelected && styles.selectedCircle
              ]}>
                <Text style={[
                  styles.dayNumText,
                  item.isSelected && styles.selectedDayNumText
                ]}>
                  {item.dayNum}
                </Text>
              </View>

              {item.isCompleted && (
                <View style={styles.yellowUnderline} />
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
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.background,
  },
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayColumn: {
    alignItems: 'center',
    width: 44,
  },
  dayNameText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  activeDayNameText: {
    color: Colors.textPrimary,
  },
  numCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    borderWidth: 2,
    borderColor: Colors.primary, // Yellow ring
    backgroundColor: '#0F1A2E',
  },
  selectedCircle: {
    backgroundColor: Colors.secondary, // Bright Cyan fill
    borderColor: Colors.secondary,
  },
  dayNumText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  selectedDayNumText: {
    color: '#000000',
  },
  yellowUnderline: {
    height: 3,
    width: 16,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },
});
