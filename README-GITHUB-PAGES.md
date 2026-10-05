# TABUNG HARAPAN 2026

Versi web/PWA untuk dipasang pada telefon Android tanpa APK.

## GitHub Pages

1. Buat repository GitHub dan upload semua fail projek ini ke branch `main`.
2. Buka **Settings → Pages**.
3. Di **Build and deployment**, pilih **GitHub Actions**.
4. Push/commit ke `main`. Workflow `Deploy Tabung Harapan to GitHub Pages` akan build dan publish aplikasi.
5. Selepas workflow selesai, buka URL Pages yang diberikan GitHub menggunakan Chrome Android.
6. Pilih **Install app** atau **Add to Home screen**.

Aplikasi ini sudah dikonfigurasi untuk GitHub Pages project URL (relative base), termasuk manifest dan service worker PWA.

## Nota

- Folder `android/` dan workflow `build-apk.yml` dikekalkan untuk pilihan APK pada masa depan.
- Untuk penggunaan PWA sahaja, APK tidak diperlukan.
