import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  Info,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { TabungIcon } from '../components/TabungIcon';
import { useTabung } from '../context/TabungContext';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { TabDestination } from '../components/BottomNav';
import { playTapSound, playCoinSound } from '../utils/audio';

interface DashboardScreenProps {
  onNavigate: (tab: TabDestination, subTab?: string) => void;
  onOpenQuickDeposit: () => void;
  onOpenAddTabung: () => void;
  onOpenAddTransaksi: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenQuickDeposit,
  onOpenAddTabung,
  onOpenAddTransaksi,
}) => {
  const { tabungList, ccList, transaksiList, calculations } = useTabung();

  const activeTabungList = tabungList.filter((t) => t.status === 'active');
  const activeMaybankList = ccList.filter((c) => c.provider === 'maybank' && c.status === 'active');
  const activeAllianceList = ccList.filter((c) => c.provider === 'alliance' && c.status === 'active');
  const recentTransaksi = transaksiList.filter((tx) => tx.status === 'active').slice(0, 4);

  // Overall Tabung progress
  const tabungProgressPct = calculations.totalTabungTarget > 0
    ? Math.min(100, Math.round((calculations.activeTabungSaved / calculations.totalTabungTarget) * 100))
    : 0;

  // Maybank & Alliance Progress
  const maybankProgressPct = calculations.totalMaybankNeeded > 0
    ? Math.min(100, Math.round((calculations.activeMaybankSaved / calculations.totalMaybankNeeded) * 100))
    : 0;

  const allianceProgressPct = calculations.totalAllianceNeeded > 0
    ? Math.min(100, Math.round((calculations.activeAllianceSaved / calculations.totalAllianceNeeded) * 100))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 no-scrollbar">
      {/* Hero Card: BAKI TABUNG */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 text-white p-6 shadow-xl shadow-rose-600/20 border border-rose-400/30">
        {/* Soft decorative blur orbs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-rose-50 mb-2 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>TABUNG HARAPAN</span>
          </div>

          <span className="text-xs uppercase tracking-widest text-rose-100 font-bold mb-1">
            BAKI TABUNG
          </span>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white tabular-nums drop-shadow-xs my-1">
            {formatCurrency(calculations.totalBalance)}
          </div>

          <p className="text-[11px] text-rose-100/90 max-w-xs mt-0.5">
            Formula: Tabung + CC Maybank + CC Alliance
          </p>

          {/* Breakdown Divider */}
          <div className="w-full my-4 border-t border-white/20" />

          {/* Breakdown 3 Columns */}
          <div className="w-full grid grid-cols-3 gap-2 text-center">
            <div 
              onClick={() => {
                playTapSound();
                onNavigate('tabung');
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition-colors cursor-pointer border border-white/10 active:scale-95"
            >
              <div className="text-[10px] text-rose-100 uppercase tracking-tight font-medium">
                Simpanan Tabung
              </div>
              <div className="text-xs font-bold text-white tabular-nums mt-0.5 truncate">
                {formatCurrency(calculations.activeTabungSaved)}
              </div>
            </div>

            <div 
              onClick={() => {
                playTapSound();
                onNavigate('cc', 'maybank');
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition-colors cursor-pointer border border-white/10 active:scale-95"
            >
              <div className="text-[10px] text-amber-200 uppercase tracking-tight font-medium">
                CC Maybank
              </div>
              <div className="text-xs font-bold text-white tabular-nums mt-0.5 truncate">
                {formatCurrency(calculations.activeMaybankSaved)}
              </div>
            </div>

            <div 
              onClick={() => {
                playTapSound();
                onNavigate('cc', 'alliance');
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition-colors cursor-pointer border border-white/10 active:scale-95"
            >
              <div className="text-[10px] text-sky-200 uppercase tracking-tight font-medium">
                CC Alliance
              </div>
              <div className="text-xs font-bold text-white tabular-nums mt-0.5 truncate">
                {formatCurrency(calculations.activeAllianceSaved)}
              </div>
            </div>
          </div>

          {/* Total Row */}
          <div className="w-full mt-2.5 pt-2 flex items-center justify-between text-xs text-rose-100 border-t border-white/10 px-1">
            <span>Jumlah Keseluruhan Baki</span>
            <span className="font-bold text-white tabular-nums">{formatCurrency(calculations.totalBalance)}</span>
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts */}
      <section className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            playCoinSound();
            onOpenQuickDeposit();
          }}
          className="p-3 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-100 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 group min-h-[72px]"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-1.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">+ Simpan</span>
          <span className="text-[9px] text-stone-400">Cepat & Auto</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            onOpenAddTransaksi();
          }}
          className="p-3 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-100 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 group min-h-[72px]"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-1.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">Transaksi</span>
          <span className="text-[9px] text-stone-400">Rekod Aliran</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            onOpenAddTabung();
          }}
          className="p-3 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-100 shadow-xs flex flex-col items-center justify-center text-center transition-all active:scale-95 group min-h-[72px]"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-1.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <TabungIcon className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-stone-800 leading-tight">Tabung Baru</span>
          <span className="text-[9px] text-stone-400">Simpanan Sasaran</span>
        </button>
      </section>

      {/* Kad Khas: CC Maybank */}
      <section 
        onClick={() => onNavigate('cc', 'maybank')}
        className="rounded-3xl bg-white p-5 border border-amber-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-stone-900">CC MAYBANK</h3>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {activeMaybankList.length} Item Aktif
                </span>
              </div>
              <p className="text-xs text-stone-500">Jumlah Disimpan Masuk Baki Tabung</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-amber-100 group-hover:text-amber-800 flex items-center justify-center text-stone-400 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/60 mb-3">
          <div>
            <span className="text-[10px] text-amber-900 font-semibold block">Jumlah Disimpan (Aktif)</span>
            <span className="text-base font-extrabold text-amber-950 tabular-nums">
              {formatCurrency(calculations.activeMaybankSaved)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-medium block">Perlu Disimpan</span>
            <span className="text-base font-bold text-stone-700 tabular-nums">
              {formatCurrency(calculations.totalMaybankNeeded)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-500 font-medium">
            <span>Kemajuan Simpanan Maybank</span>
            <span className="font-bold text-amber-700">{maybankProgressPct}%</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${maybankProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Kad Khas: CC Alliance */}
      <section 
        onClick={() => onNavigate('cc', 'alliance')}
        className="rounded-3xl bg-white p-5 border border-blue-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-stone-900">CC ALLIANCE</h3>
                <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  {activeAllianceList.length} Item Aktif
                </span>
              </div>
              <p className="text-xs text-stone-500">Jumlah Disimpan Masuk Baki Tabung</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-blue-100 group-hover:text-blue-800 flex items-center justify-center text-stone-400 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/60 mb-3">
          <div>
            <span className="text-[10px] text-blue-900 font-semibold block">Jumlah Disimpan (Aktif)</span>
            <span className="text-base font-extrabold text-blue-950 tabular-nums">
              {formatCurrency(calculations.activeAllianceSaved)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-medium block">Perlu Disimpan</span>
            <span className="text-base font-bold text-stone-700 tabular-nums">
              {formatCurrency(calculations.totalAllianceNeeded)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-500 font-medium">
            <span>Kemajuan Simpanan Alliance</span>
            <span className="font-bold text-blue-700">{allianceProgressPct}%</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${allianceProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Ringkasan Kemajuan Tabung */}
      <section className="rounded-3xl bg-white p-5 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabungIcon className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-stone-900">Kemajuan Tabung Simpanan</h3>
          </div>
          <button
            onClick={() => onNavigate('tabung')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
          >
            Lihat Semua ({activeTabungList.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100/60">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-stone-600 font-medium">Jumlah Sasaran Tabung:</span>
            <span className="font-bold text-stone-900 tabular-nums">
              {formatCurrency(calculations.totalTabungTarget)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-rose-700 font-semibold">Telah Berjaya Disimpan:</span>
            <span className="font-extrabold text-rose-700 tabular-nums">
              {formatCurrency(calculations.activeTabungSaved)} ({tabungProgressPct}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-rose-200/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${tabungProgressPct}%` }}
            />
          </div>
        </div>

        {/* Top active tabung snippets */}
        <div className="space-y-2 pt-1">
          {activeTabungList.slice(0, 3).map((tabung) => {
            const pct = tabung.sasaran > 0 ? Math.min(100, Math.round((tabung.jumlahDisimpan / tabung.sasaran) * 100)) : 0;
            return (
              <div 
                key={tabung.id}
                onClick={() => onNavigate('tabung')}
                className="p-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-stone-100"
              >
                <div>
                  <div className="text-xs font-bold text-stone-800">{tabung.nama}</div>
                  <div className="text-[10px] text-stone-400">
                    Sasaran: {formatCurrency(tabung.sasaran)} • {pct}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-rose-600 tabular-nums">
                    {formatCurrency(tabung.jumlahDisimpan)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transaksi Terkini */}
      <section className="rounded-3xl bg-white p-5 border border-rose-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-stone-900">Transaksi Terkini</h3>
          </div>
          <button
            onClick={() => onNavigate('transaksi')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
          >
            Lihat Semua
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransaksi.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400">
            Tiada rekod transaksi. Tekan "+ Rekod" untuk memulakan.
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransaksi.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.jenis === 'simpan' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tx.jenis === 'simpan' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{tx.nama}</div>
                    <div className="text-[10px] text-stone-500">
                      {formatDateDisplay(tx.tarikh)} · {tx.kategori.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-bold tabular-nums ${
                  tx.jenis === 'simpan' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {tx.jenis === 'simpan' ? '+' : '-'} {formatCurrency(tx.jumlah)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
