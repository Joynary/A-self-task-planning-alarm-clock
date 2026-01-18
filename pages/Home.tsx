import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { BottomNav } from '../components/BottomNav';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, user, toggleTask } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  
  const activeTasks = todaysTasks.filter(t => !t.completed);
  const completedTasks = todaysTasks.filter(t => t.completed);
  const remainingCount = activeTasks.length;
  const progress = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark border-x border-gray-200 dark:border-white/5">
      {/* Header */}
      <header className="flex items-start justify-between px-6 pt-12 pb-6 z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            <span className="material-symbols-outlined text-[20px]">cloud</span>
            <span>68°F Cloudy</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
            Today,<br />
            <span className="text-gray-400 dark:text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </h1>
        </div>
        <button className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm">
            <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
          </div>
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </button>
      </header>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">Your Focus</span>
          <span className="text-xs text-gray-400">{remainingCount} remaining</span>
        </div>
        <div className="h-1 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(51,153,153,0.5)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task List */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 flex flex-col gap-4">
        {activeTasks.map(task => (
          <TaskCard key={task.id} task={task} onToggle={toggleTask} />
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="flex items-center gap-4 py-2 opacity-50 mt-2">
              <div className="h-px bg-gray-300 dark:bg-white/10 flex-1"></div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Completed</span>
              <div className="h-px bg-gray-300 dark:bg-white/10 flex-1"></div>
            </div>
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </>
        )}
        
        <div className="h-8"></div>
      </main>

      {/* FAB */}
      <div className="absolute bottom-24 right-6 z-30">
        <button 
          onClick={() => navigate('/create')}
          className="h-14 w-14 rounded-2xl bg-primary text-white shadow-[0_8px_30px_rgb(51,153,153,0.35)] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};