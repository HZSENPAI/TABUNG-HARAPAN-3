# TABUNG HARAPAN 2026 - PANDUAN BINA APK ANDROID

Aplikasi Android Native lengkap untuk Pengurusan Simpanan Peribadi dengan tema **Material 3 Soft Pink / Rose Premium**.

- **Nama Aplikasi**: TABUNG HARAPAN 2026
- **Package Name**: `com.tabungharapan2026.app`
- **Output File**: `TabungHarapan2026.apk`
- **Penyimpanan Data**: Android Room Local Database (SQLite offline, tanpa server, data kekal)

---

## CARA MEMBINA APK (3 LANGKAH MUDAH)

### KAEDAH 1: Menggunakan Android Studio (Disyorkan)
1. Muat turun fail projek ini (atau klik butang **"Muat Turun Projek Android APK (ZIP)"** dalam aplikasi web).
2. Ekstrak folder projek `android` ke komputer anda.
3. Buka **Android Studio**:
   - Pilih **Open Project**, kemudian pilih folder `android`.
   - Tunggu Gradle selesai membuat sync (selalunya 1–2 minit).
4. Untuk bina APK:
   - Pada menu atas Android Studio, klik:
     **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
5. Selepas siap, notifikasi akan keluar: *"APK(s) generated successfully"*.
   - Klik **locate** untuk mendapatkan fail:
     `app/build/outputs/apk/debug/app-debug.apk` (namakan semula kepada `TabungHarapan2026.apk`).
6. Pindahkan fail `.apk` ke telefon Android anda dan pasang terus!

---

### KAEDAH 2: Menggunakan Terminal / Command Line
Pastikan anda mempunyai JDK 17 atau ke atas:

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

Fail APK yang dihasilkan akan berada di:
`app/build/outputs/apk/debug/app-debug.apk`

Untuk binaan release:
```bash
./gradlew assembleRelease
```

---

### KAEDAH 3: Pemasangan Segera Web APK / PWA (Tanpa Perlu Komputer)
Aplikasi ini turut dilengkapi dengan sokongan PWA (Progressive Web App):
1. Buka pautan aplikasi ini dalam pelayar **Google Chrome** pada telefon Android anda.
2. Tekan menu 3 titik di bucu atas kanan Chrome, atau tekan butang **"Pasang Aplikasi / Install"** di bar atas.
3. Pilih **"Add to Home screen"** / **"Install App"**.
4. Ikon "Tabung 2026" akan muncul di skrin utama telefon anda, dibuka secara bersendirian (standalone) tanpa bar pelayar, dan berfungsi 100% secara offline!

---

## LOGIK PENGIRAAN BAKI TABUNG

```
BAKI TABUNG =
  Jumlah Simpanan Tabung Aktif
  + Jumlah Disimpan CC Maybank Aktif
  + Jumlah Disimpan CC Alliance Aktif
```

- Semua perubahan nilai akan mengira semula baki tabung secara masa nyata (real-time).
- Item yang diarkibkan **tidak dikira** dalam Baki Tabung.
- Item yang dipulihkan (restore) akan dimasukkan semula secara automatik.
- Tiada double-counting berlaku antara Tabung dan Transaksi.
