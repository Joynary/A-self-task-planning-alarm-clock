import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Task, User, UserPreferences } from '../types';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design Review Meeting',
    time: '10:00 AM',
    completed: false,
    category: 'Work',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    title: 'Submit Weekly Report',
    time: '1:30 PM',
    completed: false,
    category: 'Work',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '3',
    title: 'Call Mom',
    time: '5:00 PM',
    completed: false,
    category: 'Personal',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '4',
    title: 'Morning Yoga',
    time: '7:00 AM',
    completed: true,
    category: 'Health',
    date: new Date().toISOString().split('T')[0],
  },
];

const INITIAL_USER: User = {
  name: "Alex",
  avatar: "https://picsum.photos/200",
  email: "alex@example.com"
};

const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'dark', // Default
  notifications: true,
  sound: true,
  haptics: true,
  language: 'English',
  calendarSync: false
};

interface AppContextType extends AppState {
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  triggerNotification: (task: Task) => void;
  dismissNotification: () => void;
  calculateStreak: () => number;
  toggleTheme: () => void;
  updateUser: (user: Partial<User>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  exportData: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Load User
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('focusflow_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Load Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('focusflow_preferences');
    if (saved) return JSON.parse(saved);
    
    // Initial theme detection
    const systemTheme = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return { ...INITIAL_PREFERENCES, theme: systemTheme };
  });
  
  const [activeNotification, setActiveNotification] = useState<Task | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusflow_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('focusflow_preferences', JSON.stringify(preferences));
    
    // Apply Theme
    const root = window.document.documentElement;
    if (preferences.theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [preferences]);

  // Actions
  const toggleTheme = () => {
    setPreferences(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const updatePreferences = (updatedPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updatedPrefs }));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (activeNotification && activeNotification.id === id) {
       setTimeout(() => setActiveNotification(null), 500);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const triggerNotification = (task: Task) => {
    if (preferences.notifications) {
      setActiveNotification(task);
      if (preferences.sound) {
        // Play simple beep sound if enabled
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
        audio.volume = 0.2;
        audio.play().catch(() => {}); // Ignore interaction errors
      }
    }
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const calculateStreak = () => {
    const completedDates = new Set(
      tasks
        .filter(t => t.completed)
        .map(t => t.date)
        .sort()
        .reverse()
    );
    if (completedDates.size === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (i === 0 && !completedDates.has(dateStr)) continue; 
        if (completedDates.has(dateStr)) streak++;
        else break;
    }
    return streak;
  };

  const exportData = () => {
    const data = {
      user,
      preferences,
      tasks,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem('focusflow_tasks');
    localStorage.removeItem('focusflow_user');
    localStorage.removeItem('focusflow_preferences');
    window.location.reload();
  };

  // Demo Notification Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingTask = tasks.find(t => !t.completed && t.date === new Date().toISOString().split('T')[0]);
      if (pendingTask && !activeNotification) {
        triggerNotification(pendingTask);
      }
    }, 12000); // Delayed slightly more
    return () => clearTimeout(timer);
  }, [tasks]);

  return (
    <AppContext.Provider value={{ 
      tasks, user, activeNotification, preferences, 
      addTask, toggleTask, deleteTask, triggerNotification, dismissNotification, 
      calculateStreak, toggleTheme, updateUser, updatePreferences, exportData, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};