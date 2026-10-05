import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { TabungItem, CCItem, TransaksiItem, AppCalculations, CCProvider } from '../types';
import { getTodayDateString } from '../utils/formatters';

const STORAGE_KEY_TABUNG = 'tabung_harapan_tabung_v1';
const STORAGE_KEY_CC = 'tabung_harapan_cc_v1';
const STORAGE_KEY_TRANSAKSI = 'tabung_harapan_transaksi_v1';

// Initial realistic default data matching user example exactly:
// Tabung = RM 1,313.80, CC Maybank = RM 300, CC Alliance = RM 200 => Baki Tabung = RM 1,813.80
const INITIAL_TABUNG: TabungItem[] = [
  {
    id: 'tabung-1',
    nama: 'Simpanan Kecemasan 2026',
    sasaran: 5000,
    jumlahDisimpan: 800,
    catatan: 'Dana rizab 3 bulan untuk keperluan mendesak',
    status: 'active',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'tabung-2',
    nama: 'Tabung Raya & Ziarah',
    sasaran: 2000,
    jumlahDisimpan: 513.80,
    catatan: 'Persiapan Hari Raya Aidilfitri & duit raya keluarga',
    status: 'active',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
  {
    id: 'tabung-3',
    nama: 'Servis Kereta & Roadtax',
    sasaran: 1500,
    jumlahDisimpan: 0,
    catatan: 'Sasaran servis berkala pertengahan tahun',
    status: 'active',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  }
];

const INITIAL_CC: CCItem[] = [
  {
    id: 'cc-mb-1',
    provider: 'maybank',
    perkara: 'Bil Kad Maybank Ikhwan',
    perluDisimpan: 500,
    jumlahDisimpan: 300,
    catatan: 'Peruntukan bayaran penyata bulanan kad kredit Maybank',
    status: 'active',
    createdAt: '2026-01-02',
    updatedAt: '2026-01-02',
  },
  {
    id: 'cc-mb-2',
    provider: 'maybank',
    perkara: 'Pelan Ansuran Maybank EzyPay',
    perluDisimpan: 250,
    jumlahDisimpan: 0,
    catatan: 'Ansuran telefon pintar 0% faedah',
    status: 'active',
    createdAt: '2026-01-03',
    updatedAt: '2026-01-03',
  },
  {
    id: 'cc-al-1',
    provider: 'alliance',
    perkara: 'Bil Kad Alliance Platinum',
    perluDisimpan: 400,
    jumlahDisimpan: 200,
    catatan: 'Simpanan siap sedia sebelum tarikh matang penyata',
    status: 'active',
    createdAt: '2026-01-04',
    updatedAt: '2026-01-04',
  }
];

const INITIAL_TRANSAKSI: TransaksiItem[] = [
  {
    id: 'tx-1',
    tarikh: '2026-01-02',
    nama: 'Simpanan Permulaan Tabung Kecemasan',
    kategori: 'tabung',
    targetId: 'tabung-1',
    jumlah: 800,
    jenis: 'simpan',
    catatan: 'Gaji bulan pertama 2026',
    status: 'active',
    createdAt: '2026-01-02',
  },
  {
    id: 'tx-2',
    tarikh: '2026-01-05',
    nama: 'Simpanan Tabung Raya',
    kategori: 'tabung',
    targetId: 'tabung-2',
    jumlah: 513.80,
    jenis: 'simpan',
    catatan: 'Lebihan bajet peribadi',
    status: 'active',
    createdAt: '2026-01-05',
  },
  {
    id: 'tx-3',
    tarikh: '2026-01-06',
    nama: 'Simpanan Peruntukan Kad Maybank',
    kategori: 'maybank',
    targetId: 'cc-mb-1',
    jumlah: 300,
    jenis: 'simpan',
    catatan: 'Disimpan ke dalam baki rizab bayaran Maybank',
    status: 'active',
    createdAt: '2026-01-06',
  },
  {
    id: 'tx-4',
    tarikh: '2026-01-07',
    nama: 'Simpanan Peruntukan Kad Alliance',
    kategori: 'alliance',
    targetId: 'cc-al-1',
    jumlah: 200,
    jenis: 'simpan',
    catatan: 'Disimpan ke dalam baki rizab bayaran Alliance',
    status: 'active',
    createdAt: '2026-01-07',
  }
];

interface TabungContextType {
  tabungList: TabungItem[];
  ccList: CCItem[];
  transaksiList: TransaksiItem[];
  calculations: AppCalculations;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Tabung actions
  addTabung: (item: Omit<TabungItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTabung: (id: string, updates: Partial<Omit<TabungItem, 'id' | 'createdAt'>>) => void;
  archiveTabung: (id: string) => void;
  restoreTabung: (id: string) => void;
  deleteTabung: (id: string) => void;
  // CC actions
  addCCItem: (item: Omit<CCItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateCCItem: (id: string, updates: Partial<Omit<CCItem, 'id' | 'createdAt'>>) => void;
  archiveCCItem: (id: string) => void;
  restoreCCItem: (id: string) => void;
  deleteCCItem: (id: string) => void;
  // Transaksi actions
  addTransaksi: (item: Omit<TransaksiItem, 'id' | 'createdAt' | 'status'>, syncWithTarget?: boolean) => void;
  updateTransaksi: (id: string, updates: Partial<Omit<TransaksiItem, 'id' | 'createdAt'>>) => void;
  deleteTransaksi: (id: string) => void;
  archiveTransaksi: (id: string) => void;
  restoreTransaksi: (id: string) => void;
  // System actions
  resetDataToDefault: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const TabungContext = createContext<TabungContextType | null>(null);

export const TabungProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabungList, setTabungList] = useState<TabungItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TABUNG);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load tabung data', e);
    }
    return INITIAL_TABUNG;
  });

  const [ccList, setCCList] = useState<CCItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CC);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load CC data', e);
    }
    return INITIAL_CC;
  });

  const [transaksiList, setTransaksiList] = useState<TransaksiItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TRANSAKSI);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load Transaksi data', e);
    }
    return INITIAL_TRANSAKSI;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(15); } catch {}
    }
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  // Persist to local storage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TABUNG, JSON.stringify(tabungList));
    } catch (e) {
      console.error('Failed to save tabung', e);
    }
  }, [tabungList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CC, JSON.stringify(ccList));
    } catch (e) {
      console.error('Failed to save CC', e);
    }
  }, [ccList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSAKSI, JSON.stringify(transaksiList));
    } catch (e) {
      console.error('Failed to save transaksi', e);
    }
  }, [transaksiList]);

  // Real-time calculations strictly adhering to:
  // BAKI TABUNG = activeTabungSaved + activeMaybankSaved + activeAllianceSaved
  const calculations = useMemo<AppCalculations>(() => {
    const activeTabung = tabungList.filter(t => t.status === 'active');
    const archivedTabung = tabungList.filter(t => t.status === 'archived');
    const activeMaybank = ccList.filter(c => c.provider === 'maybank' && c.status === 'active');
    const archivedMaybank = ccList.filter(c => c.provider === 'maybank' && c.status === 'archived');
    const activeAlliance = ccList.filter(c => c.provider === 'alliance' && c.status === 'active');
    const archivedAlliance = ccList.filter(c => c.provider === 'alliance' && c.status === 'archived');

    const activeTabungSaved = activeTabung.reduce((sum, item) => sum + (Number(item.jumlahDisimpan) || 0), 0);
    const activeMaybankSaved = activeMaybank.reduce((sum, item) => sum + (Number(item.jumlahDisimpan) || 0), 0);
    const activeAllianceSaved = activeAlliance.reduce((sum, item) => sum + (Number(item.jumlahDisimpan) || 0), 0);

    const totalBalance = activeTabungSaved + activeMaybankSaved + activeAllianceSaved;

    const totalTabungTarget = activeTabung.reduce((sum, item) => sum + (Number(item.sasaran) || 0), 0);
    const totalMaybankNeeded = activeMaybank.reduce((sum, item) => sum + (Number(item.perluDisimpan) || 0), 0);
    const totalAllianceNeeded = activeAlliance.reduce((sum, item) => sum + (Number(item.perluDisimpan) || 0), 0);

    const activeTransaksi = transaksiList.filter(tx => tx.status === 'active');
    const totalTransaksiSimpan = activeTransaksi
      .filter(tx => tx.jenis === 'simpan')
      .reduce((sum, tx) => sum + (Number(tx.jumlah) || 0), 0);
    const totalTransaksiKeluar = activeTransaksi
      .filter(tx => tx.jenis === 'keluar')
      .reduce((sum, tx) => sum + (Number(tx.jumlah) || 0), 0);

    return {
      activeTabungSaved,
      activeMaybankSaved,
      activeAllianceSaved,
      totalBalance,
      totalTabungTarget,
      totalMaybankNeeded,
      totalAllianceNeeded,
      archivedTabungCount: archivedTabung.length,
      archivedMaybankCount: archivedMaybank.length,
      archivedAllianceCount: archivedAlliance.length,
      totalTransaksiSimpan,
      totalTransaksiKeluar,
    };
  }, [tabungList, ccList, transaksiList]);

  // Tabung CRUD Handlers
  const addTabung = (item: Omit<TabungItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = getTodayDateString();
    const newItem: TabungItem = {
      ...item,
      id: `tabung-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    setTabungList(prev => [newItem, ...prev]);
    showToast(`Tabung "${newItem.nama}" berjaya ditambah`);
  };

  const updateTabung = (id: string, updates: Partial<Omit<TabungItem, 'id' | 'createdAt'>>) => {
    const now = getTodayDateString();
    setTabungList(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: now } : t))
    );
    showToast('Tabung berjaya dikemaskini');
  };

  const archiveTabung = (id: string) => {
    const item = tabungList.find(t => t.id === id);
    setTabungList(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'archived', updatedAt: getTodayDateString() } : t))
    );
    showToast(`"${item?.nama || 'Tabung'}" telah diarkibkan (tidak dikira dalam Baki Tabung)`);
  };

  const restoreTabung = (id: string) => {
    const item = tabungList.find(t => t.id === id);
    setTabungList(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'active', updatedAt: getTodayDateString() } : t))
    );
    showToast(`"${item?.nama || 'Tabung'}" telah dipulihkan semula ke Baki Tabung`);
  };

  const deleteTabung = (id: string) => {
    const item = tabungList.find(t => t.id === id);
    setTabungList(prev => prev.filter(t => t.id !== id));
    showToast(`"${item?.nama || 'Tabung'}" telah dipadam`);
  };

  // CC Handlers
  const addCCItem = (item: Omit<CCItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = getTodayDateString();
    const newItem: CCItem = {
      ...item,
      id: `cc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    setCCList(prev => [newItem, ...prev]);
    const providerName = newItem.provider === 'maybank' ? 'CC Maybank' : 'CC Alliance';
    showToast(`Item ${providerName} berjaya ditambah`);
  };

  const updateCCItem = (id: string, updates: Partial<Omit<CCItem, 'id' | 'createdAt'>>) => {
    const now = getTodayDateString();
    setCCList(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: now } : c))
    );
    showToast('Maklumat CC berjaya dikemaskini');
  };

  const archiveCCItem = (id: string) => {
    const item = ccList.find(c => c.id === id);
    setCCList(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'archived', updatedAt: getTodayDateString() } : c))
    );
    const provName = item?.provider === 'maybank' ? 'CC Maybank' : 'CC Alliance';
    showToast(`Item ${provName} diarkibkan (simpanannya dikeluarkan daripada Baki Tabung)`);
  };

  const restoreCCItem = (id: string) => {
    const item = ccList.find(c => c.id === id);
    setCCList(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'active', updatedAt: getTodayDateString() } : c))
    );
    const provName = item?.provider === 'maybank' ? 'CC Maybank' : 'CC Alliance';
    showToast(`Item ${provName} dipulihkan (simpanannya dimasukkan semula ke Baki Tabung)`);
  };

  const deleteCCItem = (id: string) => {
    setCCList(prev => prev.filter(c => c.id !== id));
    showToast('Item CC telah dipadam sepenuhnya');
  };

  // Transaksi Handlers
  const addTransaksi = (
    item: Omit<TransaksiItem, 'id' | 'createdAt' | 'status'>,
    syncWithTarget: boolean = false
  ) => {
    const newItem: TransaksiItem = {
      ...item,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'active',
      createdAt: getTodayDateString(),
    };
    setTransaksiList(prev => [newItem, ...prev]);

    // Optional direct synchronization with target balance if requested by user
    if (syncWithTarget && item.targetId) {
      if (item.kategori === 'tabung') {
        setTabungList(prev =>
          prev.map(t => {
            if (t.id === item.targetId) {
              const diff = item.jenis === 'simpan' ? item.jumlah : -item.jumlah;
              const newAmount = Math.max(0, (Number(t.jumlahDisimpan) || 0) + diff);
              return { ...t, jumlahDisimpan: newAmount, updatedAt: getTodayDateString() };
            }
            return t;
          })
        );
      } else if (item.kategori === 'maybank' || item.kategori === 'alliance') {
        setCCList(prev =>
          prev.map(c => {
            if (c.id === item.targetId) {
              const diff = item.jenis === 'simpan' ? item.jumlah : -item.jumlah;
              const newAmount = Math.max(0, (Number(c.jumlahDisimpan) || 0) + diff);
              return { ...c, jumlahDisimpan: newAmount, updatedAt: getTodayDateString() };
            }
            return c;
          })
        );
      }
    }

    showToast('Transaksi berjaya direkodkan');
  };

  const updateTransaksi = (id: string, updates: Partial<Omit<TransaksiItem, 'id' | 'createdAt'>>) => {
    setTransaksiList(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updates } : tx))
    );
    showToast('Transaksi dikemaskini');
  };

  const deleteTransaksi = (id: string) => {
    setTransaksiList(prev => prev.filter(tx => tx.id !== id));
    showToast('Transaksi dipadam');
  };

  const archiveTransaksi = (id: string) => {
    setTransaksiList(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, status: 'archived' } : tx))
    );
    showToast('Transaksi diarkibkan');
  };

  const restoreTransaksi = (id: string) => {
    setTransaksiList(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, status: 'active' } : tx))
    );
    showToast('Transaksi dipulihkan');
  };

  // System Handlers
  const resetDataToDefault = () => {
    setTabungList(INITIAL_TABUNG);
    setCCList(INITIAL_CC);
    setTransaksiList(INITIAL_TRANSAKSI);
    showToast('Data telah ditetapkan semula ke nilai lalai');
  };

  const clearAllData = () => {
    setTabungList([]);
    setCCList([]);
    setTransaksiList([]);
    showToast('Semua data tempatan telah dipadamkan');
  };

  const exportDataJSON = () => {
    const payload = {
      app: 'TABUNG HARAPAN 2026',
      exportedAt: new Date().toISOString(),
      tabung: tabungList,
      cc: ccList,
      transaksi: transaksiList,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tabung) && Array.isArray(data.cc)) {
        setTabungList(data.tabung);
        setCCList(data.cc);
        if (Array.isArray(data.transaksi)) {
          setTransaksiList(data.transaksi);
        }
        showToast('Data berjaya diimport daripada sandaran!');
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    showToast('Gagal mengimport data: Format fail JSON tidak sah');
    return false;
  };

  return (
    <TabungContext.Provider
      value={{
        tabungList,
        ccList,
        transaksiList,
        calculations,
        toastMessage,
        showToast,
        addTabung,
        updateTabung,
        archiveTabung,
        restoreTabung,
        deleteTabung,
        addCCItem,
        updateCCItem,
        archiveCCItem,
        restoreCCItem,
        deleteCCItem,
        addTransaksi,
        updateTransaksi,
        deleteTransaksi,
        archiveTransaksi,
        restoreTransaksi,
        resetDataToDefault,
        clearAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </TabungContext.Provider>
  );
};

export const useTabung = () => {
  const context = useContext(TabungContext);
  if (!context) {
    throw new Error('useTabung must be used within a TabungProvider');
  }
  return context;
};
