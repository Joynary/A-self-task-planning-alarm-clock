import React from 'react';
import { useApp } from '../context/AppContext';

export const InAppNotification: React.FC = () => {
  const { activeNotification, dismissNotification, toggleTask } = useApp();

  if (!activeNotification) return null;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(activeNotification.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center pt-[14px] px-4 pointer-events-auto">
       {/* Overlay to dim background slightly */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500"></div>

      {/* Capsule */}
      <div className="animate-[slideDownBounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards] relative z-10 w-full max-w-[380px] group cursor-pointer" onClick={dismissNotification}>
        {/* Glow */}
        <div className="absolute -inset-1 bg-primary/30 rounded-full blur-xl opacity-40 transition-opacity duration-700 group-hover:opacity-60"></div>
        
        <div className="relative bg-[#101012] border border-white/10 rounded-[36px] shadow-island p-2 pr-2.5 flex items-center gap-3 overflow-hidden">
          {/* Icon Area */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center size-[52px] rounded-full bg-surface-dark border border-white/5 overflow-hidden">
              <span className="material-symbols-outlined text-primary text-[26px]">
                {activeNotification.category === 'Health' ? 'water_drop' : 'notifications_active'}
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Due Now</span>
              <span className="size-1 bg-white/30 rounded-full"></span>
              <span className="text-[11px] text-slate-400">{activeNotification.category}</span>
            </div>
            <h3 className="text-[17px] font-bold text-white leading-tight truncate pr-2">
              {activeNotification.title}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button 
              className="size-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); dismissNotification(); }}
            >
              <span className="material-symbols-outlined text-[22px]">snooze</span>
            </button>
            <button 
              className="relative size-[52px] flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 group/btn"
              onClick={handleComplete}
            >
              <span className="material-symbols-outlined text-[28px] font-bold group-hover/btn:scale-110 transition-transform">check</span>
            </button>
          </div>
        </div>

        {/* Dismiss Hint */}
        <div className="absolute -bottom-12 left-0 w-full flex justify-center opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
            <p className="text-white/40 text-xs font-medium">Tap to dismiss</p>
        </div>
      </div>
    </div>
  );
};