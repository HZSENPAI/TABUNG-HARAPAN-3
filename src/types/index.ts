export type ItemStatus = 'active' | 'archived';

export interface TabungItem {
  id: string;
  nama: string;
  sasaran: number;
  jumlahDisimpan: number;
  catatan: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  iconName?: string;
  colorTheme?: string;
}

export type CCProvider = 'maybank' | 'alliance';

export interface CCItem {
  id: string;
  provider: CCProvider;
  perkara: string;
  perluDisimpan: number;
  jumlahDisimpan: number;
  catatan: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export type TransaksiJenis = 'simpan' | 'keluar';
export type TransaksiKategori = 'tabung' | 'maybank' | 'alliance' | 'umum';

export interface TransaksiItem {
  id: string;
  tarikh: string; // YYYY-MM-DD
  nama: string;
  kategori: TransaksiKategori;
  targetId?: string; // Tabung id or CC item id
  jumlah: number;
  jenis: TransaksiJenis;
  catatan: string;
  status: ItemStatus;
  createdAt: string;
}

export interface AppCalculations {
  activeTabungSaved: number;
  activeMaybankSaved: number;
  activeAllianceSaved: number;
  totalBalance: number; // activeTabungSaved + activeMaybankSaved + activeAllianceSaved
  totalTabungTarget: number;
  totalMaybankNeeded: number;
  totalAllianceNeeded: number;
  archivedTabungCount: number;
  archivedMaybankCount: number;
  archivedAllianceCount: number;
  totalTransaksiSimpan: number;
  totalTransaksiKeluar: number;
}
