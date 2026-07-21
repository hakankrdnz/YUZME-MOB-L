import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { Workout } from '../types/swimming';
import { exportWorkoutToPDF } from '../services/pdfExportService';
import { exportWorkoutToGarmin } from '../services/garminExportService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface WorkoutExportModalProps {
  workout: Workout | null;
  visible: boolean;
  onClose: () => void;
}

export const WorkoutExportModal: React.FC<WorkoutExportModalProps> = ({
  workout,
  visible,
  onClose
}) => {
  if (!workout) return null;

  const handleGarminExport = async () => {
    onClose();
    await exportWorkoutToGarmin(workout);
  };

  const handlePDFExport = async () => {
    onClose();
    await exportWorkoutToPDF(workout);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subTitle}>ANTRENMAN DIŞA AKTAR</Text>
              <Text style={styles.title}>{workout.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBadge}>
            <Text style={styles.infoText}>
              {workout.totalDistance}m • {workout.poolLength}m Havuz • {workout.sets.length} Set
            </Text>
          </View>

          {/* Option 1: Garmin Watch Export */}
          <TouchableOpacity 
            style={[styles.exportCard, styles.garminCard]} 
            onPress={handleGarminExport}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconBox}>
              <Ionicons name="watch-outline" size={26} color={Colors.primary} />
            </View>

            <View style={styles.cardTextInfo}>
              <Text style={styles.cardTitle}>Garmin Saate Aktar</Text>
              <Text style={styles.cardDesc}>
                Garmin Connect / .FIT dosyası olarak saatinize yükleyin.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>

          {/* Option 2: PDF Print Sheet */}
          <TouchableOpacity 
            style={[styles.exportCard, styles.pdfCard]} 
            onPress={handlePDFExport}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#0284C720' }]}>
              <MaterialCommunityIcons name="file-pdf-box" size={26} color={Colors.secondary} />
            </View>

            <View style={styles.cardTextInfo}>
              <Text style={styles.cardTitle}>PDF / Havuz Kartı İndir</Text>
              <Text style={styles.cardDesc}>
                Büyük okunabilir puntoyla yazdırılabilir PDF havuz kartı.
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: Layout.spacing.md,
  },
  content: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  subTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.borderRadius.full,
  },
  infoBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Layout.spacing.lg,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  garminCard: {
    borderColor: Colors.primary,
  },
  pdfCard: {
    borderColor: Colors.secondary,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FACC1520',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextInfo: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
