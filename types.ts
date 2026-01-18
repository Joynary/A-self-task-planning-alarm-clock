export interface Task {
  id: string;
  title: string;
  notes?: string;
  time?: string;
  completed: boolean;
  category: 'Work' | 'Personal' | 'Health' | 'Other';
  date: string; // ISO Date string YYYY-MM-DD
}

export interface User {
  name: string;
  avatar: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  sound: boolean;
  haptics: boolean;
  language: 'English' | 'Spanish' | 'Chinese' | 'Japanese';
  calendarSync: boolean;
}

export enum NotificationType {
  CAPSULE = 'capsule',
  SYSTEM = 'system',
  ALARM = 'alarm'
}

export interface AppState {
  tasks: Task[];
  user: User;
  activeNotification: Task | null;
  preferences: UserPreferences;
}