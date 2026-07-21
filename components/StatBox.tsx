import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants/theme';

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  unit,
  icon,
  color = Colors.primary
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Layout.spacing.sm,
  },
  content: {
    flex: 1,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  unit: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
});
