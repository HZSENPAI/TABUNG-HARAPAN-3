import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  CheckCircle, 
  Smartphone, 
  Terminal, 
  Sparkles, 
  FolderArchive,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { generateAndroidZip } from '../../utils/apkGenerator';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logo' | 'online' | 'pwa' | 'panduan' | 'fail'>('logo');
  const [selectedFile, setSelectedFile] = useState<string>('README');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-xm5xoubl26wxhswsmiwzo4-507082799377.asia-southeast1.run.app';

  const handleCopyLink = () => {
    playTapSound();
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadLogo = (format: 'png' | 'svg') => {
    playSuccessSound();
    const link = document.createElement('a');
    if (format === 'png') {
      link.href = '/logo.png';
      link.download = 'logo_tabung_harapan_512x512.png';
    } else {
      link.href = '/icon.svg';
      link.download = 'logo_tabung_harapan.svg';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = async () => {
    try {
      playTapSound();
      setDownloading(true);
      const blob = await generateAndroidZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TabungHarapan_Android_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playSuccessSound();
    } catch (e) {
      console.error('Failed to generate zip', e);
      alert('Ralat semasa menjana fail zip projek.');
    } finally {
      setDownloading(false);
    }
  };

  const fileSnippets: Record<string, { title: string; lang: string; code: string }> = {
    README: {
      title: 'README-BUILD-APK.md',
      lang: 'markdown',
      code: `# TABUNG HARAPAN - PANDUAN BINA APK ANDROID

Aplikasi Android Native lengkap untuk Pengurusan Simpanan Peribadi dengan tema Material 3 Soft Pink / Rose.

- Nama Aplikasi: TABUNG HARAPAN
- Package Name: com.tabungharapan2026.app
- Output File: TabungHarapan.apk
- Database: Android Room Local SQLite (100% Offline, tanpa server)

## CARA BINA APK DALAM ANDROID STUDIO:
1. Buka Android Studio -> Open Project -> Pilih folder "TabungHarapan_Android_Project".
2. Tunggu Gradle sync selesai.
3. Klik menu: Build > Build Bundle(s) / APK(s) > Build APK(s).
   Fail APK siap dijana di: app/build/outputs/apk/debug/app-debug.apk!`
    },
    Workflow: {
      title: '.github/workflows/build-apk.yml',
      lang: 'yaml',
      code: `name: Build Android APK
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - uses: android-actions/setup-android@v3
      - run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: TabungHarapan-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk`
    },
    MainActivity: {
      title: 'MainActivity.kt',
      lang: 'kotlin',
      code: `package com.tabungharapan2026.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.tabungharapan2026.app.ui.screens.MainAppScreen
import com.tabungharapan2026.app.ui.theme.TabungHarapanTheme
import com.tabungharapan2026.app.viewmodel.TabungViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: TabungViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TabungHarapanTheme {
                MainAppScreen(viewModel = viewModel)
            }
        }
    }
}`
    },
    Themes: {
      title: 'res/values/themes.xml',
      lang: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.TabungHarapan2026" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FFF5F6</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>`
    },
    RoomDB: {
      title: 'AppDatabase.kt (Room Offline DB)',
      lang: 'kotlin',
      code: `@Database(entities = [TabungEntity::class, CCEntity::class, TransaksiEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun tabungDao(): TabungDao
    abstract fun ccDao(): CCDao
    abstract fun transaksiDao(): TransaksiDao
}`
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shadow-xs">
              <FolderArchive className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pusat Muat Turun ZIP & APK Tabung Harapan</h3>
              <p className="text-xs text-rose-100">Fail Projek ZIP, Logo & Panduan Binaan APK</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALWAYS-VISIBLE PROMINENT ZIP DOWNLOAD BANNER */}
        <div className="px-6 pt-4 pb-2 bg-gradient-to-b from-rose-50/70 to-white border-b border-rose-100">
          <div className="p-4 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 rounded-2xl text-white shadow-lg shadow-rose-600/25 flex flex-col sm:flex-row items-center justify-between gap-3 border border-rose-300/30">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <FolderArchive className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Fail Projek Penuh (.ZIP)</span>
                  <span className="px-2 py-0.5 bg-white/25 rounded-full text-[10px] font-bold text-rose-50 uppercase tracking-wide">
                    Sedia Dimuat Turun
                  </span>
                </div>
                <p className="text-xs text-rose-100 mt-0.5">
                  Lengkap: Android Studio, themes.xml, fail logo PNG/SVG & Room Local DB
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-rose-50 active:scale-95 text-rose-700 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm shrink-0 min-h-[46px]"
            >
              <Download className="w-4 h-4 text-rose-600 stroke-[2.5]" />
              <span>{downloading ? 'Sedang Menjana ZIP...' : 'MUAT TURUN .ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('fail');
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'fail'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-rose-600" />
            <span>Fail Kod Sumber (.ZIP)</span>
          </button>
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('logo');
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logo'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Gambar Logo Rasmi</span>
          </button>
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('online');
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'online'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Jana APK Online</span>
          </button>
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('pwa');
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Pasang di Telefon
          </button>
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('panduan');
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'panduan'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Android Studio & GitHub
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB: LOGO RASMI */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50/40 rounded-3xl border border-rose-200/80 flex flex-col sm:flex-row items-center gap-5">
                {/* Logo Preview */}
                <div className="relative group shrink-0">
                  <img
                    src="/logo.png"
                    alt="Logo Tabung Harapan"
                    className="w-28 h-28 rounded-2xl shadow-lg border-2 border-white object-cover bg-rose-500"
                  />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold rounded-full shadow-xs">
                    512x512
                  </span>
                </div>

                {/* Logo Details & Download */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left">
                  <div>
                    <h4 className="text-base font-extrabold text-stone-900 leading-tight">
                      Logo Rasmi Tabung Harapan
                    </h4>
                    <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                      Ikon balang tabung simpanan moden bertema Soft Pink & Emas. Sedia digunakan untuk binaan APK, ikon pelancar (*launcher icon*), atau Google Play Store.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                    <button
                      onClick={() => handleDownloadLogo('png')}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Muat Turun PNG (512x512)</span>
                    </button>
                    <button
                      onClick={() => handleDownloadLogo('svg')}
                      className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Muat Turun SVG</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Guide for using the logo */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-[11px] text-stone-600 leading-relaxed">
                <h5 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Cara Menggunakan Fail Logo Ini:
                </h5>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>PWABuilder / Online APK:</strong> Apabila menjana APK di PWABuilder, muat naik fail <code>logo_tabung_harapan_512x512.png</code> ini di bahagian <em>App Icon</em>.</li>
                  <li><strong>Android Studio:</strong> Klik kanan folder <code>res</code> &gt; <strong>New &gt; Image Asset</strong> &gt; pilih fail <code>logo.png</code> sebagai ikon pelancar.</li>
                  <li><strong>Fail Projek ZIP:</strong> Fail ikon ini telah siap diletakkan di dalam folder <code>res/mipmap</code> pada projek ZIP yang dimuat turun!</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB: ONLINE GENERATOR (PWABuilder) */}
          {activeTab === 'online' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Jana APK Menggunakan PWABuilder (30 Saat)</h4>
                    <p className="text-[11px] text-stone-500">Kaedah rasmi Microsoft & Google untuk membina APK Android tanpa memasang software.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-semibold text-stone-700">Langkah 1: Salin URL Aplikasi Anda:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentAppUrl}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono text-stone-700 truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0 min-h-[38px] active:scale-95"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Disalin!' : 'Salin URL'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-stone-600 leading-relaxed text-[11px]">
                  <div><strong>Langkah 2:</strong> Buka laman web percuma <strong>PWABuilder.com</strong>:</div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={playTapSound}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    <span>Buka PWABuilder.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="mt-2">
                    <strong>Langkah 3:</strong> Tampal (paste) link di atas ke dalam kotak PWABuilder, kemudian tekan <strong>"Start"</strong> &gt; <strong>"Package for Android"</strong> &gt; <strong>"Generate APK"</strong>.
                  </div>
                  <div>Fail <code>TabungHarapan.apk</code> akan dimuat turun ke komputer atau telefon anda!</div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-600 leading-relaxed text-[11px]">
                💡 <strong>Kelebihan:</strong> Fail APK yang dihasilkan boleh dipasang pada mana-mana telefon Android dan akan membuka aplikasi Tabung Harapan secara bersendirian (standalone) lengkap dengan ikon Soft Pink dan simpanan data tempatan.
              </div>
            </div>
          )}

          {/* TAB: PWA WebAPK */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm text-emerald-950">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Pemasangan Terus ke Telefon Android (Tanpa Muat Turun APK Manual)
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Telefon Android terkini membolehkan aplikasi dipasang terus ke skrin telefon sebagai <strong>WebAPK</strong> rasmi melalui Google Play Services!
                </p>
              </div>

              <div className="space-y-3 text-stone-700">
                <div className="font-bold text-stone-900">Langkah Pasang pada Telefon Anda:</div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p className="text-stone-600 text-[11px]">Buka pautan aplikasi ini menggunakan pelayar <strong>Google Chrome</strong> di telefon Android anda.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p className="text-stone-600 text-[11px]">Tekan butang menu 3 titik <strong>(⋮)</strong> di penjuru atas kanan pelayar Chrome.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p className="text-stone-600 text-[11px]">Pilih <strong>"Add to Home screen"</strong> atau <strong>"Install app"</strong>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <p className="text-stone-600 text-[11px]">Selesai! Ikon <strong>Tabung Harapan</strong> akan muncul pada skrin utama telefon anda, dibuka tanpa URL bar dan berfungsi 100% offline.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANDROID STUDIO & GITHUB ACTIONS */}
          {activeTab === 'panduan' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  Kaedah Android Studio (Di Komputer)
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-600 text-[11px]">
                  <li>Muat turun fail projek zip di tab "Kod Sumber & ZIP".</li>
                  <li>Buka <strong>Android Studio</strong> dan pilih <strong>Open Project</strong> pada folder <code>android</code>.</li>
                  <li>Klik menu: <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</li>
                  <li>Fail APK siap di: <code>app/build/outputs/apk/debug/app-debug.apk</code>.</li>
                </ol>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-rose-600" />
                    Kaedah GitHub Actions (Bina APK Percuma di Cloud Tanpa Install Android Studio)
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                    Disyorkan
                  </span>
                </div>

                <p className="text-stone-600 leading-relaxed text-[11px]">
                  GitHub menyediakan server Linux percuma yang akan kompil kod Kotlin dan hasilkan fail <code>TabungHarapan.apk</code> secara automatik:
                </p>

                <div className="space-y-2 text-[11px] text-stone-700">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">Langkah 1: Cipta Repository di GitHub</div>
                    <p className="text-stone-500 text-[10px]">
                      Buka <strong>github.com/new</strong> dan cipta satu repository baharu (cth: <code>tabung-harapan</code>).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">Langkah 2: Muat Naik Fail Projek (.ZIP)</div>
                    <p className="text-stone-500 text-[10px]">
                      Ekstrak fail <code>TabungHarapan_Android_Project.zip</code> di komputer anda. Muat naik semua fail ke repository GitHub anda (termasuk folder <code>.github/workflows</code>).
                    </p>
                    <div className="p-2 bg-stone-900 text-rose-200 font-mono text-[10px] rounded-lg mt-1 overflow-x-auto">
                      git init<br/>
                      git add .<br/>
                      git commit -m "Tabung Harapan APK"<br/>
                      git branch -M main<br/>
                      git remote add origin https://github.com/USERNAME/tabung-harapan.git<br/>
                      git push -u origin main
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">Langkah 3: Tunggu GitHub Actions Selesai (~2 Minit)</div>
                    <p className="text-stone-500 text-[10px]">
                      Klik tab <strong>"Actions"</strong> di menu atas repository GitHub anda. Anda akan melihat proses binaan <strong>"Build Android APK"</strong> berjalan dengan status ikon kuning (sedang proses) bertukar ke hijau (selesai).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-950">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Langkah 4: Muat Turun Fail TabungHarapan-APK
                    </div>
                    <p className="text-emerald-800 text-[10px]">
                      Klik pada nama binaan yang selesai &gt; tatal ke bahagian bawah <strong>"Artifacts"</strong> &gt; klik <strong>TabungHarapan-APK</strong> untuk muat turun fail APK terus ke telefon atau komputer anda!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAIL SOURCE & ZIP */}
          {activeTab === 'fail' && (
            <div className="space-y-3">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-950 text-sm">Muat Turun Fail Projek Lengkap (ZIP)</div>
                  <p className="text-rose-700 text-xs mt-0.5">
                    Termasuk themes.xml, fail logo mipmap, Room Database, & Compose UI.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0 min-h-[44px]"
                >
                  <FolderArchive className="w-4 h-4" />
                  {downloading ? 'Menjana...' : 'Muat Turun .ZIP'}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Object.keys(fileSnippets).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      playTapSound();
                      setSelectedFile(key);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedFile === key
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {fileSnippets[key].title}
                  </button>
                ))}
              </div>

              <div className="bg-stone-900 text-rose-100 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-[260px] leading-relaxed border border-stone-800">
                <pre>{fileSnippets[selectedFile]?.code}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">TABUNG HARAPAN • com.tabungharapan2026.app</span>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
