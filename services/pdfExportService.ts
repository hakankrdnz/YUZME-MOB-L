import { Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Workout } from '../types/swimming';
import { REAL_SWIM_WORKOUTS, DetailedWorkoutSetItem } from './workoutService';

export const generateWorkoutHTML = (workout: Workout): string => {
  const matchedPlan = REAL_SWIM_WORKOUTS[workout.title] || REAL_SWIM_WORKOUTS['Long Distance'] || REAL_SWIM_WORKOUTS['Interval Training'];
  const setsList: DetailedWorkoutSetItem[] = matchedPlan ? matchedPlan.sets : workout.sets.map((s, idx) => ({
    id: `set-${idx}`,
    category: s.category === 'Isınma' ? 'Warmup' : s.category === 'Soğuma' ? 'Cool Down' : 'Main',
    reps: s.reps,
    distance: s.distance,
    stroke: s.stroke,
    intensityPercent: 70,
    restTimeFormatted: s.restSeconds > 0 ? `0:${s.restSeconds < 10 ? '0' : ''}${s.restSeconds}` : '0:30'
  }));

  const categories: ('Warmup' | 'Preparation' | 'Main' | 'Cool Down')[] = [
    'Warmup',
    'Preparation',
    'Main',
    'Cool Down'
  ];

  const getSquareColor = (category: string, stroke: string, intensity: number) => {
    if (intensity >= 90 || stroke.includes('90%') || stroke.includes('100%')) return '#F97316'; // Warm Orange
    if (category === 'Preparation' || intensity >= 60) return '#3B82F6'; // Electric Blue
    return '#F8FAFC'; // Clean White
  };

  const sectionsHtml = categories.map(cat => {
    const secSets = setsList.filter(s => s.category === cat);
    if (secSets.length === 0) return '';

    const rowsHtml = secSets.map(set => {
      const squareColor = getSquareColor(set.category, set.stroke, set.intensityPercent || 70);
      const repsFormatted = set.reps > 1 ? `${set.reps}×${set.distance}` : `${set.distance}`;

      return `
        <div class="set-row">
          <div class="set-left">
            <span class="color-square" style="background-color: ${squareColor};"></span>
            <span class="reps-val">${repsFormatted}</span>
            <span class="stroke-val">${set.stroke}</span>
          </div>
          <div class="set-right">
            <span class="timer-icon">⏱</span>
            <span class="rest-val">${set.restTimeFormatted}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="section-card">
        <div class="section-title">${cat}</div>
        <div class="set-list">
          ${rowsHtml}
        </div>
      </div>
    `;
  }).join('');

  const shortTitle = workout.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'LD';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${workout.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #050B14;
            color: #F8FAFC;
            padding: 24px;
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          .top-nav {
            display: flex;
            align-items: center;
            justify.content: space-between;
            margin-bottom: 20px;
          }
          .back-arrow {
            font-size: 22px;
            color: #F8FAFC;
            font-weight: 300;
          }
          .badge-pill {
            display: inline-flex;
            align-items: center;
            background-color: #0E1D36;
            border: 1.5px solid #1E3A66;
            padding: 8px 18px;
            border-radius: 20px;
            gap: 8px;
          }
          .badge-icon {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: 1px solid #38BDF8;
            color: #38BDF8;
            font-size: 10px;
            font-weight: 900;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .badge-text {
            color: #F8FAFC;
            font-size: 15px;
            font-weight: 800;
          }
          .glossary-row {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #94A3B8;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-left: 4px;
          }
          .section-card {
            background-color: #0A162B;
            border: 1px solid #192C4D;
            border-radius: 18px;
            padding: 18px 20px;
            margin-bottom: 18px;
          }
          .section-title {
            color: #F8FAFC;
            font-size: 19px;
            font-weight: 800;
            margin-bottom: 14px;
          }
          .set-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .set-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .set-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .color-square {
            width: 13px;
            height: 13px;
            border-radius: 3px;
            display: inline-block;
          }
          .reps-val {
            color: #F8FAFC;
            font-size: 16px;
            font-weight: 900;
            min-width: 50px;
          }
          .stroke-val {
            color: #F8FAFC;
            font-size: 14px;
            font-weight: 600;
          }
          .set-right {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #94A3B8;
            font-size: 13px;
            font-weight: 600;
          }
          .timer-icon {
            font-size: 14px;
            opacity: 0.8;
          }
          .footer-logo {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 20px;
            color: #38BDF8;
            font-size: 24px;
          }
          .actions-btn {
            background-color: #F8FAFC;
            color: #050B14;
            text-align: center;
            padding: 16px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 900;
            letterSpacing: 0.5px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="top-nav">
          <span class="back-arrow">&#10094;</span>
          <div class="badge-pill">
            <span class="badge-icon">${shortTitle}</span>
            <span class="badge-text">${workout.title}</span>
          </div>
          <div style="width: 24px;"></div>
        </div>

        <div class="glossary-row">
          <span>&#9432;</span> Training Glossary
        </div>

        ${sectionsHtml}

        <div class="footer-logo">🏊‍♂️</div>

        <div class="actions-btn">
          Session Actions
        </div>
      </body>
    </html>
  `;
};

export const generateWorkoutSummaryText = (workout: Workout): string => {
  const matchedPlan = REAL_SWIM_WORKOUTS[workout.title] || REAL_SWIM_WORKOUTS['Long Distance'] || REAL_SWIM_WORKOUTS['Interval Training'];
  const setsList: DetailedWorkoutSetItem[] = matchedPlan ? matchedPlan.sets : workout.sets.map((s, idx) => ({
    id: `set-${idx}`,
    category: s.category === 'Isınma' ? 'Warmup' : s.category === 'Soğuma' ? 'Cool Down' : 'Main',
    reps: s.reps,
    distance: s.distance,
    stroke: s.stroke,
    intensityPercent: 70,
    restTimeFormatted: s.restSeconds > 0 ? `0:${s.restSeconds < 10 ? '0' : ''}${s.restSeconds}` : '0:30'
  }));

  const setsText = setsList.map((set, idx) => 
    `• [${set.category}] ${set.reps > 1 ? `${set.reps}x${set.distance}` : `${set.distance}`}m ${set.stroke} (Mola: ${set.restTimeFormatted})`
  ).join('\n');

  return `🏊‍♂️ OPEN WATER SWIMMER - YÜZME ANTRENMAN KARTI
------------------------------------------
📌 Antrenman: ${workout.title}
🏊 Havuz: ${workout.poolLength}m Olimpik | Seviye: ${workout.level}
📏 Toplam Mesafe: ${workout.totalDistance} Metre (${(workout.totalDistance / 1000).toFixed(1)} km)
⏱️ Tahmini Süre: ${workout.estimatedTimeMin} Dk

ANTRENMAN SETLERİ:
${setsText}
------------------------------------------
Open Water Swimmer Track & Workout App`;
};

export const exportWorkoutToPDF = async (workout: Workout): Promise<void> => {
  try {
    const htmlContent = generateWorkoutHTML(workout);

    // Tier 1: Try Print.printAsync (Opens native AirPrint / Android Print / Web Print dialog)
    try {
      await Print.printAsync({ html: htmlContent });
      return;
    } catch (printErr) {
      console.log('printAsync fallback:', printErr);
    }

    // Tier 2: Try Print.printToFileAsync + Share
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `${workout.title} - Havuz Antrenman PDF Kartı`
        });
        return;
      }
    } catch (fileErr) {
      console.log('printToFileAsync fallback:', fileErr);
    }

    // Tier 3: Ultimate Native Share text fallback
    const summaryText = generateWorkoutSummaryText(workout);
    const { Share } = require('react-native');
    await Share.share({
      title: `${workout.title} - Antrenman Kartı`,
      message: summaryText,
    });

  } catch (error: any) {
    console.error('PDF Export Error:', error);
    Alert.alert('Antrenman Kartı', generateWorkoutSummaryText(workout));
  }
};



