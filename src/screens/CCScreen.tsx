import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Coins, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useTabung } from '../context/TabungContext';
import { CCItem, CCProvider } from '../types';
import { formatCurrency } from '../utils/formatters';
import { playTapSound, playCoinSound, playDeleteSound } from '../utils/audio';

interface CCScreenProps {
  initialProvider?: string;
  onOpenAddModal: (provider: CCProvider) => void;
  onOpenEditModal: (item: CCItem) => void;
  onOpenQuickDepositWithItem: (provider: CCProvider, id: string) => void;
}

export const CCScreen: React.FC<CCScreenProps> = ({
  initialProvider = 'maybank',
  onOpenAddModal,
  onOpenEditModal,
  onOpenQuickDepositWithItem,
}) => {
  const { ccList, archiveCCItem, restoreCCItem, deleteCCItem, calculations } = useTabung();
  const [provider, setProvider] = useState<CCProvider>(
    initialProvider === 'alliance' ? 'alliance' : 'maybank'
  );
  const [filter, setFilter] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    if (initialProvider === 'alliance' || initialProvider === 'maybank') {
      setProvider(initialProvider);
    }
  }, [initialProvider]);

  const currentProviderList = ccList.filter(
    (c) => c.provider === provider && c.status === filter
  );

  const activeCount = ccList.filter((c) => c.provider === provider && c.status === 'active').length;
  const archivedCount = ccList.filter((c) => c.provider === provider && c.status === 'archived').length;

  const isMaybank = provider === 'maybank';
  const savedForCurrent = isMaybank ? calculations.activeMaybankSaved : calculations.activeAllianceSaved;
  const neededForCurrent = isMaybank ? calculations.totalMaybankNeeded : calculations.totalAllianceNeeded;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 no-scrollbar">
      {/* Provider Switcher Tabs (CC Maybank vs CC Alliance) */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setProvider('maybank');
          }}
          className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
            isMaybank
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>CC Maybank</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setProvider('alliance');
          }}
          className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
            !isMaybank
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>CC Alliance</span>
        </button>
      </div>

      {/* Header Metric Card */}
      <section className={`rounded-3xl p-5 text-white shadow-lg transition-all ${
        isMaybank
          ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 shadow-amber-500/20'
          : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 shadow-blue-600/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {isMaybank ? 'Kategori CC Maybank' : 'Kategori CC Alliance'}
            </span>
            <div className="text-2xl font-extrabold tabular-nums mt-0.5">
              {formatCurrency(savedForCurrent)}
            </div>
            <p className="text-xs text-white/90 mt-1">
              Jumlah Disimpan (Telah masuk ke Baki Tabung)
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onOpenAddModal(provider);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 active:scale-95 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah</span>
          </button>
        </div>

        {/* Sub metrics */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
          <span>Perlu Disimpan Keseluruhan:</span>
          <span className="font-bold text-white tabular-nums">{formatCurrency(neededForCurrent)}</span>
        </div>
      </section>

      {/* Logic Rule Info Banner */}
      <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-600 leading-relaxed">
          <strong>Peraturan Pengiraan:</strong> Hanya <em>"Jumlah Disimpan"</em> bagi item yang <strong>aktif</strong> dikira ke dalam Baki Tabung. Apabila anda arkibkan item, nilainya ditolak secara automatik.
        </p>
      </div>

      {/* Filter Tabs: Aktif vs Diarkib */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-rose-100 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setFilter('active');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            filter === 'active'
              ? isMaybank ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>Item Aktif</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            filter === 'active' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
          }`}>
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setFilter('archived');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            filter === 'archived'
              ? isMaybank ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>Diarkibkan</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            filter === 'archived' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
          }`}>
            {archivedCount}
          </span>
        </button>
      </div>

      {filter === 'archived' && (
        <div className="p-3 rounded-2xl bg-stone-100 text-stone-600 text-xs flex items-center gap-2 border border-stone-200">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
          <span>Item CC yang diarkibkan <strong>tidak dikira</strong> di dalam Baki Tabung. Tekan pulihkan untuk memasukkan semula.</span>
        </div>
      )}

      {/* List of CC Items */}
      {currentProviderList.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
            isMaybank ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-800">
              {filter === 'active' ? `Tiada Item ${isMaybank ? 'Maybank' : 'Alliance'} Aktif` : 'Tiada Item Diarkibkan'}
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {filter === 'active'
                ? `Tambah komitmen atau bil kad kredit ${isMaybank ? 'Maybank' : 'Alliance'} anda untuk dipantau.`
                : 'Item yang anda arkibkan akan dipaparkan di sini.'}
            </p>
          </div>
          {filter === 'active' && (
            <button
              onClick={() => onOpenAddModal(provider)}
              className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 ${
                isMaybank ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Tambah Item {isMaybank ? 'Maybank' : 'Alliance'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentProviderList.map((item) => {
            const isFull = item.perluDisimpan > 0 && item.jumlahDisimpan >= item.perluDisimpan;
            const pct = item.perluDisimpan > 0 ? Math.min(100, Math.round((item.jumlahDisimpan / item.perluDisimpan) * 100)) : 0;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 border border-rose-100 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Header item */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                      isMaybank ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">
                        {item.perkara}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Perlu Disimpan: {formatCurrency(item.perluDisimpan)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Jumlah Disimpan
                    </span>
                    <span className={`text-base font-extrabold tabular-nums ${
                      isMaybank ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {formatCurrency(item.jumlahDisimpan)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Peratus Sasaran Disimpan</span>
                    <span className="font-bold text-stone-800 tabular-nums">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMaybank
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                          : 'bg-gradient-to-r from-blue-400 to-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Catatan if any */}
                {item.catatan && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                    "{item.catatan}"
                  </p>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-xs">
                  {item.status === 'active' ? (
                    <button
                      onClick={() => {
                        playCoinSound();
                        onOpenQuickDepositWithItem(item.provider, item.id);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 transition-colors min-h-[36px] active:scale-95"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>+ Simpan Duit</span>
                    </button>
                  ) : (
                    <span className="text-stone-400 text-xs italic">Diarkibkan (Tidak masuk baki)</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        playTapSound();
                        onOpenEditModal(item);
                      }}
                      title="Edit Item"
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {item.status === 'active' ? (
                      <button
                        onClick={() => {
                          playDeleteSound();
                          archiveCCItem(item.id);
                        }}
                        title="Arkib Item"
                        className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playTapSound();
                          restoreCCItem(item.id);
                        }}
                        title="Pulihkan Item"
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playDeleteSound();
                        if (window.confirm(`Padam item "${item.perkara}"?`)) {
                          deleteCCItem(item.id);
                        }
                      }}
                      title="Padam Item"
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
