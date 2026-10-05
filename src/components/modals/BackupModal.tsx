import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, Trash2, Database, Check, AlertTriangle } from 'lucide-react';
import { useTabung } from '../../context/TabungContext';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJSON, importDataJSON, resetDataToDefault, clearAllData } = useTabung();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TabungHarapan2026_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Tetapkan semula kepada data contoh awal (Tabung: RM1,313.80, MB: RM300, AL: RM200 = RM1,813.80)?')) {
      resetDataToDefault();
      onClose();
    }
  };

  const handleClear = () => {
    clearAllData();
    setConfirmClear(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-rose-100/50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Tetapan & Sandaran Data</h3>
              <p className="text-xs text-rose-700">Storan Tempatan (Offline Local Storage)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Semua data disimpan secara selamat di dalam storan peranti anda tanpa memerlukan sambungan internet atau pelayan luar. Anda boleh mengeksport fail sandaran pada bila-bila masa.
          </p>

          <div className="space-y-2.5">
            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-rose-50/60 border border-stone-200/80 text-left flex items-center justify-between group transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Eksport Sandaran (JSON)</div>
                  <div className="text-[11px] text-stone-500">Simpan fail sandaran ke memori peranti</div>
                </div>
              </div>
            </button>

            {/* Import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-rose-50/60 border border-stone-200/80 text-left flex items-center justify-between group transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Import Sandaran (JSON)</div>
                  <div className="text-[11px] text-stone-500">Pulihkan data daripada fail sandaran</div>
                </div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Reset to Default */}
            <button
              onClick={handleReset}
              className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 text-left flex items-center justify-between group transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Tetapkan Semula Data Contoh</div>
                  <div className="text-[11px] text-stone-500">Kembalikan data Tabung: RM1,313.80, CC: RM500</div>
                </div>
              </div>
            </button>

            {/* Clear All */}
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-rose-50 border border-stone-200/80 text-left flex items-center justify-between group transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-700">Kosongkan Semua Data</div>
                    <div className="text-[11px] text-stone-500">Padam semua rekod tabung, kad & transaksi</div>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  Pasti untuk padam semua data?
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-1.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl"
                  >
                    Ya, Padam Semua
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
