import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface RestTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  onFinish?: () => void;
  onSkip?: () => void;
  onClose?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds,
  onComplete,
  onFinish,
  onSkip,
  onClose
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  const handleFinish = () => {
    if (onFinish) onFinish();
    if (onComplete) onComplete();
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (onSkip) onSkip();
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleFinish();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);


  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}:` : ''}${secs < 10 && mins > 0 ? '0' : ''}${secs}`;
  };

  const progressPercent = initialSeconds > 0 ? (timeLeft / initialSeconds) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="timer-outline" size={20} color={Colors.primary} />
        <Text style={styles.title}>Dinlenme Süresi</Text>
      </View>

      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <Text style={styles.subText}>saniye</Text>

      {/* Dynamic Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleTimer}>
          {isRunning ? (
            <>
              <Ionicons name="pause" size={18} color="#FFFFFF" />
              <Text style={styles.btnText}>Duraklat</Text>
            </>
          ) : (
            <>
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.btnText}>Devam Et</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, styles.skipBtn]} onPress={handleClose}>
          <Ionicons name="play-skip-forward" size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>Atla (Sonraki Set)</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginVertical: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    color: Colors.primaryLight,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerText: {
    color: Colors.textPrimary,
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: -4,
    marginBottom: Layout.spacing.md,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
    gap: 6,
  },
  skipBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
