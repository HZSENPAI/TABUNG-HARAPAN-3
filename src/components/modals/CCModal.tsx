import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { CCItem, CCProvider } from '../../types';
import { parseAmount } from '../../utils/formatters';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface CCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    provider: CCProvider;
    perkara: string;
    perluDisimpan: number;
    jumlahDisimpan: number;
    catatan: string;
  }) => void;
  editItem?: CCItem | null;
  defaultProvider?: CCProvider;
}

export const CCModal: React.FC<CCModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
  defaultProvider = 'maybank',
}) => {
  const [provider, setProvider] = useState<CCProvider>(defaultProvider);
  const [perkara, setPerkara] = useState('');
  const [perluDisimpan, setPerluDisimpan] = useState('');
  const [jumlahDisimpan, setJumlahDisimpan] = useState('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setProvider(editItem.provider);
      setPerkara(editItem.perkara);
      setPerluDisimpan(editItem.perluDisimpan > 0 ? editItem.perluDisimpan.toString() : '');
      setJumlahDisimpan(editItem.jumlahDisimpan > 0 ? editItem.jumlahDisimpan.toString() : '');
      setCatatan(editItem.catatan || '');
    } else {
      setProvider(defaultProvider);
      setPerkara('');
      setPerluDisimpan('');
      setJumlahDisimpan('');
      setCatatan('');
    }
    setError('');
  }, [editItem, defaultProvider, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perkara.trim()) {
      setError('Sila masukkan nama perkara');
      return;
    }
    const perluNum = parseAmount(perluDisimpan);
    const disimpanNum = parseAmount(jumlahDisimpan);

    playSuccessSound();
    onSave({
      provider,
      perkara: perkara.trim(),
      perluDisimpan: perluNum,
      jumlahDisimpan: disimpanNum,
      catatan: catatan.trim(),
    });
    onClose();
  };

  const isMaybank = provider === 'maybank';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isMaybank 
            ? 'bg-gradient-to-r from-amber-50 via-amber-100/50 to-yellow-50 border-amber-100' 
            : 'bg-gradient-to-r from-blue-50 via-blue-100/50 to-indigo-50 border-blue-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs ${
              isMaybank ? 'bg-amber-500' : 'bg-blue-600'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {editItem ? 'Edit Item Kad Kredit' : 'Tambah Item Kad Kredit'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {isMaybank ? 'Kategori: CC Maybank' : 'Kategori: CC Alliance'}
              </p>
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

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Penyedia Kad Kredit *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('maybank')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px] ${
                  isMaybank
                    ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                CC Maybank
              </button>
              <button
                type="button"
                onClick={() => setProvider('alliance')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px] ${
                  !isMaybank
                    ? 'border-blue-400 bg-blue-50 text-blue-900 ring-2 ring-blue-300'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                CC Alliance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Perkara *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bil Penyata Kad, Ansuran EzyPay"
              value={perkara}
              onChange={(e) => setPerkara(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-stone-50/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Perlu Disimpan (RM)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-stone-400">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={perluDisimpan}
                  onChange={(e) => setPerluDisimpan(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-stone-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Jumlah Disimpan (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-rose-600 font-bold">RM</span>
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

          {/* Logic rule helper banner */}
          <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-900 leading-relaxed">
              <strong>PENTING:</strong> Nilai <strong>Jumlah Disimpan</strong> ini akan ditambah terus ke dalam <strong>Baki Tabung</strong> secara masa nyata (real-time). Jika item ini diarkibkan, nilainya akan ditolak serta-merta.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Catatan (Pilihan)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Tarikh tutup penyata 15hb setiap bulan"
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
