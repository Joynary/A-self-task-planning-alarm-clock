import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

export const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState('09:00');
  const [meridiem, setMeridiem] = useState('AM');
  const [recurrence, setRecurrence] = useState('Daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Task['category']>('Personal');

  const categories: Task['category'][] = ['Work', 'Personal', 'Health', 'Other'];

  const handleSave = () => {
    if (!title) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      notes,
      time: `${time} ${meridiem}`,
      completed: false,
      category,
      date, // Use selected date
    };

    addTask(newTask);
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display antialiased selection:bg-primary/30 selection:text-primary max-w-md mx-auto relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-200">
        <button onClick={() => navigate(-1)} className="text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
          Cancel
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">New Task</h1>
        <button onClick={handleSave} className="text-base font-bold text-primary hover:text-primary/80 transition-colors">
          Save
        </button>
      </header>

      <main className="w-full p-4 flex flex-col gap-6 pb-24 flex-1 overflow-y-auto no-scrollbar">
        {/* Input Group */}
        <section className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className="p-4 pb-2">
            <label htmlFor="task-name" className="sr-only">Task Name</label>
            <input 
              id="task-name" 
              type="text" 
              autoFocus
              className="w-full bg-transparent border-none p-0 text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-0 leading-tight focus:outline-none"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="px-4">
            <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>
          </div>
          <div className="p-4 pt-3">
            <label htmlFor="task-notes" className="sr-only">Notes</label>
            <textarea 
              id="task-notes" 
              rows={3} 
              className="w-full bg-transparent border-none p-0 text-base font-normal text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:ring-0 resize-none leading-relaxed focus:outline-none"
              placeholder="Add notes or context..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            ></textarea>
          </div>
        </section>

        {/* Date & Category */}
        <section className="flex flex-col gap-3">
            <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">Details</h2>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                 {/* Date Picker */}
                 <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                        <span className="text-base font-medium text-gray-900 dark:text-white">Date</span>
                    </div>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-none text-right font-medium text-gray-600 dark:text-gray-300 focus:ring-0"
                    />
                 </div>
                 
                 {/* Category Picker */}
                 <div className="flex flex-col p-4 gap-3">
                     <div className="flex items-center gap-3">
                         <span className="material-symbols-outlined text-gray-400">category</span>
                         <span className="text-base font-medium text-gray-900 dark:text-white">Category</span>
                     </div>
                     <div className="flex gap-2 flex-wrap">
                         {categories.map(cat => (
                             <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                    category === cat 
                                    ? 'bg-primary border-primary text-white' 
                                    : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                                }`}
                             >
                                 {cat}
                             </button>
                         ))}
                     </div>
                 </div>
            </div>
        </section>

        {/* Timing */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">Timing & Recurrence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Time Picker */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm ring-1 ring-black/5 dark:ring-white/10 cursor-pointer hover:ring-primary/50 dark:hover:ring-primary/50 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary transform rotate-12 translate-x-2 -translate-y-2">schedule</span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 z-10">Time</span>
              <div className="flex items-baseline gap-1 z-10">
                <input 
                  type="text" 
                  value={time} 
                  onChange={e => setTime(e.target.value)}
                  className="bg-transparent border-none p-0 text-4xl font-bold text-gray-900 dark:text-white tracking-tight w-24 focus:ring-0 focus:outline-none"
                />
                <button 
                  onClick={() => setMeridiem(m => m === 'AM' ? 'PM' : 'AM')}
                  className="text-lg font-medium text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                >
                  {meridiem}
                </button>
              </div>
            </div>

            {/* Recurrence */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Repeat</span>
                <button className="text-primary hover:text-primary/80">
                  <span className="material-symbols-outlined text-xl">edit_calendar</span>
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {['Daily', 'Weekdays', 'Custom'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setRecurrence(opt)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${recurrence === opt ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">Notification Style</h2>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
             {/* Capsule */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined text-lg">call_to_action</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-900 dark:text-white">In-App Capsule</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};