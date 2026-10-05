import React, { useState } from 'react';
import { TabungProvider, useTabung } from './context/TabungContext';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, TabDestination } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { TabungScreen } from './screens/TabungScreen';
import { CCScreen } from './screens/CCScreen';
import { TransaksiScreen } from './screens/TransaksiScreen';
import { TabungModal } from './components/modals/TabungModal';
import { CCModal } from './components/modals/CCModal';
import { TransaksiModal } from './components/modals/TransaksiModal';
import { QuickDepositModal } from './components/modals/QuickDepositModal';
import { ApkExportModal } from './components/modals/ApkExportModal';
import { BackupModal } from './components/modals/BackupModal';
import { TabungItem, CCItem, TransaksiItem, CCProvider } from './types';

const MainAppContent: React.FC = () => {
  const {
    toastMessage,
    addTabung,
    updateTabung,
    addCCItem,
    updateCCItem,
    addTransaksi,
    updateTransaksi,
  } = useTabung();

  const [activeTab, setActiveTab] = useState<TabDestination>('ringkasan');
  const [ccSubTab, setCCSubTab] = useState<CCProvider>('maybank');

  // Modal States
  const [tabungModalOpen, setTabungModalOpen] = useState(false);
  const [editingTabung, setEditingTabung] = useState<TabungItem | null>(null);

  const [ccModalOpen, setCCModalOpen] = useState(false);
  const [editingCC, setEditingCC] = useState<CCItem | null>(null);
  const [ccDefaultProvider, setCCDefaultProvider] = useState<CCProvider>('maybank');

  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransaksiItem | null>(null);

  const [quickDepositOpen, setQuickDepositOpen] = useState(false);
  const [quickDepositTarget, setQuickDepositTarget] = useState<{
    type: 'tabung' | 'maybank' | 'alliance';
    id?: string;
  }>({ type: 'tabung' });

  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);

  // Navigation Helper
  const handleNavigate = (tab: TabDestination, subTab?: string) => {
    setActiveTab(tab);
    if (tab === 'cc' && subTab) {
      setCCSubTab(subTab as CCProvider);
    }
  };

  return (
    <AndroidFrame>
      {/* Top App Bar */}
      <TopBar
        onOpenApkModal={() => setApkModalOpen(true)}
        onOpenBackupModal={() => setBackupModalOpen(true)}
        onOpenQuickDeposit={() => {
          setQuickDepositTarget({ type: 'tabung' });
          setQuickDepositOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'ringkasan' && (
          <DashboardScreen
            onNavigate={handleNavigate}
            onOpenQuickDeposit={() => {
              setQuickDepositTarget({ type: 'tabung' });
              setQuickDepositOpen(true);
            }}
            onOpenAddTabung={() => {
              setEditingTabung(null);
              setTabungModalOpen(true);
            }}
            onOpenAddTransaksi={() => {
              setEditingTx(null);
              setTxModalOpen(true);
            }}
          />
        )}

        {activeTab === 'transaksi' && (
          <TransaksiScreen
            onOpenAddModal={() => {
              setEditingTx(null);
              setTxModalOpen(true);
            }}
            onOpenEditModal={(item) => {
              setEditingTx(item);
              setTxModalOpen(true);
            }}
          />
        )}

        {activeTab === 'tabung' && (
          <TabungScreen
            onOpenAddModal={() => {
              setEditingTabung(null);
              setTabungModalOpen(true);
            }}
            onOpenEditModal={(item) => {
              setEditingTabung(item);
              setTabungModalOpen(true);
            }}
            onOpenQuickDepositWithItem={(id) => {
              setQuickDepositTarget({ type: 'tabung', id });
              setQuickDepositOpen(true);
            }}
          />
        )}

        {activeTab === 'cc' && (
          <CCScreen
            initialProvider={ccSubTab}
            onOpenAddModal={(provider) => {
              setCCDefaultProvider(provider);
              setEditingCC(null);
              setCCModalOpen(true);
            }}
            onOpenEditModal={(item) => {
              setEditingCC(item);
              setCCDefaultProvider(item.provider);
              setCCModalOpen(true);
            }}
            onOpenQuickDepositWithItem={(provider, id) => {
              setQuickDepositTarget({ type: provider, id });
              setQuickDepositOpen(true);
            }}
          />
        )}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Floating Real-time Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-20 left-4 right-4 z-50 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-2.5 rounded-2xl bg-stone-900/95 text-white text-xs font-semibold shadow-xl border border-rose-500/20 backdrop-blur-md max-w-sm text-center">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Modals */}
      <TabungModal
        isOpen={tabungModalOpen}
        onClose={() => setTabungModalOpen(false)}
        editItem={editingTabung}
        onSave={(data) => {
          if (editingTabung) {
            updateTabung(editingTabung.id, data);
          } else {
            addTabung(data);
          }
        }}
      />

      <CCModal
        isOpen={ccModalOpen}
        onClose={() => setCCModalOpen(false)}
        editItem={editingCC}
        defaultProvider={ccDefaultProvider}
        onSave={(data) => {
          if (editingCC) {
            updateCCItem(editingCC.id, data);
          } else {
            addCCItem(data);
          }
        }}
      />

      <TransaksiModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        editItem={editingTx}
        onSave={(data, syncWithTarget) => {
          if (editingTx) {
            updateTransaksi(editingTx.id, data);
          } else {
            addTransaksi(data, syncWithTarget);
          }
        }}
      />

      <QuickDepositModal
        isOpen={quickDepositOpen}
        onClose={() => setQuickDepositOpen(false)}
        preselectedType={quickDepositTarget.type}
        preselectedId={quickDepositTarget.id}
      />

      <ApkExportModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />

      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
      />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <TabungProvider>
      <MainAppContent />
    </TabungProvider>
  );
}
