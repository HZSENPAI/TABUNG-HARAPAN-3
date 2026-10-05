import React, { useState, useEffect } from 'react';
import { X, Check, ReceiptText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { TransaksiItem, TransaksiJenis, TransaksiKategori } from '../../types';
import { getTodayDateString, parseAmount } from '../../utils/formatters';
import { useTabung } from '../../context/TabungContext';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface TransaksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    item: {
      tarikh: string;
      nama: string;
      kategori: TransaksiKategori;
      targetId?: string;
      jumlah: number;
      jenis: TransaksiJenis;
      catatan: string;
    },
    syncWithTarget?: boolean
  ) => void;
  editItem?: TransaksiItem | null;
}

export const TransaksiModal: React.FC<TransaksiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
}) => {
  const { tabungList, ccList } = useTabung();
  const [tarikh, setTarikh] = useState(getTodayDateString());
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<TransaksiKategori>('tabung');
  const [targetId, setTargetId] = useState<string>('');
  const [jumlah, setJumlah] = useState('');
  const [jenis, setJenis] = useState<TransaksiJenis>('simpan');
  const [syncWithTarget, setSyncWithTarget] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setTarikh(editItem.tarikh);
      setNama(editItem.nama);
      setKategori(editItem.kategori);
      setTargetId(editItem.targetId || '');
      setJumlah(editItem.jumlah > 0 ? editItem.jumlah.toString() : '');
      setJenis(editItem.jenis);
      setCatatan(editItem.catatan || '');
      setSyncWithTarget(false);
    } else {
      setTarikh(getTodayDateString());
      setNama('');
      setKategori('tabung');
      setTargetId(tabungList[0]?.id || '');
      setJumlah('');
      setJenis('simpan');
      setCatatan('');
      setSyncWithTarget(false);
    }
    setError('');
  }, [editItem, isOpen, tabungList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Sila masukkan penerangan transaksi');
      return;
    }
    const jumlahNum = parseAmount(jumlah);
    if (jumlahNum <= 0) {
      setError('Sila masukkan jumlah yang sah');
      return;
    }

    playSuccessSound();
    onSave(
      {
        tarikh,
        nama: nama.trim(),
        kategori,
        targetId: targetId || undefined,
        jumlah: jumlahNum,
        jenis,
        catatan: catatan.trim(),
      },
      !editItem ? syncWithTarget : false
    );
    onClose();
  };

  const activeTabungs = tabungList.filter(t => t.status === 'active');
  const activeMaybanks = ccList.filter(c => c.provider === 'maybank' && c.status === 'active');
  const activeAlliances = ccList.filter(c => c.provider === 'alliance' && c.status === 'active');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-rose-100/50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {editItem ? 'Edit Transaksi' : 'Rekod Transaksi'}
              </h3>
              <p className="text-xs text-rose-700">Log Aliran Tunai & Simpanan</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {error}
            </div>
          )}

          {/* Jenis Transaksi: Simpan vs Keluar */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Jenis Aliran *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJenis('simpan')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                  jenis === 'simpan'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                Simpan (+)
              </button>
              <button
                type="button"
                onClick={() => setJenis('keluar')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                  jenis === 'keluar'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                Keluar (-)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tarikh *
              </label>
              <input
                type="date"
                required
                value={tarikh}
                onChange={(e) => setTarikh(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Jumlah (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-stone-400">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-bold rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20 text-stone-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Penerangan / Nama Transaksi *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Simpanan gaji, Bayaran bil CC"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50/50"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Kategori
            </label>
            <select
              value={kategori}
              onChange={(e) => {
                const k = e.target.value as TransaksiKategori;
                setKategori(k);
                if (k === 'tabung') setTargetId(activeTabungs[0]?.id || '');
                else if (k === 'maybank') setTargetId(activeMaybanks[0]?.id || '');
                else if (k === 'alliance') setTargetId(activeAlliances[0]?.id || '');
                else setTargetId('');
              }}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50/50"
            >
              <option value="tabung">Simpanan Tabung</option>
              <option value="maybank">CC Maybank</option>
              <option value="alliance">CC Alliance</option>
              <option value="umum">Lain-lain / Umum</option>
            </select>
          </div>

          {/* Target link if applicable */}
          {kategori !== 'umum' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Pilih Item Sasaran
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50/50"
              >
                <option value="">-- Tiada kaitan spesifik --</option>
                {kategori === 'tabung' &&
                  activeTabungs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama} (Semasa: RM {t.jumlahDisimpan.toFixed(2)})
                    </option>
                  ))}
                {kategori === 'maybank' &&
                  activeMaybanks.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.perkara} (Semasa: RM {c.jumlahDisimpan.toFixed(2)})
                    </option>
                  ))}
                {kategori === 'alliance' &&
                  activeAlliances.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.perkara} (Semasa: RM {c.jumlahDisimpan.toFixed(2)})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Sync toggle */}
          {!editItem && targetId && (
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={syncWithTarget}
                onChange={(e) => setSyncWithTarget(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-400 w-4 h-4"
              />
              <span className="text-[11px] text-stone-600 leading-snug">
                <strong>Kemaskini automatik:</strong> Laras nilai "Jumlah Disimpan" pada item sasaran di atas secara automatik (+/- mengikut jenis aliran).
              </span>
            </label>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Catatan (Pilihan)
            </label>
            <textarea
              rows={2}
              placeholder="Catatan tambahan..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50/50 resize-none"
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
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
