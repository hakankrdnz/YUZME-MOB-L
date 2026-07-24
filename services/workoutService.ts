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
  // 1. Interval Training (2300m)
  'Interval Training': {
    id: 'w-interval',
    title: 'Interval Training',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2300,
    estimatedTimeMin: 45,
    description: 'Açık su yüzücüleri (Open Water Swimmers) için yüksek tempolu interval antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: '50m free + 50m drill', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 2, distance: 50, stroke: 'Fist swimming drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 2, distance: 50, stroke: 'Switch drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p3', category: 'Preparation', reps: 4, distance: 50, stroke: 'Free progressive 1st 60% to 4th 90%', intensityPercent: 80, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 3, distance: 50, stroke: 'Freestyle (15m 100% + 35m easy) (4 Round)', intensityPercent: 100, restTimeFormatted: '1:00' },
      { id: 'm2', category: 'Main', reps: 1, distance: 50, stroke: 'Freestyle (25m 90% + 25m easy)', intensityPercent: 90, restTimeFormatted: '0:20' },
      { id: 'm3', category: 'Main', reps: 1, distance: 100, stroke: 'Easy free recovery', intensityPercent: 40, restTimeFormatted: '1:00' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Swim/kick easy with fins', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 2. Long Distance (2800m)
  'Long Distance': {
    id: 'w-longdistance',
    title: 'Long Distance',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 55,
    description: 'Açık su enerjisini yönetmeyi ve 2. yarıda negatif split yüzmeyi öğreten dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Easy swim & kick', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 2, distance: 50, stroke: 'Gentle swim with fins', intensityPercent: 50, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 2, distance: 50, stroke: 'Armpit swim with fins', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p3', category: 'Preparation', reps: 4, distance: 50, stroke: 'Free progressive from 60% to 90%', intensityPercent: 80, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 2, distance: 1000, stroke: 'Free negative split (500m 60% + 500m 70%)', intensityPercent: 70, restTimeFormatted: '1:00' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy swim or kick', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 3. Hybrid / Endurance + Hypoxic (4100m)
  'Hybrid': {
    id: 'w-hybrid',
    title: 'Endurance + Hypoxic (Hybrid)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 4100,
    estimatedTimeMin: 75,
    description: 'Akciğer kapasitesini artırma ve hipoksik nefes kontrolü odaklı ileri seviye antrenman.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 1, distance: 100, stroke: 'Catch up drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 1, distance: 100, stroke: 'Gentle swim', intensityPercent: 50, restTimeFormatted: '0:30' },
      { id: 'p3', category: 'Preparation', reps: 1, distance: 100, stroke: 'Shake drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 8, distance: 200, stroke: 'Free with pull buoy and paddles 60%', intensityPercent: 60, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 8, distance: 100, stroke: 'Free with pull buoy 80%', intensityPercent: 80, restTimeFormatted: '0:20' },
      { id: 'm3', category: 'Main', reps: 16, distance: 50, stroke: 'Free with fins (breathe every 6 strokes) 60%', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'm4', category: 'Main', reps: 4, distance: 50, stroke: 'Free breathe as less as possible', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Swim or kick easy', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 4. Long Speed (2500m)
  'Long Speed': {
    id: 'w-longspeed',
    title: 'Long Speed',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2500,
    estimatedTimeMin: 50,
    description: 'Uzun kulacın temposunu ve yüksek sürati koruma antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 50, stroke: 'Single arm drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 4, distance: 50, stroke: 'Fist swimming', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p3', category: 'Preparation', reps: 4, distance: 50, stroke: 'Free with pull buoy breathe every 5', intensityPercent: 70, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 5, distance: 200, stroke: 'Free 60% (5 Rounds)', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm2', category: 'Main', reps: 5, distance: 50, stroke: 'Free 90% sprint', intensityPercent: 90, restTimeFormatted: '0:30' },
      { id: 'm3', category: 'Main', reps: 5, distance: 50, stroke: 'Easy swim recovery', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy swim or kick', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // 5. Lung Capacity & Speed (2800m)
  'Pure Speed': {
    id: 'w-lungcapacity',
    title: 'Lung Capacity & Speed',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2800,
    estimatedTimeMin: 55,
    description: 'Her nefeste daha fazla oksijen alma ve akciğer kapasitesini geliştirme programı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Swim any stroke', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 2, distance: 50, stroke: '25m front scull + 25m free', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p2', category: 'Preparation', reps: 2, distance: 50, stroke: 'Single arm drill', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p3', category: 'Preparation', reps: 2, distance: 50, stroke: 'Free breathing every 5 strokes', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'p4', category: 'Preparation', reps: 2, distance: 50, stroke: 'Doggy paddles with fins', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'm1', category: 'Main', reps: 16, distance: 50, stroke: 'Free (no breath last 15m)', intensityPercent: 80, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 1, distance: 100, stroke: 'Easy swim or kick', intensityPercent: 40, restTimeFormatted: '1:00' },
      { id: 'm3', category: 'Main', reps: 5, distance: 200, stroke: 'Free breathe every 3 or 5 stroke 60%', intensityPercent: 60, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Free with snorkel', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  // NEW OFFICIAL PDF PROGRAM: Swimathon 2.5k / 5k 10-Week Plan Highlights & Marathon Swims
  'Swimathon 2.5k Pace Practice': {
    id: 'w-swimathon-25k-pace',
    title: 'Swimathon 2.5k (Pace Practice)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2400,
    estimatedTimeMin: 45,
    description: 'Official Swimathon 2.5k 10-haftalık planın 8x100m sabit tempo ve kademeli ritim kontrolü antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Freestyle easy swim, mixed strokes', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 6, distance: 50, stroke: '25m drill + 25m bilateral breathing, relaxed pace', intensityPercent: 60, restTimeFormatted: '0:10' },
      { id: 'm1', category: 'Main', reps: 8, distance: 100, stroke: 'Freestyle best consistent pace', intensityPercent: 75, restTimeFormatted: '0:15' },
      { id: 'm2', category: 'Main', reps: 1, distance: 100, stroke: 'Easy backstroke recovery', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'm3', category: 'Main', reps: 8, distance: 100, stroke: 'Freestyle hold same pace from set 1', intensityPercent: 75, restTimeFormatted: '0:15' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Freestyle easy choice', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Swimathon Endurance 4x400m': {
    id: 'w-swimathon-endurance-4x400',
    title: 'Swimathon Endurance (4x400m)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2300,
    estimatedTimeMin: 42,
    description: 'Official Swimathon 4×400m sürdürülebilir tempo ve 4×25m depar hızlı bitiriş dayanıklılık seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Freestyle easy swim', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 8, distance: 25, stroke: 'Freestyle sprint last 5m of each length', intensityPercent: 80, restTimeFormatted: '0:05' },
      { id: 'm1', category: 'Main', reps: 4, distance: 400, stroke: 'Freestyle easy, sustainable, consistent pace', intensityPercent: 70, restTimeFormatted: '0:45' },
      { id: 'm2', category: 'Main', reps: 4, distance: 25, stroke: 'Freestyle max sprint', intensityPercent: 100, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'Easy backstroke', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W1S1 Steady Intro': {
    id: 'w-ms-w1s1-steady',
    title: 'Marathon Swims W1S1 (Steady Intro)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2300,
    estimatedTimeMin: 45,
    description: 'Swim for Tri (SFT) 5-Haftalık 5km Marathon Swims rehberinin 1. Hafta 1. Seansı (Pyramid 50m to 400m).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'FC easy full stroke & pull', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: '4 strokes fists + 4 strokes normal fast arms into easy', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 50, stroke: 'FC rest 10s', intensityPercent: 60, restTimeFormatted: '0:10' },
      { id: 'm2', category: 'Main', reps: 1, distance: 100, stroke: 'FC rest 15s', intensityPercent: 65, restTimeFormatted: '0:15' },
      { id: 'm3', category: 'Main', reps: 1, distance: 150, stroke: 'FC with fins rest 15s', intensityPercent: 70, restTimeFormatted: '0:15' },
      { id: 'm4', category: 'Main', reps: 1, distance: 200, stroke: 'FC rest 25s', intensityPercent: 70, restTimeFormatted: '0:25' },
      { id: 'm5', category: 'Main', reps: 1, distance: 250, stroke: 'FC with pull buoy rest 25s', intensityPercent: 70, restTimeFormatted: '0:25' },
      { id: 'm6', category: 'Main', reps: 1, distance: 300, stroke: 'FC rest 35s', intensityPercent: 75, restTimeFormatted: '0:35' },
      { id: 'm7', category: 'Main', reps: 1, distance: 350, stroke: 'FC with paddles rest 35s', intensityPercent: 75, restTimeFormatted: '0:35' },
      { id: 'm8', category: 'Main', reps: 1, distance: 400, stroke: 'FC record time taken rest 45s', intensityPercent: 80, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'With fins & snorkel easy swim down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W1S2 Faster Efforts': {
    id: 'w-ms-w1s2-faster',
    title: 'Marathon Swims W1S2 (Faster Efforts 4x100s)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2100,
    estimatedTimeMin: 40,
    description: 'SFT Marathon Swims 16x100m Best Average sürat ve ritim dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'Standard SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms to get heart rate up', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 4, distance: 100, stroke: '4x100m FC Best Average, rest 10s between each', intensityPercent: 85, restTimeFormatted: '0:10' },
      { id: 'm2', category: 'Main', reps: 4, distance: 100, stroke: '4x100m FC Best Average (faster), rest 15s', intensityPercent: 88, restTimeFormatted: '0:15' },
      { id: 'm3', category: 'Main', reps: 4, distance: 100, stroke: '4x100m FC Best Average (quicker), rest 20s', intensityPercent: 90, restTimeFormatted: '0:20' },
      { id: 'm4', category: 'Main', reps: 4, distance: 100, stroke: '4x100m FC Best Average (fastest round!), rest 30s', intensityPercent: 95, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W2S1 Breathing Patterns': {
    id: 'w-ms-w2s1-breathing',
    title: 'Marathon Swims W2S1 (Breathing Patterns)',
    level: 'Intermediate Level',
    poolLength: 50,
    totalDistance: 2000,
    estimatedTimeMin: 38,
    description: 'SFT Marathon Swims BP5 ➔ BP4 ➔ BP3 ➔ Snorkel nefes hipoksik dayanıklılık antrenmanı.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 500, stroke: '500m FC BP 5 (breathe every 5th stroke) rest 20s', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'm2', category: 'Main', reps: 1, distance: 400, stroke: '400m FC BP 4 (with pull buoy, switch breathing sides) rest 20s', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'm3', category: 'Main', reps: 1, distance: 300, stroke: '300m FC BP 3 (with fins) rest 20s', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'm4', category: 'Main', reps: 1, distance: 200, stroke: '200m FC with snorkel as much air as you like rest 20s', intensityPercent: 60, restTimeFormatted: '0:20' },
      { id: 'm5', category: 'Main', reps: 1, distance: 100, stroke: '100m FC BP 3.2 (every 3rd then 2nd breath) rest 20s', intensityPercent: 70, restTimeFormatted: '0:20' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W3S1 Pacing 4x500m': {
    id: 'w-ms-w3s1-pacing-4x500',
    title: 'Marathon Swims W3S1 (Pacing 4x500m)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2500,
    estimatedTimeMin: 45,
    description: 'SFT 4 adet 500m blok (50m, 100m, 150m yarış temposu + 200m aktif dinlenme) maraton seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 4, distance: 50, stroke: '50m aim race target pace rest 10s (4 Rounds)', intensityPercent: 85, restTimeFormatted: '0:10' },
      { id: 'm2', category: 'Main', reps: 4, distance: 100, stroke: '100m aim race target pace rest 20s (4 Rounds)', intensityPercent: 85, restTimeFormatted: '0:20' },
      { id: 'm3', category: 'Main', reps: 4, distance: 150, stroke: '150m aim race target pace rest 30s (4 Rounds)', intensityPercent: 85, restTimeFormatted: '0:30' },
      { id: 'm4', category: 'Main', reps: 4, distance: 200, stroke: '200m recovery with pull buoy breathing every 3rd rest 45s (4 Rounds)', intensityPercent: 50, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W3S2 21x100m Autopilot': {
    id: 'w-ms-w3s2-21x100',
    title: 'Marathon Swims W3S2 (21x100m Autopilot)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2600,
    estimatedTimeMin: 48,
    description: 'SFT 21 adet 100m serbest tekrarı ile sürtünmeyi düşürüp mükemmel teknikle bitirme seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 21, distance: 100, stroke: '21x100m FC steady, rest 30s, breathe every 5th on last length of each', intensityPercent: 75, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W4S3 Long Distance 7x400m': {
    id: 'w-ms-w4s3-7x400',
    title: 'Marathon Swims W4S3 (Long Distance 7x400m)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 3300,
    estimatedTimeMin: 58,
    description: 'SFT 7 adet 400m maraton seti (tekli turlarda melek, çiftlilerde palet ile güç geliştirme).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 7, distance: 400, stroke: '7x400m FC rest 30s (build 1-4, 5-7. Odd swims pull buoy, even swims fins)', intensityPercent: 80, restTimeFormatted: '0:30' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims W5S1 Event Prep 1600m Exit': {
    id: 'w-ms-w5s1-exit-prep',
    title: 'Marathon Swims W5S1 (Event Prep 1600m Exit)',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 2100,
    estimatedTimeMin: 40,
    description: 'SFT 1600m Serbest tekrarında her 200m de bir havuzdan çıkıp ayakta nabız düşürme simülasyon seti.',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 8, distance: 200, stroke: '1600m FC, safely exit pool every 200m, stand up, reduce HR, return with great technique', intensityPercent: 75, restTimeFormatted: '0:45' },
      { id: 'c1', category: 'Cool Down', reps: 1, distance: 200, stroke: 'SFT Swim Down', intensityPercent: 40, restTimeFormatted: '0:30' },
    ]
  },

  'Marathon Swims 5km Race Day Event': {
    id: 'w-ms-raceday-5k',
    title: 'Marathon Swims 5km Race Day Event',
    level: 'Advanced Level',
    poolLength: 50,
    totalDistance: 5500,
    estimatedTimeMin: 90,
    description: '5km Açık Su / Maraton Yüzme Yarış Günü (5000m Yarış + 300m Isınma/Soğuma).',
    sets: [
      { id: 'w1', category: 'Warmup', reps: 1, distance: 200, stroke: 'SFT Race Warmup', intensityPercent: 40, restTimeFormatted: '0:30' },
      { id: 'p1', category: 'Preparation', reps: 4, distance: 25, stroke: 'SFT Subset fast arms', intensityPercent: 80, restTimeFormatted: '0:15' },
      { id: 'm1', category: 'Main', reps: 1, distance: 5000, stroke: '5000m MARATHON SWIM EVENT! Maintain even pace, 50 strokes or less per 50m', intensityPercent: 85, restTimeFormatted: '0:00' },
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
