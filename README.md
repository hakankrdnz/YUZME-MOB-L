# 🏊‍♂️ Yüzme Antrenmanı (Swim Tracker & Workout App)

React Native ve Expo Router ile geliştirilmiş, yüzücüler için özel antrenman şablonları, canlı set takibi ve performans istatistikleri sunan mobil uygulama.

---

## 🚀 Özellikler

- 🏊 **Gelişmiş Antrenman Kütüphanesi**: Başlangıç, Orta ve İleri seviyeler için 25m ve 50m havuzlara uygun yüzme programları.
- ⏱️ **Canlı Antrenman Modu**: Havuz kenarında büyük, kolay basılabilir butonlarla set ve tekrar (rep) takibi.
- ⏳ **Görsel Dinlenme Sayacı**: Set aralarında otomatik geri sayım sayacı.
- 🛠️ **Özel Antrenman Oluşturucu**: Isınma, Ana Set ve Soğuma bölümlerini (Serbest, Sırtüstü, Kurbağa, Kelebek, Drill) özel mesafe ve tekrarlarla tasarlama.
- 📊 **Geçmiş & İstatistikler**: Tamamlanan antrenmanların geçmiş kaydı, toplam mesafe ve süre analizi.

---

## 🛠️ Kurulum & Yerelde Çalıştırma

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm start
   ```

---

## 📱 Apple App Store ve Google Play Store'da Yayınlama Rehberi (EAS Build)

Uygulamanızı marketlerde indirilmeye sunmak için Expo'nun resmi yapılandırma aracı **EAS (Expo Application Services)** kullanılır:

### 1. Expo ve EAS CLI Hazırlığı
- [expo.dev](https://expo.dev) adresinden ücretsiz bir üyelik oluşturun.
- Bilgisayarınızda EAS CLI aracını kurun ve giriş yapın:
  ```bash
  npm install -g eas-cli
  eas login
  ```

### 2. Projede EAS Yapılandırması
Proje klasöründe aşağıdaki komutla EAS projesini başlatın:
```bash
eas build:configure
```

### 3. Google Play Store (Android) için Paket (.aab) Oluşturma
1. Google Play Console geliştirici hesabı oluşturun (Tek seferlik $25).
2. Android uygulaması için üretim paketini oluşturun:
   ```bash
   eas build --platform android --profile production
   ```
3. Oluşan `.aab` dosyasını Google Play Console ekranına yükleyin.

### 4. Apple App Store (iOS) için Paket (.ipa) Oluşturma
1. Apple Developer hesabı edinin ($99/yıl).
2. iOS uygulaması için üretim paketini oluşturun:
   ```bash
   eas build --platform ios --profile production
   ```
3. EAS otomatik olarak Apple sertifikalarınızı doğrular veya tek komutla doğrudan yayınlar:
   ```bash
   eas submit --platform ios
   ```
