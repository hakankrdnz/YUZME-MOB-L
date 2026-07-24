import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { StrokeType, WorkoutSet, Workout } from '../../types/swimming';
import { saveCustomWorkout } from '../../services/workoutService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BuilderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poolLength, setPoolLength] = useState<25 | 50>(25);
  const [sets, setSets] = useState<WorkoutSet[]>([
    {
      id: 'set-1',
      category: 'Isınma',
      reps: 1,
      distance: 300,
      stroke: 'Serbest',
      restSeconds: 30,
      description: 'Rahat tempo ısınma'
    },
    {
      id: 'set-2',
      category: 'Ana Set',
      reps: 6,
      distance: 100,
      stroke: 'Serbest',
      restSeconds: 20,
      description: '%80 CSS temposu'
    },
    {
      id: 'set-3',
      category: 'Soğuma',
      reps: 1,
      distance: 200,
      stroke: 'Karışık (IM)',
      restSeconds: 30,
      description: 'Gevşeme yüzüşü'
    }
  ]);

  const strokeOptions: StrokeType[] = [
    'Serbest',
    'Sırtüstü',
    'Kurbağalama',
    'Kelebek',
    'Karışık (IM)',
    'Ayak (Drill)'
  ];

  const categoryOptions: ('Isınma' | 'Ana Set' | 'Ara Set' | 'Soğuma')[] = [
    'Isınma',
    'Ana Set',
    'Ara Set',
    'Soğuma'
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Isınma': return Colors.secondary;
      case 'Ana Set': return Colors.accent;
      case 'Ara Set': return Colors.primary;
      case 'Soğuma': return Colors.green;
      default: return Colors.primary;
    }
  };

  const addSet = () => {
    const newSet: WorkoutSet = {
      id: 'set-' + (sets.length + 1) + '-' + Date.now(),
      category: 'Ana Set',
      reps: 4,
      distance: 50,
      stroke: 'Serbest',
      restSeconds: 20,
    };
    setSets([...sets, newSet]);
  };

  const removeSet = (id: string) => {
    if (sets.length === 1) {
      Alert.alert('Uyarı', 'Antrenmanda en az 1 set olmalıdır.');
      return;
    }
    setSets(sets.filter(s => s.id !== id));
  };

  const updateSet = (id: string, key: keyof WorkoutSet, value: any) => {
    setSets(sets.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const totalDistance = sets.reduce((sum, s) => sum + (s.reps * s.distance), 0);
  const estimatedTimeMin = Math.ceil(totalDistance / 40); // Tahmini süre

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen antrenman için bir başlık yazın.');
      return;
    }

    const newWorkout: Workout = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      level: 'Orta',
      poolLength,
      totalDistance,
      estimatedTimeMin,
      description: description.trim() || 'Özel tasarlanmış yüzme antrenmanı.',
      sets,
      tags: ['Özel']
    };

    await saveCustomWorkout(newWorkout);
    Alert.alert('Başarılı! 🎉', 'Özel antrenmanınız kütüphaneye kaydedildi.', [
      {
        text: 'Antrenmanlara Git',
        onPress: () => {
          setTitle('');
          setDescription('');
          router.push('/workouts');
        }
      }
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="create-outline" size={24} color={Colors.primary} />
          <Text style={styles.pageTitle}>Antrenman Oluşturucu</Text>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={() => setSets([])}>
          <Text style={styles.resetBtnText}>Temizle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Total Distance Summary Header Card */}
        <View style={styles.liveSummaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summarySubtitle}>ÖZEL TASARIM</Text>
            <Text style={styles.summaryTitle}>{title || 'Yeni Antrenman Planı'}</Text>
          </View>

          <View style={styles.summaryRight}>
            <View style={styles.distBadge}>
              <Text style={styles.distBadgeText}>{(totalDistance / 1000).toFixed(2)} km</Text>
            </View>
            <Text style={styles.timeBadgeText}>~{estimatedTimeMin} dakika</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Antrenman Detayları</Text>
        
        {/* Title input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Antrenman Adı *</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Cuma Sabahı 1500m Kardiyo"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama / Antrenman Amacı</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Örn: Tekniği koruyarak %80 tempoda tamamla"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Pool Length Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Havuz Kulvar Boyu</Text>
          <View style={styles.poolRow}>
            {[25, 50].map((len) => (
              <TouchableOpacity
                key={len}
                style={[styles.poolChip, poolLength === len && styles.activePoolChip]}
                onPress={() => setPoolLength(len as 25 | 50)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="waves" size={16} color={poolLength === len ? '#070C16' : Colors.textSecondary} />
                <Text style={[styles.poolChipText, poolLength === len && styles.activePoolChipText]}>
                  {len}m Havuz
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Set List Header */}
        <View style={styles.setsHeader}>
          <Text style={styles.sectionTitle}>Set Yapılandırması ({sets.length} Set)</Text>
        </View>

        {/* Dynamic Set Items */}
        {sets.map((set, idx) => (
          <View key={set.id} style={styles.setCard}>
            <View style={styles.setCardHeader}>
              <View style={styles.setNumberRow}>
                <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(set.category) }]} />
                <Text style={styles.setCardNum}>Set #{idx + 1}</Text>
              </View>

              <TouchableOpacity onPress={() => removeSet(set.id)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={18} color={Colors.red} />
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <Text style={styles.miniLabel}>Kategori</Text>
            <View style={styles.optionsRow}>
              {categoryOptions.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.miniChip, 
                    set.category === cat && { backgroundColor: getCategoryColor(cat) + '25', borderColor: getCategoryColor(cat) }
                  ]}
                  onPress={() => updateSet(set.id, 'category', cat)}
                >
                  <Text style={[
                    styles.miniChipText, 
                    set.category === cat && { color: getCategoryColor(cat), fontWeight: '900' }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reps & Distance Inputs */}
            <View style={styles.numsRow}>
              <View style={styles.numInputGroup}>
                <Text style={styles.miniLabel}>Tekrar (X)</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(set.reps)}
                  onChangeText={(v) => updateSet(set.id, 'reps', parseInt(v) || 1)}
                />
              </View>

              <View style={styles.numInputGroup}>
                <Text style={styles.miniLabel}>Mesafe (m)</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(set.distance)}
                  onChangeText={(v) => updateSet(set.id, 'distance', parseInt(v) || 25)}
                />
              </View>

              <View style={styles.numInputGroup}>
                <Text style={styles.miniLabel}>Mola (sn)</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(set.restSeconds)}
                  onChangeText={(v) => updateSet(set.id, 'restSeconds', parseInt(v) || 0)}
                />
              </View>
            </View>

            {/* Stroke Selector */}
            <Text style={styles.miniLabel}>Yüzme Stili / Ekipman</Text>
            <View style={styles.optionsRow}>
              {strokeOptions.map((str) => (
                <TouchableOpacity
                  key={str}
                  style={[styles.miniChip, set.stroke === str && styles.activeMiniChip]}
                  onPress={() => updateSet(set.id, 'stroke', str)}
                >
                  <Text style={[styles.miniChipText, set.stroke === str && styles.activeMiniChipText]}>
                    {str}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Add Set Button */}
        <TouchableOpacity style={styles.addSetBtn} onPress={addSet} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.addSetBtnText}>Yeni Set Ekle</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Ionicons name="checkmark-done" size={20} color="#070C16" />
          <Text style={styles.saveBtnText}>ANTRENMANI KÜTÜPHANEYE KAYDET</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.xs,
    backgroundColor: Colors.background,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resetBtnText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
    paddingBottom: 50,
  },
  liveSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  summaryLeft: {
    flex: 1,
  },
  summarySubtitle: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  summaryTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  distBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.md,
    ...Layout.shadows.glowYellow,
  },
  distBadgeText: {
    color: '#070C16',
    fontSize: 14,
    fontWeight: '900',
  },
  timeBadgeText: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Layout.spacing.sm,
  },
  inputGroup: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  poolRow: {
    flexDirection: 'row',
    gap: 10,
  },
  poolChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    paddingVertical: 10,
    borderRadius: Layout.borderRadius.md,
  },
  activePoolChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Layout.shadows.glowYellow,
  },
  poolChipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activePoolChipText: {
    color: '#070C16',
    fontWeight: '900',
  },
  setsHeader: {
    marginTop: Layout.spacing.sm,
  },
  setCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Layout.shadows.card,
  },
  setCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  setNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  setCardNum: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  removeBtn: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  activeMiniChip: {
    backgroundColor: Colors.secondary + '25',
    borderColor: Colors.secondary,
  },
  miniChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  activeMiniChipText: {
    color: Colors.secondary,
    fontWeight: '900',
  },
  numsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
  numInputGroup: {
    flex: 1,
  },
  miniLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 4,
  },
  numInput: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderGlass,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 14,
    borderRadius: Layout.borderRadius.lg,
    gap: 8,
    marginBottom: Layout.spacing.lg,
  },
  addSetBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Layout.borderRadius.lg,
    gap: 8,
    ...Layout.shadows.glowYellow,
  },
  saveBtnText: {
    color: '#070C16',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

