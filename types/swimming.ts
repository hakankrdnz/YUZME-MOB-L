export type StrokeType = 
  | 'Serbest' 
  | 'Sırtüstü' 
  | 'Kurbağalama' 
  | 'Kelebek' 
  | 'Karışık (IM)' 
  | 'Ayak (Drill)' 
  | 'Serbest Drill';

export type IntensityLevel = 'Başlangıç' | 'Orta' | 'İleri' | 'Tüm Seviyeler';

export interface WorkoutSet {
  id: string;
  reps: number;            // Tekrar sayısı (ör: 4)
  distance: number;        // Mesafe metre (ör: 50m)
  stroke: StrokeType;      // Yüzme stili
  restSeconds: number;     // Dinlenme süresi (saniye)
  description?: string;    // Ek not (ör: %80 tempo, ayak tahtası ile)
  category: 'Isınma' | 'Ana Set' | 'Soğuma' | 'Ara Set';
}

export interface Workout {
  id: string;
  title: string;
  level: IntensityLevel;
  poolLength: 25 | 50;     // 25m veya 50m havuz
  totalDistance: number;   // Otomatik hesaplanan toplam mesafe (m)
  estimatedTimeMin: number;// Tahmini süre (dk)
  description: string;
  sets: WorkoutSet[];
  tags: string[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;     // ISO Tarih metni
  durationMinutes: number;
  totalDistance: number;   // Metre
  notes?: string;
}
