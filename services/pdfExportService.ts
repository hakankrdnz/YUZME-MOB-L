import { Share, Alert } from 'react-native';
import { Workout } from '../types/swimming';

export const generateWorkoutSummaryText = (workout: Workout): string => {
  const setsText = workout.sets.map((set, idx) => 
    `• Set ${idx + 1} [${set.category}]: ${set.reps}x${set.distance}m ${set.stroke} ${set.restSeconds > 0 ? `(Dinlenme: ${set.restSeconds}sn)` : ''} ${set.description ? `- ${set.description}` : ''}`
  ).join('\n');

  return `🏊‍♂️ OPEN WATER DRAGOS - YÜZME ANTRENMAN KARTI
------------------------------------------
📌 Antrenman: ${workout.title}
🏊 Havuz: ${workout.poolLength}m | Seviye: ${workout.level}
📏 Toplam Mesafe: ${workout.totalDistance} Metre
⏱️ Tahmini Süre: ${workout.estimatedTimeMin} Dk

ANTRENMAN SETLERİ:
${setsText}
------------------------------------------
Open Water Dragos Swim Tracker`;
};

export const exportWorkoutToPDF = async (workout: Workout): Promise<void> => {
  try {
    const summaryText = generateWorkoutSummaryText(workout);
    await Share.share({
      title: `${workout.title} - Havuz Antrenman Kartı`,
      message: summaryText,
    });
  } catch (error) {
    Alert.alert('Hata', 'Antrenman kartı paylaşılamadı.');
  }
};
