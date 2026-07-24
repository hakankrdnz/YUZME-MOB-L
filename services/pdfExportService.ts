import { Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Workout } from '../types/swimming';

export const generateWorkoutHTML = (workout: Workout): string => {
  const setsRows = workout.sets.map((set, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#1E293B' : '#0F172A'};">
      <td style="padding: 10px; border-bottom: 1px solid #334155; font-weight: bold; color: #38BDF8;">Set ${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; color: #F8FAFC;">${set.category}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; color: #FACC15; font-weight: bold;">${set.reps} × ${set.distance}m</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; color: #F8FAFC;">${set.stroke}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; color: #94A3B8;">${set.restSeconds > 0 ? `${set.restSeconds} sn` : '-'}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${workout.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #070C16;
            color: #F8FAFC;
            padding: 30px;
            margin: 0;
          }
          .card-header {
            border-bottom: 2px solid #FACC15;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .title {
            color: #FACC15;
            font-size: 26px;
            font-weight: 900;
            margin: 0 0 6px 0;
          }
          .subtitle {
            color: #38BDF8;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .meta-grid {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
            background: #0F172A;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #1E293B;
          }
          .meta-item {
            flex: 1;
          }
          .meta-label {
            color: #64748B;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .meta-value {
            color: #F8FAFC;
            font-size: 16px;
            font-weight: bold;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background-color: #0F172A;
            color: #94A3B8;
            text-align: left;
            padding: 12px 10px;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 2px solid #1E293B;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #64748B;
            font-size: 12px;
            border-top: 1px solid #1E293B;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="card-header">
          <div class="subtitle">OPEN WATER SWIMMER • HAVUZ KART (50M OLİMPİK)</div>
          <h1 class="title">${workout.title}</h1>
          <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">${workout.description}</p>
        </div>


        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">TOPLAM MESAFE</div>
            <div class="meta-value">${workout.totalDistance}m (${(workout.totalDistance / 1000).toFixed(1)} km)</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">TAHMİNİ SÜRE</div>
            <div class="meta-value">${workout.estimatedTimeMin} dakika</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">HAVUZ KULVARI</div>
            <div class="meta-value">${workout.poolLength}m Havuz</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">SEVİYE</div>
            <div class="meta-value">${workout.level}</div>
          </div>
        </div>

        <h3 style="color: #F8FAFC; margin-bottom: 5px;">Antrenman Set Programı</h3>
        <table>
          <thead>
            <tr>
              <th>Set #</th>
              <th>Kategori</th>
              <th>Tekrar x Mesafe</th>
              <th>Yüzme Stili</th>
              <th>Mola</th>
            </tr>
          </thead>
          <tbody>
            ${setsRows}
          </tbody>
        </table>

        <div class="footer">
          Open Water Dragos Swim Tracker & Workout App • ${new Date().toLocaleDateString('tr-TR')}
        </div>
      </body>
    </html>
  `;
};

export const exportWorkoutToPDF = async (workout: Workout): Promise<void> => {
  try {
    const htmlContent = generateWorkoutHTML(workout);
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `${workout.title} - Havuz Antrenman PDF Kartı`
      });
    } else {
      Alert.alert('PDF Oluşturuldu', `PDF dosyası oluşturuldu:\n${uri}`);
    }
  } catch (error) {
    Alert.alert('Hata', 'PDF antrenman kartı oluşturulurken bir sorun oluştu.');
  }
};

