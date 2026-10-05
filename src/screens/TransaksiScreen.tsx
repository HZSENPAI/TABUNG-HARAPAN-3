import React, { useState } from 'react';
import { 
  ReceiptText, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Filter, 
  HelpCircle,
  Calendar
} from 'lucide-react';
import { useTabung } from '../context/TabungContext';
import { TransaksiItem, TransaksiJenis, TransaksiKategori } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { playTapSound, playDeleteSound } from '../utils/audio';

interface TransaksiScreenProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (item: TransaksiItem) => void;
}

export const TransaksiScreen: React.FC<TransaksiScreenProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { transaksiList, deleteTransaksi, archiveTransaksi, restoreTransaksi, calculations } = useTabung();
  const [filterJenis, setFilterJenis] = useState<'semua' | 'simpan' | 'keluar'>('semua');
  const [filterKategori, setFilterKategori] = useState<string>('semua');
  const [showArchived, setShowArchived] = useState(false);

  const filteredItems = transaksiList.filter((tx) => {
    if (showArchived) {
      if (tx.status !== 'archived') return false;
    } else {
      if (tx.status !== 'active') return false;
    }

    if (filterJenis !== 'semua' && tx.jenis !== filterJenis) return false;
    if (filterKategori !== 'semua' && tx.kategori !== filterKategori) return false;

    return true;
  });

  const netCashflow = calculations.totalTransaksiSimpan - calculations.totalTransaksiKeluar;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 no-scrollbar">
      {/* Header Ledger Card */}
      <section className="rounded-3xl bg-white p-5 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Rekod Aliran Tunai & Transaksi
            </span>
            <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
              Buku Log Transaksi
            </h3>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onOpenAddModal();
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Rekod</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-semibold block leading-tight">Total Masuk</span>
            <span className="text-xs font-bold text-emerald-700 tabular-nums mt-0.5 block truncate">
              +{formatCurrency(calculations.totalTransaksiSimpan)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-[10px] text-rose-800 font-semibold block leading-tight">Total Keluar</span>
            <span className="text-xs font-bold text-rose-700 tabular-nums mt-0.5 block truncate">
              -{formatCurrency(calculations.totalTransaksiKeluar)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-100/70 border border-stone-200">
            <span className="text-[10px] text-stone-600 font-semibold block leading-tight">Bersih</span>
            <span className={`text-xs font-bold tabular-nums mt-0.5 block truncate ${
              netCashflow >= 0 ? 'text-stone-900' : 'text-rose-700'
            }`}>
              {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
            </span>
          </div>
        </div>

        {/* Double-counting prevention notice */}
        <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
          <strong>Info:</strong> Transaksi berfungsi sebagai lejar catatan aliran kewangan peribadi. Pengiraan Baki Tabung adalah berasaskan jumlah simpanan aktif semasa dalam Tabung & Kad Kredit tanpa pertindihan (double counting).
        </p>
      </section>

      {/* Filter Row */}
      <div className="space-y-2">
        {/* Flow Type Filters: Semua | Simpan (+) | Keluar (-) */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-rose-100 shadow-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              playTapSound();
              setFilterJenis('semua');
            }}
            className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all min-h-[36px] whitespace-nowrap ${
              filterJenis === 'semua' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => {
              playTapSound();
              setFilterJenis('simpan');
            }}
            className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all min-h-[36px] whitespace-nowrap ${
              filterJenis === 'simpan' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Simpan (+)
          </button>
          <button
            onClick={() => {
              playTapSound();
              setFilterJenis('keluar');
            }}
            className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all min-h-[36px] whitespace-nowrap ${
              filterJenis === 'keluar' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Keluar (-)
          </button>
          <button
            onClick={() => {
              playTapSound();
              setShowArchived(!showArchived);
            }}
            className={`py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all min-h-[36px] border ${
              showArchived ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 text-stone-600 border-stone-200'
            }`}
          >
            {showArchived ? 'Arkib' : 'Arkib'}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'semua', label: 'Semua Kategori' },
            { id: 'tabung', label: 'Tabung' },
            { id: 'maybank', label: 'CC Maybank' },
            { id: 'alliance', label: 'CC Alliance' },
            { id: 'umum', label: 'Umum' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterKategori(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterKategori === cat.id
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-800">Tiada Rekod Transaksi</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Rekod setiap simpanan atau perbelanjaan untuk memantau aliran wang anda.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-rose-700 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi Baru
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((tx) => {
            const isDeposit = tx.jenis === 'simpan';

            return (
              <div
                key={tx.id}
                className="p-4 rounded-3xl bg-white border border-rose-100 shadow-xs hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDeposit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isDeposit ? (
                        <ArrowDownLeft className="w-5 h-5 stroke-[2.4]" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 stroke-[2.4]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">
                        {tx.nama}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                        <span>{formatDateDisplay(tx.tarikh)}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-stone-700">
                          {tx.kategori === 'tabung' ? 'Tabung' : tx.kategori === 'maybank' ? 'CC Maybank' : tx.kategori === 'alliance' ? 'CC Alliance' : 'Umum'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold tabular-nums block ${
                      isDeposit ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isDeposit ? '+' : '-'} {formatCurrency(tx.jumlah)}
                    </span>
                  </div>
                </div>

                {tx.catatan && (
                  <p className="text-xs text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-100">
                    {tx.catatan}
                  </p>
                )}

                <div className="pt-1.5 border-t border-stone-100 flex items-center justify-end gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      playTapSound();
                      onOpenEditModal(tx);
                    }}
                    title="Edit Transaksi"
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (tx.status === 'active') {
                        playDeleteSound();
                        archiveTransaksi(tx.id);
                      } else {
                        playTapSound();
                        restoreTransaksi(tx.id);
                      }
                    }}
                    title={tx.status === 'active' ? 'Arkib' : 'Pulihkan'}
                    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors active:scale-95"
                  >
                    {tx.status === 'active' ? (
                      <Archive className="w-3.5 h-3.5" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      playDeleteSound();
                      if (window.confirm(`Padam rekod "${tx.nama}"?`)) {
                        deleteTransaksi(tx.id);
                      }
                    }}
                    title="Padam"
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
