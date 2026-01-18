import React, { useState, useRef } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (task.completed) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX || task.completed) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // Only allow dragging to the right
    if (diff > 0) {
      setOffsetX(Math.min(diff, 150)); // Cap at 150px
    }
  };

  const handleTouchEnd = () => {
    if (!startX || task.completed) return;
    
    if (offsetX > 100) {
      // Trigger complete
      onToggle(task.id);
    }
    
    // Reset
    setStartX(null);
    setOffsetX(0);
    setIsDragging(false);
  };

  // Calculate opacity for the background success indicator
  const progress = Math.min(offsetX / 100, 1);

  return (
    <div 
      className="relative select-none touch-pan-y"
      ref={cardRef}
    >
      {/* Swipe Background Indicator */}
      <div 
        className="absolute inset-0 bg-primary/20 rounded-xl flex items-center justify-start px-6 transition-all duration-200"
        style={{ opacity: isDragging ? progress : 0 }}
      >
        <span 
          className="material-symbols-outlined text-primary font-bold transition-transform duration-200"
          style={{ transform: `scale(${0.5 + progress * 0.8})` }}
        >
          check_circle
        </span>
        <span className="text-primary font-bold ml-2 text-sm" style={{ opacity: progress }}>Complete</span>
      </div>

      <div 
        className={`relative p-5 rounded-xl shadow-sm dark:shadow-none border flex items-start gap-4 transition-transform duration-200 ease-out will-change-transform
          ${task.completed 
            ? 'bg-gray-50 dark:bg-surface-dark-dim border-transparent opacity-70' 
            : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5'
          }
        `}
        style={{ 
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
            // Fallback for desktop click
            if(offsetX === 0) onToggle(task.id);
        }}
      >
        <div className="relative flex items-center justify-center pt-1">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all
            ${task.completed 
              ? 'bg-primary border-primary' 
              : 'border-gray-300 dark:border-gray-600'
            }
          `}>
             <span className={`material-symbols-outlined text-white text-[16px] transition-all duration-200 ${task.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
               check
             </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold leading-snug mb-1 transition-all ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through decoration-gray-400' : 'text-slate-900 dark:text-white'}`}>
            {task.title}
          </h3>
          <div className={`flex items-center gap-3 text-xs ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-500 dark:text-gray-400'}`}>
            {task.time && (
              <span className={`flex items-center gap-1 ${!task.completed ? 'text-primary' : ''}`}>
                <span className="material-symbols-outlined text-[16px] filled">schedule</span>
                {task.time}
              </span>
            )}
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className={`text-xs px-2 py-0.5 rounded ${task.completed ? 'bg-transparent' : 'bg-gray-100 dark:bg-white/5'} ${task.category === 'Personal' && !task.completed ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10' : ''}`}>
              {task.category}
            </span>
          </div>
        </div>
        
        {!task.completed && <div className="h-8 w-1 bg-primary rounded-full absolute right-0 top-1/2 -translate-y-1/2 rounded-l-none"></div>}
      </div>
    </div>
  );
};