import React, { useState } from 'react';
import { 
  Plus, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Coins, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TabungIcon } from '../components/TabungIcon';
import { useTabung } from '../context/TabungContext';
import { TabungItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { playTapSound, playCoinSound, playDeleteSound } from '../utils/audio';

interface TabungScreenProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (item: TabungItem) => void;
  onOpenQuickDepositWithItem: (id: string) => void;
}

export const TabungScreen: React.FC<TabungScreenProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenQuickDepositWithItem,
}) => {
  const { tabungList, archiveTabung, restoreTabung, deleteTabung, calculations } = useTabung();
  const [filter, setFilter] = useState<'active' | 'archived'>('active');

  const filteredItems = tabungList.filter((item) => item.status === filter);
  const activeCount = tabungList.filter((item) => item.status === 'active').length;
  const archivedCount = tabungList.filter((item) => item.status === 'archived').length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 no-scrollbar">
      {/* Header Summary */}
      <section className="rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white p-5 shadow-lg shadow-rose-500/15">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">
              Pengurusan Tabung Harapan
            </span>
            <div className="text-2xl font-extrabold tabular-nums mt-0.5">
              {formatCurrency(calculations.activeTabungSaved)}
            </div>
            <p className="text-xs text-rose-100/90 mt-1">
              Daripada sasaran keseluruhan {formatCurrency(calculations.totalTabungTarget)}
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onOpenAddModal();
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 active:scale-95 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs: Aktif vs Diarkib */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-rose-100 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setFilter('active');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            filter === 'active'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>Tabung Aktif</span>
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
              ? 'bg-rose-600 text-white shadow-xs'
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
          <span>Tabung yang diarkibkan <strong>tidak dikira</strong> di dalam Baki Tabung.</span>
        </div>
      )}

      {/* List of Tabung */}
      {filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <TabungIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-800">
              {filter === 'active' ? 'Tiada Tabung Aktif' : 'Tiada Tabung Diarkibkan'}
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {filter === 'active'
                ? 'Mulakan simpanan anda dengan mencipta tabung sasaran pertama untuk tahun 2026.'
                : 'Tabung yang anda arkibkan akan dipaparkan di sini.'}
            </p>
          </div>
          {filter === 'active' && (
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-rose-700 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Bina Tabung Baru
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const pct = item.sasaran > 0 ? Math.min(100, Math.round((item.jumlahDisimpan / item.sasaran) * 100)) : 0;
            const isCompleted = item.sasaran > 0 && item.jumlahDisimpan >= item.sasaran;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 border border-rose-100 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Top Card Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      <TabungIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">
                        {item.nama}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Sasaran: {formatCurrency(item.sasaran)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Disimpan
                    </span>
                    <span className="text-base font-extrabold text-rose-600 tabular-nums">
                      {formatCurrency(item.jumlahDisimpan)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Kemajuan Sasaran</span>
                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                      )}
                      <span className={`font-bold tabular-nums ${
                        isCompleted ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                          : 'bg-gradient-to-r from-rose-400 to-rose-600'
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

                {/* Actions Row */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-xs">
                  {item.status === 'active' ? (
                    <button
                      onClick={() => {
                        playCoinSound();
                        onOpenQuickDepositWithItem(item.id);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 transition-colors min-h-[36px] active:scale-95"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>+ Simpan Duit</span>
                    </button>
                  ) : (
                    <span className="text-stone-400 text-xs italic">Diarkibkan</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        playTapSound();
                        onOpenEditModal(item);
                      }}
                      title="Edit Tabung"
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {item.status === 'active' ? (
                      <button
                        onClick={() => {
                          playDeleteSound();
                          archiveTabung(item.id);
                        }}
                        title="Arkib Tabung"
                        className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playTapSound();
                          restoreTabung(item.id);
                        }}
                        title="Pulihkan Tabung"
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors min-h-[36px] active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playDeleteSound();
                        if (window.confirm(`Padam tabung "${item.nama}"?`)) {
                          deleteTabung(item.id);
                        }
                      }}
                      title="Padam Tabung"
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
