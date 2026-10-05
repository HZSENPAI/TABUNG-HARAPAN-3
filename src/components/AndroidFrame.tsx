import React, { useState, useEffect, ReactNode } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-rose-950/90 text-stone-900 flex flex-col items-center justify-start sm:p-4 md:p-6 overflow-x-hidden selection:bg-rose-200">
      {/* Top Floating Controls Bar */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between py-2 px-3 mb-2 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-rose-500/20 text-xs text-rose-200 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-rose-100">Android Material 3 Simulator</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPhoneMode(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isPhoneMode
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Telefon
          </button>
          <button
            onClick={() => setIsPhoneMode(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              !isPhoneMode
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Responsif
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneMode
            ? 'max-w-[420px] sm:my-2 rounded-none sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(225,29,72,0.35)] border-0 sm:border-[10px] border-stone-900 bg-stone-900 ring-1 ring-rose-500/30 overflow-hidden'
            : 'max-w-2xl rounded-none sm:rounded-3xl shadow-2xl border border-rose-200/50 bg-white overflow-hidden'
        }`}
      >
        {/* Android Hardware Header Bar (Camera Pin-hole & Android Status Bar) */}
        {isPhoneMode && (
          <div className="w-full bg-[#fff5f7] pt-2 px-6 pb-1 flex items-center justify-between text-stone-700 text-xs font-semibold select-none border-b border-rose-100/50 z-30">
            {/* Clock */}
            <span className="font-mono text-xs font-bold text-stone-800 tracking-tight">
              {currentTime}
            </span>

            {/* Camera Punchhole */}
            <div className="w-4 h-4 rounded-full bg-stone-950 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-800 border border-stone-700/80" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-stone-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-bold">100%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>
        )}

        {/* Screen Content Wrapper */}
        <div className="w-full bg-rose-50/40 flex-1 flex flex-col relative min-h-[640px] max-h-[880px] overflow-hidden">
          {children}
        </div>

        {/* Android Bottom Navigation Gesture Bar Pill */}
        {isPhoneMode && (
          <div className="w-full bg-white py-1.5 flex items-center justify-center border-t border-rose-100/60 z-30">
            <div className="w-32 h-1 rounded-full bg-stone-300 active:bg-stone-400 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};
