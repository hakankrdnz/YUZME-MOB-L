import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout } from '../../constants/theme';
import { StrokeType, WorkoutSet, Workout } from '../../types/swimming';
import { saveCustomWorkout } from '../../services/workoutService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BuilderScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poolLength, setPoolLength] = useState<25 | 50>(25);
  const [sets, setSets] = useState<WorkoutSet[]>([
    {
      id: 'set-1',
      category: 'Isınma',
      reps: 1,
      distance: 200,
      stroke: 'Serbest',
      restSeconds: 30,
      description: 'Rahat ısınma'
    },
    {
      id: 'set-2',
      category: 'Ana Set',
      reps: 4,
      distance: 100,
      stroke: 'Serbest',
      restSeconds: 20,
      description: 'Orta tempo'
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
  const estimatedTimeMin = Math.ceil(totalDistance / 40); // Tahmini hesaplama

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
      description: description.trim() || 'Özel oluşturulan yüzme antrenmanı.',
      sets,
      tags: ['Özel']
    };

    await saveCustomWorkout(newWorkout);
    Alert.alert('Başarılı! 🎉', 'Özel antrenmanınız kaydedildi.', [
      {
        text: 'Tamam',
        onPress: () => {
          setTitle('');
          setDescription('');
          router.push('/workouts');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Antrenman Bilgileri</Text>
      
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
        <Text style={styles.label}>Açıklama / Hedef</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Örn: Tekniği koruyarak %80 tempoda tamamla"
          placeholderTextColor={Colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Pool Length Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Havuz Boyutu</Text>
        <View style={styles.poolRow}>
          {[25, 50].map((len) => (
            <TouchableOpacity
              key={len}
              style={[styles.poolChip, poolLength === len && styles.activePoolChip]}
              onPress={() => setPoolLength(len as 25 | 50)}
            >
              <MaterialCommunityIcons name="waves" size={16} color={poolLength === len ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.poolChipText, poolLength === len && styles.activePoolChipText]}>
                {len} Metre Havuz
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Set List Header */}
      <View style={styles.setsHeader}>
        <Text style={styles.sectionTitle}>Setler ({sets.length} Set • Total {totalDistance}m)</Text>
      </View>

      {/* Dynamic Set Items */}
      {sets.map((set, idx) => (
        <View key={set.id} style={styles.setCard}>
          <View style={styles.setCardHeader}>
            <Text style={styles.setCardNum}>Set #{idx + 1}</Text>
            <TouchableOpacity onPress={() => removeSet(set.id)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={16} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          {/* Category Selection */}
          <View style={styles.optionsRow}>
            {categoryOptions.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.miniChip, set.category === cat && styles.activeMiniChip]}
                onPress={() => updateSet(set.id, 'category', cat)}
              >
                <Text style={[styles.miniChipText, set.category === cat && styles.activeMiniChipText]}>
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
              <Text style={styles.miniLabel}>Dinlenme (sn)</Text>
              <TextInput
                style={styles.numInput}
                keyboardType="numeric"
                value={String(set.restSeconds)}
                onChangeText={(v) => updateSet(set.id, 'restSeconds', parseInt(v) || 0)}
              />
            </View>
          </View>

          {/* Stroke Selector */}
          <Text style={styles.miniLabel}>Yüzme Stili</Text>
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
        <Ionicons name="add" size={18} color={Colors.primary} />
        <Text style={styles.addSetBtnText}>Yeni Set Ekle</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Ionicons name="save-outline" size={20} color="#FFFFFF" />
        <Text style={styles.saveBtnText}>Antrenmanı Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Layout.spacing.md,
    paddingBottom: 50,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Layout.spacing.sm,
  },
  inputGroup: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
  },
  activePoolChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  poolChipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activePoolChipText: {
    color: Colors.background,
    fontWeight: '700',
  },
  setsHeader: {
    marginTop: Layout.spacing.md,
  },
  setCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  setCardNum: {
    color: Colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
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
    borderRadius: 6,
    backgroundColor: Colors.surfaceLight,
  },
  activeMiniChip: {
    backgroundColor: Colors.primaryDark,
  },
  miniChipText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  activeMiniChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    marginBottom: 4,
  },
  numInput: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
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
    borderRadius: Layout.borderRadius.md,
    gap: 8,
    marginBottom: Layout.spacing.lg,
  },
  addSetBtnText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Layout.borderRadius.md,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
