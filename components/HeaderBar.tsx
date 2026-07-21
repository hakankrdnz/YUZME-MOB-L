import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderBarProps {
  userName?: string;
  subTitle?: string;
  onGetPro?: () => void;
  onSettings?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userName = 'Hakan Karadeniz',
  subTitle = 'OPEN WATER • DRAGOS',
  onGetPro,
  onSettings
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
      <View style={styles.userSection}>
        {/* Swimmer Avatar Icon with Yellow Ring */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <MaterialCommunityIcons name="swim" size={20} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.userTextInfo}>
          <Text style={styles.subTitleText}>
            <Text style={{ color: Colors.primary }}>OPEN WATER</Text>
            <Text style={{ color: Colors.secondary }}> • DRAGOS</Text>
          </Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.getProBtn} onPress={onGetPro} activeOpacity={0.8}>
          <Text style={styles.getProText}>Get Pro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsBtn} onPress={onSettings} activeOpacity={0.8}>
          <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
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
  subTitleText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
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
    gap: 10,
  },
  getProBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Layout.borderRadius.full,
  },
  getProText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
