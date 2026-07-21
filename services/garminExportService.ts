import { Share, Alert } from 'react-native';
import { Workout } from '../types/swimming';

export interface GarminWorkoutStep {
  stepId: number;
  stepType: 'warmup' | 'active' | 'rest' | 'cooldown';
  strokeType: string;
  targetValue: number;
  notes?: string;
}

export interface GarminWorkoutJson {
  workoutName: string;
  sportType: 'SWIMMING';
  poolLength: number;
  poolLengthUnit: 'METERS';
  steps: GarminWorkoutStep[];
}

export const convertToGarminWorkout = (workout: Workout): GarminWorkoutJson => {
  const steps: GarminWorkoutStep[] = [];
  let stepId = 1;

  workout.sets.forEach((set) => {
    let stepType: 'warmup' | 'active' | 'rest' | 'cooldown' = 'active';
    if (set.category === 'Isınma') stepType = 'warmup';
    if (set.category === 'Soğuma') stepType = 'cooldown';

    steps.push({
      stepId: stepId++,
      stepType,
      strokeType: set.stroke,
      targetValue: set.reps * set.distance,
      notes: `${set.reps}x${set.distance}m ${set.stroke}`
    });

    if (set.restSeconds > 0) {
      steps.push({
        stepId: stepId++,
        stepType: 'rest',
        strokeType: 'ANY',
        targetValue: set.restSeconds,
        notes: `Rest ${set.restSeconds}s`
      });
    }
  });

  return {
    workoutName: workout.title,
    sportType: 'SWIMMING',
    poolLength: workout.poolLength,
    poolLengthUnit: 'METERS',
    steps
  };
};

export const exportWorkoutToGarmin = async (workout: Workout): Promise<void> => {
  try {
    const garminJson = convertToGarminWorkout(workout);
    const jsonFormatted = JSON.stringify(garminJson, null, 2);

    await Share.share({
      title: `${workout.title} - Garmin Workout`,
      message: `GARMIN WORKOUT - ${workout.title}\n\n${jsonFormatted}`,
    });
  } catch (error) {
    Alert.alert('Hata', 'Garmin antrenman dosyası hazırlanamadı.');
  }
};
