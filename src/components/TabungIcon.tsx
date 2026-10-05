import React from 'react';

interface TabungIconProps {
  className?: string;
}

/**
 * TabungIcon - Ikon rasmi Tabung Duit / Peti Simpanan (bukan babi).
 * Menampilkan silinder tabung simpanan moden dengan lubang syiling dan syiling emas.
 */
export const TabungIcon: React.FC<TabungIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Coin entering slot */}
      <ellipse cx="12" cy="4" rx="3.5" ry="1.5" stroke="currentColor" fill="currentColor" fillOpacity="0.25" />
      
      {/* Coin slot lid */}
      <rect x="6" y="6" width="12" height="3" rx="1.5" stroke="currentColor" fill="currentColor" fillOpacity="0.15" />
      <line x1="10" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.5" />

      {/* Main jar / canister body */}
      <path d="M7 9v9a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9" stroke="currentColor" />

      {/* Middle decorative band & label */}
      <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeDasharray="1 1.5" />
      <path d="M10.5 16h3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 14.5v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};
