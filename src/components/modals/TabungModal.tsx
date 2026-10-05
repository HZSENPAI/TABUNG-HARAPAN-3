import React, { useState, useEffect } from 'react';
import { X, Check, Target, Sparkles } from 'lucide-react';
import { TabungIcon } from '../TabungIcon';
import { TabungItem } from '../../types';
import { parseAmount } from '../../utils/formatters';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface TabungModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: { nama: string; sasaran: number; jumlahDisimpan: number; catatan: string }) => void;
  editItem?: TabungItem | null;
}

export const TabungModal: React.FC<TabungModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
}) => {
  const [nama, setNama] = useState('');
  const [sasaran, setSasaran] = useState('');
  const [jumlahDisimpan, setJumlahDisimpan] = useState('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setNama(editItem.nama);
      setSasaran(editItem.sasaran > 0 ? editItem.sasaran.toString() : '');
      setJumlahDisimpan(editItem.jumlahDisimpan > 0 ? editItem.jumlahDisimpan.toString() : '');
      setCatatan(editItem.catatan || '');
    } else {
      setNama('');
      setSasaran('');
      setJumlahDisimpan('');
      setCatatan('');
    }
    setError('');
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Sila masukkan nama tabung');
      return;
    }
    const sasaranNum = parseAmount(sasaran);
    const disimpanNum = parseAmount(jumlahDisimpan);

    if (sasaranNum <= 0 && disimpanNum <= 0) {
      setError('Sila masukkan sekurang-kurangnya nilai sasaran atau jumlah disimpan');
      return;
    }

    playSuccessSound();
    onSave({
      nama: nama.trim(),
      sasaran: sasaranNum,
      jumlahDisimpan: disimpanNum,
      catatan: catatan.trim(),
    });
    onClose();
  };

  const calculatedPct = (() => {
    const s = parseAmount(sasaran);
    const d = parseAmount(jumlahDisimpan);
    if (s <= 0) return 0;
    return Math.min(100, Math.round((d / s) * 100));
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-rose-100/60 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <TabungIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {editItem ? 'Edit Tabung' : 'Tambah Tabung Baru'}
              </h3>
              <p className="text-xs text-rose-800">Simpanan Peribadi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Nama Tabung *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Simpanan Kecemasan, Hari Raya"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-stone-50/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Sasaran (RM)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-stone-400">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={sasaran}
                  onChange={(e) => setSasaran(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-stone-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Jumlah Disimpan (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-rose-500 font-bold">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={jumlahDisimpan}
                  onChange={(e) => setJumlahDisimpan(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-bold text-rose-950 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/30"
                />
              </div>
            </div>
          </div>

          {/* Quick Progress Preview */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-stone-500 font-medium">Peratus Sasaran</span>
              <span className="font-bold text-rose-600">{calculatedPct}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${calculatedPct}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
              * Nilai "Jumlah Disimpan" ini dikira terus ke dalam Baki Tabung Utama secara automatik.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Catatan (Pilihan)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Sasaran simpanan RM100 setiap bulan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-stone-50/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors min-h-[44px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
