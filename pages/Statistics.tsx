import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const { calculateStreak, tasks } = useApp();

  const currentStreak = calculateStreak();

  // Simple mock heatmap derived from actual data + filler
  const weeks = 12;
  const daysPerWeek = 7;
  
  const getOpacity = (weekIndex: number, dayIndex: number) => {
     // Check if this specific day (relative to today) has tasks
     // For demo visual purposes, we mix real data check with random noise for older dates
     const today = new Date();
     const daysAgo = (weeks * 7) - (weekIndex * 7 + dayIndex);
     const d = new Date(today);
     d.setDate(today.getDate() - daysAgo);
     const dateStr = d.toISOString().split('T')[0];
     
     const hasCompletedTask = tasks.some(t => t.date === dateStr && t.completed);
     
     if (hasCompletedTask) return 'bg-primary';
     
     // Random noise for visual "past data"
     if (weekIndex < 8) {
        const rand = Math.random();
        if (rand > 0.8) return 'bg-primary/50';
        if (rand > 0.7) return 'bg-primary/20';
     }
     
     return 'bg-zinc-200 dark:bg-zinc-800';
  };

  const heatmapGrid = Array.from({ length: weeks }).map((_, w) => (
      <div key={w} className="grid grid-rows-7 gap-1.5">
          {Array.from({ length: daysPerWeek }).map((_, d) => (
              <div key={d} className={`w-3.5 h-3.5 rounded-sm ${getOpacity(w, d)}`}></div>
          ))}
      </div>
  ));
  
  const completedToday = tasks.filter(t => t.completed && t.date === new Date().toISOString().split('T')[0]).length;
  const totalTasks = tasks.length;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-primary/30 max-w-md mx-auto shadow-2xl border-x border-gray-200 dark:border-white/5">
      {/* Top App Bar */}
      <header className="flex items-center justify-between p-6 sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Progress</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-12 space-y-10 overflow-y-auto no-scrollbar">
        {/* Consistency */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Consistency</h2>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Last 3 Months</span>
          </div>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/50">
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-1 min-w-max">
                  {heatmapGrid}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Updated today</span>
              </div>
              <span>{totalTasks} Total Tasks</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/50 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform duration-300">local_fire_department</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">+{completedToday} Today</span>
              </div>
              <div>
                <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">{currentStreak}</p>
                <p className="text-sm text-zinc-500 font-medium">Current Streak</p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/50 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-zinc-400 text-2xl">emoji_events</span>
              </div>
              <div>
                <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">45</p>
                <p className="text-sm text-zinc-500 font-medium">Best Streak</p>
              </div>
            </div>
          </div>
        </section>

        {/* Medals */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Medals</h2>
            <button className="text-sm font-medium text-primary hover:text-primary/80">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {/* Bronze */}
            <div className={`aspect-[3/4] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 border relative overflow-hidden group transition-all
                ${currentStreak >= 7 
                    ? 'bg-gradient-to-br from-amber-100 to-amber-50 dark:from-[#3a2e1d] dark:to-surface-dark border-amber-200 dark:border-amber-900/30' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-dashed border-zinc-200 dark:border-zinc-800 opacity-60'
                }
            `}>
               {currentStreak >= 7 && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>}
               <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${currentStreak >= 7 ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 group-hover:scale-110' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                 <span className={`material-symbols-outlined text-xl ${currentStreak >= 7 ? 'text-white' : 'text-zinc-400'}`}>{currentStreak >= 7 ? 'military_tech' : 'lock'}</span>
               </div>
               <div className="z-10">
                 <p className={`text-xs font-bold ${currentStreak >= 7 ? 'text-amber-900 dark:text-amber-100' : 'text-zinc-400 dark:text-zinc-500'}`}>7 Days</p>
                 <p className={`text-[10px] font-medium ${currentStreak >= 7 ? 'text-amber-700/70 dark:text-amber-200/50' : 'text-zinc-400 dark:text-zinc-600'}`}>Bronze Week</p>
               </div>
            </div>
             {/* Silver */}
            <div className={`aspect-[3/4] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 border relative overflow-hidden group transition-all
                ${currentStreak >= 21 
                    ? 'bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-surface-dark border-zinc-200 dark:border-zinc-700' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-dashed border-zinc-200 dark:border-zinc-800 opacity-60'
                }
            `}>
               {currentStreak >= 21 && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>}
               <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${currentStreak >= 21 ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg shadow-slate-500/20 group-hover:scale-110' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                 <span className={`material-symbols-outlined text-xl ${currentStreak >= 21 ? 'text-white' : 'text-zinc-400'}`}>{currentStreak >= 21 ? 'workspace_premium' : 'lock'}</span>
               </div>
               <div className="z-10">
                 <p className={`text-xs font-bold ${currentStreak >= 21 ? 'text-slate-800 dark:text-slate-100' : 'text-zinc-400 dark:text-zinc-500'}`}>21 Days</p>
                 <p className={`text-[10px] font-medium ${currentStreak >= 21 ? 'text-slate-600 dark:text-slate-400' : 'text-zinc-400 dark:text-zinc-600'}`}>Habit Formed</p>
               </div>
            </div>
             {/* Gold/Locked */}
            <div className={`aspect-[3/4] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 border relative overflow-hidden group transition-all
                ${currentStreak >= 100 
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-surface-dark border-yellow-200 dark:border-yellow-700' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-dashed border-zinc-200 dark:border-zinc-800 opacity-60'
                }
            `}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${currentStreak >= 100 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                 <span className={`material-symbols-outlined text-xl ${currentStreak >= 100 ? 'text-white' : 'text-zinc-400'}`}>{currentStreak >= 100 ? 'emoji_events' : 'lock'}</span>
               </div>
               <div>
                 <p className={`text-xs font-bold ${currentStreak >= 100 ? 'text-yellow-900 dark:text-yellow-100' : 'text-zinc-400 dark:text-zinc-500'}`}>100 Days</p>
                 <p className={`text-[10px] font-medium ${currentStreak >= 100 ? 'text-yellow-700/70 dark:text-yellow-200/50' : 'text-zinc-400 dark:text-zinc-600'}`}>Centurion</p>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};