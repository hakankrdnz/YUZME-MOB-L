import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderBarProps {
  userName?: string;
  subTitle?: string;
  streakCount?: number;
  onGetPro?: () => void;
  onSettings?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userName = 'Hakan Karadeniz',
  subTitle = 'OPEN WATER • DRAGOS',
  streakCount = 5,
  onGetPro,
  onSettings
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
      <View style={styles.userSection}>
        {/* Swimmer Avatar Icon with Glowing Gold Ring */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <MaterialCommunityIcons name="swim" size={22} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.userTextInfo}>
          <View style={styles.subTitleRow}>
            <Text style={styles.subTitleText}>
              <Text style={{ color: Colors.primary }}>OPEN WATER</Text>
              <Text style={{ color: Colors.secondary }}> • DRAGOS</Text>
            </Text>
          </View>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        {/* Streak Pill */}
        <View style={styles.streakPill}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakText}>{streakCount}d</Text>
        </View>

        <TouchableOpacity style={styles.getProBtn} onPress={onGetPro} activeOpacity={0.85}>
          <Ionicons name="sparkles" size={13} color="#000" style={{ marginRight: 4 }} />
          <Text style={styles.getProText}>PRO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsBtn} onPress={onSettings} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={19} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    backgroundColor: Colors.background,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Layout.shadows.glowYellow,
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#09152B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextInfo: {
    justifyContent: 'center',
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitleText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.9,
    marginBottom: 2,
  },
  userNameText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Layout.borderRadius.full,
    gap: 2,
  },
  streakFire: {
    fontSize: 12,
  },
  streakText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  getProBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    ...Layout.shadows.glowYellow,
  },
  getProText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

