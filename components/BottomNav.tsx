import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="absolute bottom-0 w-full bg-white/90 dark:bg-[#18181b]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-6 pt-3 px-6 z-20">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          <div className="relative">
            <span className={`material-symbols-outlined text-[26px] transition-transform group-active:scale-90 ${isActive('/') ? '' : 'unfilled'}`}>
              {isActive('/') ? 'check_circle' : 'home'}
            </span>
            {isActive('/') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
          </div>
        </button>

        <button 
          onClick={() => navigate('/calendar')}
          className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/calendar') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          <div className="relative">
             <span className={`material-symbols-outlined text-[26px] transition-transform group-active:scale-90 ${isActive('/calendar') ? '' : 'unfilled'}`}>
              calendar_month
            </span>
            {isActive('/calendar') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
          </div>
        </button>

        <button 
          onClick={() => navigate('/stats')}
          className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/stats') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          <div className="relative">
            <span className={`material-symbols-outlined text-[26px] transition-transform group-active:scale-90 ${isActive('/stats') ? '' : 'unfilled'}`}>
              bar_chart
            </span>
            {isActive('/stats') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
          </div>
        </button>

        <button 
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/settings') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          <div className="relative">
            <span className={`material-symbols-outlined text-[26px] transition-transform group-active:scale-90 ${isActive('/settings') ? '' : 'unfilled'}`}>
              settings
            </span>
            {isActive('/settings') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
          </div>
        </button>
      </div>
    </nav>
  );
};