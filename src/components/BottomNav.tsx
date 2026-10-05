import React from 'react';
import { LayoutDashboard, ReceiptText, CreditCard } from 'lucide-react';
import { TabungIcon } from './TabungIcon';
import { playTabSound } from '../utils/audio';

export type TabDestination = 'ringkasan' | 'transaksi' | 'tabung' | 'cc';

interface BottomNavProps {
  activeTab: TabDestination;
  onSelectTab: (tab: TabDestination) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: TabDestination; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Transaksi', icon: ReceiptText },
    { id: 'tabung', label: 'Tabung', icon: TabungIcon },
    { id: 'cc', label: 'Kad Kredit', icon: CreditCard },
  ];

  return (
    <nav className="sticky bottom-0 z-20 w-full bg-white/95 backdrop-blur-md border-t border-rose-100/90 px-2 py-1.5 shadow-[0_-4px_16px_rgba(225,29,72,0.04)]">
      <div className="grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTabSound();
                onSelectTab(tab.id);
              }}
              className="group flex flex-col items-center justify-center py-1 min-h-[50px] relative transition-transform active:scale-95"
            >
              {/* Material 3 active indicator container pill */}
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-100 text-rose-700 shadow-xs'
                    : 'text-stone-500 group-hover:text-stone-800'
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'font-bold text-rose-700' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
