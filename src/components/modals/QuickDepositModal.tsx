import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle2, Sparkles, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTabung } from '../../context/TabungContext';
import { formatCurrency, parseAmount } from '../../utils/formatters';
import { playTapSound, playCoinSound, playSuccessSound } from '../../utils/audio';

interface QuickDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedType?: 'tabung' | 'maybank' | 'alliance';
  preselectedId?: string;
}

export const QuickDepositModal: React.FC<QuickDepositModalProps> = ({
  isOpen,
  onClose,
  preselectedType = 'tabung',
  preselectedId,
}) => {
  const { tabungList, ccList, updateTabung, updateCCItem, addTransaksi } = useTabung();

  const [category, setCategory] = useState<'tabung' | 'maybank' | 'alliance'>(preselectedType);
  const [selectedId, setSelectedId] = useState<string>(preselectedId || '');
  const [mode, setMode] = useState<'add' | 'set'>('add'); // add to current or set exact
  const [amount, setAmount] = useState('');
  const [recordTx, setRecordTx] = useState(true);

  useEffect(() => {
    setCategory(preselectedType);
    if (preselectedId) {
      setSelectedId(preselectedId);
    } else {
      if (preselectedType === 'tabung') {
        setSelectedId(tabungList.find(t => t.status === 'active')?.id || '');
      } else {
        setSelectedId(ccList.find(c => c.provider === preselectedType && c.status === 'active')?.id || '');
      }
    }
    setAmount('');
  }, [preselectedType, preselectedId, isOpen, tabungList, ccList]);

  if (!isOpen) return null;

  const activeTabungs = tabungList.filter(t => t.status === 'active');
  const activeMaybanks = ccList.filter(c => c.provider === 'maybank' && c.status === 'active');
  const activeAlliances = ccList.filter(c => c.provider === 'alliance' && c.status === 'active');

  const selectedItem = (() => {
    if (category === 'tabung') return activeTabungs.find(t => t.id === selectedId);
    return ccList.find(c => c.id === selectedId);
  })();

  const currentSaved = selectedItem ? Number(selectedItem.jumlahDisimpan) || 0 : 0;
  const inputNum = parseAmount(amount);
  const newProjected = mode === 'add' ? currentSaved + inputNum : inputNum;

  const handleQuickAddPreset = (val: number) => {
    playCoinSound();
    if (mode === 'add') {
      const cur = parseAmount(amount);
      setAmount((cur + val).toString());
    } else {
      setAmount((currentSaved + val).toString());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || inputNum <= 0) return;

    playSuccessSound();

    if (category === 'tabung') {
      const t = tabungList.find(x => x.id === selectedId);
      if (t) {
        updateTabung(selectedId, { jumlahDisimpan: newProjected });
        if (recordTx) {
          const diff = mode === 'add' ? inputNum : newProjected - currentSaved;
          if (diff !== 0) {
            addTransaksi({
              tarikh: new Date().toISOString().split('T')[0],
              nama: `Simpanan ${t.nama}`,
              kategori: 'tabung',
              targetId: selectedId,
              jumlah: Math.abs(diff),
              jenis: diff >= 0 ? 'simpan' : 'keluar',
              catatan: 'Kemaskini cepat simpanan',
            });
          }
        }
      }
    } else {
      const c = ccList.find(x => x.id === selectedId);
      if (c) {
        updateCCItem(selectedId, { jumlahDisimpan: newProjected });
        if (recordTx) {
          const diff = mode === 'add' ? inputNum : newProjected - currentSaved;
          if (diff !== 0) {
            addTransaksi({
              tarikh: new Date().toISOString().split('T')[0],
              nama: `Simpanan ${c.perkara}`,
              kategori: c.provider,
              targetId: selectedId,
              jumlah: Math.abs(diff),
              jenis: diff >= 0 ? 'simpan' : 'keluar',
              catatan: 'Kemaskini cepat simpanan CC',
            });
          }
        }
      }
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fb7185', '#f43f5e', '#e11d48', '#facc15'],
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Simpan Duit Cepat</h3>
              <p className="text-xs text-rose-100">Kemaskini Simpanan & Baki Tabung</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Category Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setCategory('tabung');
                setSelectedId(activeTabungs[0]?.id || '');
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                category === 'tabung' ? 'bg-white text-rose-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tabung
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('maybank');
                setSelectedId(activeMaybanks[0]?.id || '');
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                category === 'maybank' ? 'bg-white text-amber-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              CC Maybank
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('alliance');
                setSelectedId(activeAlliances[0]?.id || '');
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                category === 'alliance' ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              CC Alliance
            </button>
          </div>

          {/* Select Target */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Pilih Item Sasaran *
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-stone-50"
            >
              {category === 'tabung' &&
                activeTabungs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} (Terkini: {formatCurrency(t.jumlahDisimpan)})
                  </option>
                ))}
              {category === 'maybank' &&
                activeMaybanks.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.perkara} (Terkini: {formatCurrency(c.jumlahDisimpan)})
                  </option>
                ))}
              {category === 'alliance' &&
                activeAlliances.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.perkara} (Terkini: {formatCurrency(c.jumlahDisimpan)})
                  </option>
                ))}
            </select>
          </div>

          {/* Mode Switch: Tambah vs Tetapkan */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                mode === 'add'
                  ? 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-200'
                  : 'border-stone-200 text-stone-600'
              }`}
            >
              + Tambah Simpanan
            </button>
            <button
              type="button"
              onClick={() => setMode('set')}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                mode === 'set'
                  ? 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-200'
                  : 'border-stone-200 text-stone-600'
              }`}
            >
              Tetapkan Nilai Baru
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {mode === 'add' ? 'Jumlah Tambahan (RM) *' : 'Jumlah Disimpan Baru (RM) *'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm font-bold text-rose-600">RM</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 text-lg font-bold rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20 text-stone-900"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2">
            {[10, 50, 100, 200, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAddPreset(val)}
                className="flex-1 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-semibold rounded-lg transition-colors border border-stone-200/60"
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Projection Preview */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="flex justify-between text-xs text-stone-500">
              <span>Baki Semasa Item:</span>
              <span className="font-semibold text-stone-800">{formatCurrency(currentSaved)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-rose-600 pt-1 border-t border-stone-200">
              <span>Baki Baru Selepas Simpan:</span>
              <span>{formatCurrency(newProjected)}</span>
            </div>
          </div>

          {/* Record to transaksi log */}
          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={recordTx}
              onChange={(e) => setRecordTx(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-400"
            />
            <span>Rekod juga dalam log Transaksi</span>
          </label>

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
              disabled={!selectedId || inputNum <= 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Sahkan Simpanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
