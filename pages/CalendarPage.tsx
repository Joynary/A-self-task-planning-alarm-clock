import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { BottomNav } from '../components/BottomNav';

export const CalendarPage: React.FC = () => {
  const { tasks, toggleTask } = useApp();
  
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  // Tracks the month currently being viewed in the Month View
  const [displayMonth, setDisplayMonth] = useState(new Date());

  // Week View Data
  const [weekDays, setWeekDays] = useState<{ day: string, date: string, fullDate: string, status: string }[]>([]);

  // Generate Week View Strip (centered around selected date or today)
  useEffect(() => {
    // For week view, we centre around the selected date
    const centerDate = new Date(selectedDateStr);
    const newDays = [];
    
    // Generate a window of dates (e.g., -3 to +3)
    for (let i = -3; i < 4; i++) {
        const d = new Date(centerDate);
        d.setDate(centerDate.getDate() + i);
        
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = d.toLocaleDateString('en-US', { day: 'numeric' });
        
        let status = 'future';
        const todayStr = new Date().toISOString().split('T')[0];
        
        if (dateStr < todayStr) status = 'past';
        if (dateStr === todayStr) status = 'today';
        
        newDays.push({
            day: dayName,
            date: dayNum,
            fullDate: dateStr,
            status: status
        });
    }
    setWeekDays(newDays);
  }, [selectedDateStr]);

  // Month View Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const generateMonthGrid = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const gridDays = [];
    
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
        gridDays.push(null);
    }
    
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dateStr = d.toISOString().split('T')[0];
        gridDays.push({
            dayNum: i,
            fullDate: dateStr
        });
    }
    
    return gridDays;
  };

  const monthGrid = generateMonthGrid();

  const handleMonthChange = (increment: number) => {
      const newMonth = new Date(displayMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      setDisplayMonth(newMonth);
  };

  const dailyTasks = tasks.filter(t => t.date === selectedDateStr);
  const taskCount = dailyTasks.length;

  const displayDateObj = new Date(selectedDateStr);
  // Header date depends on view mode. If month view, show displayMonth. If week view, show selectedDate.
  const headerDateTitle = viewMode === 'month' 
    ? displayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : displayDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const formattedDayTitle = displayDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display h-full flex flex-col overflow-hidden relative selection:bg-primary/30 max-w-md mx-auto shadow-2xl border-x border-gray-200 dark:border-white/5">
      
      {/* Top Header */}
      <header className="flex-none px-6 pt-12 pb-2 z-20 bg-background-light dark:bg-background-dark transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{headerDateTitle}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">Keep moving forward</p>
            </div>
            {viewMode === 'month' && (
                <div className="flex gap-1 ml-2">
                    <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-slate-500">
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-slate-500">
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                </div>
            )}
          </div>
          <button 
            onClick={() => {
                const today = new Date();
                setSelectedDateStr(today.toISOString().split('T')[0]);
                setDisplayMonth(today);
            }}
            className="flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-surface-dark rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-primary hover:bg-slate-300 dark:hover:bg-[#333] transition-colors"
          >
            Today
          </button>
        </div>

        {/* Segmented Control */}
        <div className="flex p-1 bg-slate-200 dark:bg-surface-dark rounded-xl mb-4 w-full relative">
          {/* Animated Background Indicator */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#38383e] shadow-sm rounded-lg transition-all duration-300 ease-spring ${viewMode === 'month' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
          ></div>

          <button 
            onClick={() => setViewMode('week')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold z-10 transition-colors ${viewMode === 'week' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => {
                setViewMode('month');
                // Ensure month view shows the month of the selected date initially
                setDisplayMonth(new Date(selectedDateStr));
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold z-10 transition-colors ${viewMode === 'month' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Month
          </button>
        </div>
      </header>

      {/* View Content Area */}
      <div className="flex-none w-full pb-2 transition-all duration-300">
        {viewMode === 'week' ? (
             /* Week Strip */
            <div className="pl-6 overflow-x-auto no-scrollbar scroll-smooth pb-4">
                <div className="flex space-x-3 pr-6 min-w-max">
                {weekDays.map((d) => {
                    const isActive = d.fullDate === selectedDateStr;
                    const hasTasks = tasks.some(t => t.date === d.fullDate);
                    const isToday = d.fullDate === new Date().toISOString().split('T')[0];
                    
                    return (
                    <button 
                        key={d.fullDate}
                        onClick={() => setSelectedDateStr(d.fullDate)}
                        className={`group flex flex-col items-center justify-between w-[72px] h-[110px] p-2 rounded-2xl border transition-all duration-300
                        ${isActive
                            ? 'bg-primary shadow-lg shadow-primary/25 border-primary transform scale-105 relative overflow-hidden' 
                            : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-transparent opacity-60 hover:opacity-100'
                        }
                        `}
                    >
                        {isActive && <div className="absolute top-0 w-8 h-1 bg-white/30 rounded-b-full"></div>}
                        <span className={`text-xs font-bold uppercase mt-2 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>{d.day}</span>
                        <div className="flex flex-col items-center">
                            <span className={`text-2xl font-semibold ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{d.date}</span>
                            {isToday && !isActive && <span className="text-[9px] text-primary font-bold uppercase">Today</span>}
                        </div>
                        <div className="flex gap-1 mb-2 h-1.5">
                        {hasTasks && (
                            <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-primary/40'}`}></div>
                        )}
                        </div>
                    </button>
                    );
                })}
                </div>
            </div>
        ) : (
            /* Month Grid */
            <div className="px-6 pb-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="grid grid-cols-7 mb-2">
                    {['S','M','T','W','T','F','S'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                    {monthGrid.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`}></div>;
                        
                        const isActive = day.fullDate === selectedDateStr;
                        const isToday = day.fullDate === new Date().toISOString().split('T')[0];
                        const hasTasks = tasks.some(t => t.date === day.fullDate && !t.completed);
                        const hasCompletedTasks = tasks.some(t => t.date === day.fullDate && t.completed);

                        return (
                            <button 
                                key={day.fullDate}
                                onClick={() => setSelectedDateStr(day.fullDate)}
                                className={`aspect-square relative flex flex-col items-center justify-center rounded-xl transition-all
                                    ${isActive 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10' 
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }
                                    ${isToday && !isActive ? 'ring-1 ring-primary text-primary' : ''}
                                `}
                            >
                                <span className={`text-sm font-semibold ${isActive ? 'text-white' : ''}`}>{day.dayNum}</span>
                                <div className="flex gap-0.5 mt-0.5 h-1">
                                    {hasTasks && <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`}></div>}
                                    {!hasTasks && hasCompletedTasks && <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white/50' : 'bg-slate-300 dark:bg-slate-600'}`}></div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {/* Task List Container */}
      <main className="flex-1 min-h-0 relative z-10 w-full bg-white dark:bg-[#121215] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-black/50 overflow-hidden flex flex-col">
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => {}}>
           {/* Handle Bar visual */}
          <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700/50"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4">
           <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formattedDayTitle}</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{taskCount} TASKS</span>
          </div>

          <div className="flex flex-col gap-4">
            {dailyTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))}
            
            {taskCount === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                    <p className="text-sm font-medium">No tasks planned for this day.</p>
                    <button 
                        onClick={() => {/* could navigate to create with date param */}}
                        className="mt-4 text-primary text-sm font-bold hover:underline"
                    >
                        Tap + to add one
                    </button>
                </div>
            )}
          </div>
          <div className="h-8"></div>
        </div>
      </main>

       {/* Floating Action Button */}
      <button className="absolute bottom-24 right-6 z-30 flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-transform duration-200 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>

      <BottomNav />
    </div>
  );
};