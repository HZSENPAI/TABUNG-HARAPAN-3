import React, { useState } from 'react';
import { Database, Plus, Volume2, VolumeX, FolderArchive } from 'lucide-react';
import { TabungIcon } from './TabungIcon';
import { playTapSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface TopBarProps {
  onOpenApkModal: () => void;
  onOpenBackupModal: () => void;
  onOpenQuickDeposit: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenApkModal,
  onOpenBackupModal,
  onOpenQuickDeposit,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = !soundOn;
    setSoundEnabled(newState);
    setSoundOn(newState);
    if (newState) {
      playTapSound();
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-rose-100/80 px-4 py-2.5 flex items-center justify-between shadow-xs">
      {/* Brand Zone */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 text-white flex items-center justify-center shadow-xs shadow-rose-500/20">
          <TabungIcon className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-stone-900 leading-tight">
            TABUNG HARAPAN
          </h1>
          <p className="text-[10px] text-stone-400 font-medium leading-none">Simpanan Peribadi & Kad Kredit</p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-1.5">
        {/* Sound FX Toggle Button */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? 'Audio Diaktifkan (Tekan untuk senyapkan)' : 'Audio Dinyahaktifkan (Tekan untuk aktifkan)'}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
            soundOn
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
          }`}
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => {
            playTapSound();
            onOpenQuickDeposit();
          }}
          title="Simpan Duit Cepat"
          className="h-8 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold border border-rose-200/80 flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Simpan</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            onOpenApkModal();
          }}
          title="Muat Turun Fail Projek .ZIP & Binaan APK"
          className="h-8 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-rose-600/25 transition-all"
        >
          <FolderArchive className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>ZIP / APK</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            onOpenBackupModal();
          }}
          title="Tetapan & Sandaran Data"
          className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 flex items-center justify-center transition-all"
        >
          <Database className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

