import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutLog } from '../types/swimming';

const STORAGE_KEY_CUSTOM_WORKOUTS = '@swimming_custom_workouts';
const STORAGE_KEY_LOGS = '@swimming_workout_logs';

export interface DetailedWorkoutSetItem {
  id: string;
  category: 'Warmup' | 'Preparation' | 'Main' | 'Cool Down';
  reps: number;
  distance: number;
  stroke: string;
  intensityPercent: number; // 40, 50, 60, 70, 80, 90, 100
  restTimeFormatted: string; // e.g. "0:30"
}

export interface DetailedWorkoutPlan {
  id: string;
  title: string;
  level: string;
  poolLength: 25 | 50;
  totalDistance: number;
  estimatedTimeMin: number;
  description: string;
  sets: DetailedWorkoutSetItem[];
}

export const REAL_SWIM_WORKOUTS: Record<string, DetailedWorkoutPlan> = {
  // 1. Interval Training (2800m)
  'Interval Training': {
    id: 'w-interval',
    title: 'Interval Training',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 50,
    description: 'Açık su yüzücüleri (Open Water Swimmers) için yüksek tempolu interval antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: '50m free + 50m drill', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'Fist swimming drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 4, distance: 50, stroke: 'Free progressive 1st 60% to 4th 90%', intensityPercent: 80, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 10, distance: 100, stroke: 'Freestyle CSS Pace (Tempo Hold)', intensityPercent: 85, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 5, distance: 200, stroke: 'Freestyle (150m CSS + 50m Sprint)', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'm3', category: 'Main', reps: 2, distance: 100, stroke: 'Easy free recovery', intensityPercent: 40, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Swim/kick easy with fins', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 2. Long Distance (2900m)
  'Long Distance': {
    id: 'w-longdistance',
    title: 'Long Distance',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2900,
    estimatedTimeMin: 55,
    description: 'Açık su enerjisini yönetmeyi ve 2. yarıda negatif split yüzmeyi öğreten dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Easy swim & kick', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 3, distance: 100, stroke: 'Armpit & Gentle swim with fins', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 2, distance: 1000, stroke: 'Free negative split (500m 60% + 500m 70%)', intensityPercent: 70, restTimeFormatted: '1:00' },
      { id: 'm2', category: 'Main', reps: 4, distance: 50, stroke: 'Freestyle sprint build 90%', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy swim or kick', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 3. Hybrid / Endurance + Hypoxic (3100m)
  'Hybrid': {
    id: 'w-hybrid',
    title: 'Endurance + Hypoxic (Hybrid)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3100,
    estimatedTimeMin: 65,
    description: 'Akciğer kapasitesini artırma ve hipoksik nefes kontrolü odaklı ileri seviye antrenman.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 3, distance: 100, stroke: 'Catch up & Shake drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 6, distance: 200, stroke: 'Free with pull buoy and paddles 60%', intensityPercent: 60, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 6, distance: 150, stroke: 'Free with pull buoy 80%', intensityPercent: 80, restTimeFormatted: '0:20' },
      { id: 'm3', category: 'Main', reps: 6, distance: 50, stroke: 'Free with fins (breathe every 6 strokes) 70%', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Swim or kick easy', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 4. Long Speed (2800m)
  'Long Speed': {
    id: 'w-longspeed',
    title: 'Long Speed',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 50,
    description: 'Uzun kulacın temposunu ve yüksek sürati koruma antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 100, stroke: 'Single arm & Fist drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 8, distance: 200, stroke: 'Free CSS Pace 75% (8 Rounds)', intensityPercent: 75, restTimeFormatted: '0:30' },
      { id: 'm2', category: 'Main', reps: 8, distance: 50, stroke: 'Free 90% sprint', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy swim or kick', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 5. Lung Capacity & Speed (3000m)
  'Pure Speed': {
    id: 'w-lungcapacity',
    title: 'Lung Capacity & Speed',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 3000,
    estimatedTimeMin: 55,
    description: 'Her nefeste daha fazla oksijen alma ve akciğer kapasitesini geliştirme programı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim any stroke', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 100, stroke: 'Scull + Single arm drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 10, distance: 100, stroke: 'Free (no breath last 15m)', intensityPercent: 80, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 6, distance: 200, stroke: 'Free breathe every 3 or 5 stroke 70%', intensityPercent: 70, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Free with snorkel', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Swimathon 2.5k (Pace Practice) - 2800m
  'Swimathon 2.5k Pace Practice': {
    id: 'w-swimathon-25k-pace',
    title: 'Swimathon 2.5k (Pace Practice)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 50,
    description: 'Official Swimathon 2.5k 10-haftalık planın 8x100m sabit tempo ve kademeli ritim kontrolü antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Freestyle easy swim, mixed strokes', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 100, stroke: '25m drill + 25m bilateral breathing', intensityPercent: 60, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 10, distance: 100, stroke: 'Freestyle best consistent pace', intensityPercent: 75, restTimeFormatted: '0:15' },
      { id: 'm2', category: 'Main', reps: 10, distance: 100, stroke: 'Freestyle hold same pace from set 1', intensityPercent: 75, restTimeFormatted: '0:15' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Freestyle easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Swimathon Endurance (4x400m) - 2900m
  'Swimathon Endurance 4x400m': {
    id: 'w-swimathon-endurance-4x400',
    title: 'Swimathon Endurance (4x400m)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2900,
    estimatedTimeMin: 52,
    description: 'Official Swimathon 4×400m sürdürülebilir tempo ve 4×25m depar hızlı bitiriş dayanıklılık seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Freestyle easy swim', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 3, distance: 100, stroke: 'Freestyle drill + fast arms', intensityPercent: 75, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 5, distance: 400, stroke: 'Freestyle easy, sustainable, consistent pace', intensityPercent: 70, restTimeFormatted: '0:45' },
      { id: 'm2', category: 'Main', reps: 4, distance: 50, stroke: 'Freestyle max sprint', intensityPercent: 100, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy backstroke', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W1S1 - 2800m
  'Marathon Swims W1S1 Steady Intro': {
    id: 'w-ms-w1s1-steady',
    title: 'Marathon Swims W1S1 (Steady Intro)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 50,
    description: 'Swim for Tri (SFT) 5-Haftalık 5km Marathon Swims rehberinin 1. Hafta 1. Seansı (Pyramid 50m to 400m).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'FC easy full stroke & pull', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: '4 strokes fists + fast arms into easy', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 200, stroke: 'FC rest 15s', intensityPercent: 65, restTimeFormatted: '0:15' },
      { id: 'm2', category: 'Main', reps: 1, distance: 400, stroke: 'FC rest 25s', intensityPercent: 70, restTimeFormatted: '0:25' },
      { id: 'm3', category: 'Main', reps: 1, distance: 600, stroke: 'FC rest 35s', intensityPercent: 75, restTimeFormatted: '0:35' },
      { id: 'm4', category: 'Main', reps: 1, distance: 800, stroke: 'FC record time taken rest 45s', intensityPercent: 80, restTimeFormatted: '0:45' },
      { id: 'm5', category: 'Main', reps: 1, distance: 200, stroke: 'FC sprint finish', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'With fins & snorkel easy swim down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W1S2 - 2900m
  'Marathon Swims W1S2 Faster Efforts': {
    id: 'w-ms-w1s2-faster',
    title: 'Marathon Swims W1S2 (Faster Efforts 4x100s)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2900,
    estimatedTimeMin: 50,
    description: 'SFT Marathon Swims 16x100m Best Average sürat ve ritim dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Standard SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 3, distance: 100, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 6, distance: 100, stroke: '6x100m FC Best Average, rest 10s between each', intensityPercent: 85, restTimeFormatted: '0:10' },
      { id: 'm2', category: 'Main', reps: 6, distance: 100, stroke: '6x100m FC Best Average (faster), rest 15s', intensityPercent: 88, restTimeFormatted: '0:15' },
      { id: 'm3', category: 'Main', reps: 6, distance: 100, stroke: '6x100m FC Best Average (quicker), rest 20s', intensityPercent: 90, restTimeFormatted: '0:20' },
      { id: 'm4', category: 'Main', reps: 4, distance: 100, stroke: '4x100m FC Best Average (fastest round!), rest 30s', intensityPercent: 95, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W2S1 - 2800m
  'Marathon Swims W2S1 Breathing Patterns': {
    id: 'w-ms-w2s1-breathing',
    title: 'Marathon Swims W2S1 (Breathing Patterns)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 50,
    description: 'SFT Marathon Swims BP5 ➔ BP4 ➔ BP3 ➔ Snorkel nefes hipoksik dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 800, stroke: '800m FC BP 5 (breathe every 5th stroke) rest 30s', intensityPercent: 70, restTimeFormatted: '0:30' },
      { id: 'm2', category: 'Main', reps: 1, distance: 600, stroke: '600m FC BP 4 (with pull buoy) rest 30s', intensityPercent: 70, restTimeFormatted: '0:30' },
      { id: 'm3', category: 'Main', reps: 1, distance: 400, stroke: '400m FC BP 3 (with fins) rest 20s', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'm4', category: 'Main', reps: 1, distance: 400, stroke: '400m FC with snorkel as much air as you like rest 20s', intensityPercent: 60, restTimeFormatted: '0:20' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W3S1 - 3000m
  'Marathon Swims W3S1 Pacing 4x500m': {
    id: 'w-ms-w3s1-pacing-4x500',
    title: 'Marathon Swims W3S1 (Pacing 4x500m)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3000,
    estimatedTimeMin: 55,
    description: 'SFT 4 adet 500m blok (50m, 100m, 150m yarış temposu + 200m aktif dinlenme) maraton seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 4, distance: 500, stroke: '500m FC (50m, 100m, 150m pace + 200m recovery)', intensityPercent: 80, restTimeFormatted: '0:45' },
      { id: 'm2', category: 'Main', reps: 4, distance: 100, stroke: '100m sprint build 90%', intensityPercent: 90, restTimeFormatted: '0:20' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W3S2 - 3100m
  'Marathon Swims W3S2 21x100m Autopilot': {
    id: 'w-ms-w3s2-21x100',
    title: 'Marathon Swims W3S2 (21x100m Autopilot)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3100,
    estimatedTimeMin: 58,
    description: 'SFT 25 adet 100m serbest tekrarı ile sürtünmeyi düşürüp mükemmel teknikle bitirme seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 25, distance: 100, stroke: '25x100m FC steady, rest 30s', intensityPercent: 75, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W4S3 - 3200m
  'Marathon Swims W4S3 Long Distance 7x400m': {
    id: 'w-ms-w4s3-7x400',
    title: 'Marathon Swims W4S3 (Long Distance 7x400m)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3200,
    estimatedTimeMin: 60,
    description: 'SFT 7 adet 400m maraton seti (tekli turlarda melek, çiftlilerde palet ile güç geliştirme).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 6, distance: 450, stroke: '6x450m FC rest 30s (build pace)', intensityPercent: 80, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 100, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims W5S1 - 2900m
  'Marathon Swims W5S1 Event Prep 1600m Exit': {
    id: 'w-ms-w5s1-exit-prep',
    title: 'Marathon Swims W5S1 (Event Prep 1600m Exit)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2900,
    estimatedTimeMin: 52,
    description: 'SFT 2000m Serbest tekrarında her 200m de bir havuzdan çıkıp ayakta nabız düşürme simülasyon seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 3, distance: 100, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 11, distance: 200, stroke: '2200m FC, safely exit pool every 200m, stand up, reduce HR', intensityPercent: 75, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // Marathon Swims 5km Race Day Event - 3200m
  'Marathon Swims 5km Race Day Event': {
    id: 'w-ms-raceday-5k',
    title: 'Marathon Swims 5km Race Day Event',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3200,
    estimatedTimeMin: 60,
    description: '5km Açık Su / Maraton Yüzme Simülasyon Günü (2800m Yarış + 400m Isınma/Soğuma).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Race Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 2, distance: 50, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 2700, stroke: '2700m MARATHON SWIM SIMULATION! Maintain even pace, 50 strokes or less per 50m', intensityPercent: 85, restTimeFormatted: '0:00' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Easy Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  }
};



export const INITIAL_WORKOUTS: Workout[] = Object.values(REAL_SWIM_WORKOUTS).map(p => ({
  id: p.id,
  title: p.title,
  level: p.level as any,
  poolLength: p.poolLength,
  totalDistance: p.totalDistance,
  estimatedTimeMin: p.estimatedTimeMin,
  description: p.description,
  tags: ['Open Water', 'Swim Success'],
  sets: p.sets.map(s => ({
    id: s.id,
    category: s.category === 'Warmup' ? 'Isınma' : s.category === 'Cool Down' ? 'Soğuma' : 'Ana Set',
    reps: s.reps,
    distance: s.distance,
    stroke: s.stroke as any,
    restSeconds: parseInt(s.restTimeFormatted.split(':')[1] || '30'),
    description: s.stroke
  }))
}));

export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_WORKOUTS);
    const customWorkouts: Workout[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    return [...INITIAL_WORKOUTS, ...customWorkouts];
  } catch (e) {
    return INITIAL_WORKOUTS;
  }
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_WORKOUTS);
    const existing: Workout[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    const updated = [workout, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_WORKOUTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Save workout error', e);
  }
};

export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_LOGS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveWorkoutLog = async (log: WorkoutLog): Promise<void> => {
  try {
    const existing = await getWorkoutLogs();
    const updated = [log, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Save workout log error', e);
  }
};
