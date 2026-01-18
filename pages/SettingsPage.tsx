import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';

// Reusable Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { user, preferences, toggleTheme, updateUser, updatePreferences, exportData, logout } = useApp();
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'profile' | 'notifications' | 'language' | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Local Form States
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const handleSaveProfile = () => {
    updateUser({ name: editName, avatar: editAvatar });
    setActiveModal(null);
  };

  const handleSyncToggle = () => {
    if (preferences.calendarSync) {
      updatePreferences({ calendarSync: false });
    } else {
      setIsSyncing(true);
      // Simulate API call
      setTimeout(() => {
        setIsSyncing(false);
        updatePreferences({ calendarSync: true });
        // Could show toast here
      }, 1500);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out? This will reset all your local data.")) {
      logout();
    }
  };

  const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
        {children}
      </div>
    </div>
  );

  const SettingItem: React.FC<{ 
    icon: string; 
    label: string; 
    value?: string; 
    isToggle?: boolean; 
    toggleState?: boolean; 
    onToggle?: () => void;
    onClick?: () => void;
    isDestructive?: boolean;
    hasArrow?: boolean;
    isLoading?: boolean;
  }> = ({ icon, label, value, isToggle, toggleState, onToggle, onClick, isDestructive, hasArrow, isLoading }) => (
    <button 
      onClick={isToggle && !isLoading ? onToggle : onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-between p-4 text-left transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/10 ${isLoading ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300'}`}>
          {isLoading ? (
             <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          ) : (
             <span className="material-symbols-outlined text-[18px]">{icon}</span>
          )}
        </div>
        <span className={`text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-400">{value}</span>}
        
        {isToggle && (
           <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${toggleState ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}>
             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${toggleState ? 'translate-x-6' : 'translate-x-1'}`} />
           </div>
        )}

        {hasArrow && <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-xl">chevron_right</span>}
      </div>
    </button>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display h-full flex flex-col overflow-hidden relative selection:bg-primary/30 max-w-md mx-auto shadow-2xl border-x border-gray-200 dark:border-white/5">
      
      {/* Header */}
      <header className="flex-none px-6 pt-12 pb-6 z-20">
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-28">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 mb-8">
          <div className="relative">
            <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover bg-gray-200" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">{user.name}</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400">Keep up the good work!</p>
          </div>
          <button 
            onClick={() => {
              setEditName(user.name);
              setEditAvatar(user.avatar);
              setActiveModal('profile');
            }}
            className="text-primary font-bold text-sm px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            Edit
          </button>
        </div>

        <SettingSection title="Preferences">
          <SettingItem 
            icon="dark_mode" 
            label="Dark Mode" 
            isToggle={true} 
            toggleState={preferences.theme === 'dark'} 
            onToggle={toggleTheme} 
          />
          <SettingItem 
            icon="notifications" 
            label="Notifications" 
            hasArrow={true}
            value={preferences.notifications ? 'On' : 'Off'}
            onClick={() => setActiveModal('notifications')}
          />
           <SettingItem 
            icon="language" 
            label="Language" 
            value={preferences.language}
            hasArrow={true}
            onClick={() => setActiveModal('language')}
          />
        </SettingSection>

        <SettingSection title="Data & Storage">
          <SettingItem 
            icon="cloud_sync" 
            label={isSyncing ? "Syncing..." : "Sync with Calendar"}
            isToggle={true}
            toggleState={preferences.calendarSync}
            isLoading={isSyncing}
            onToggle={handleSyncToggle}
          />
          <SettingItem 
            icon="download" 
            label="Export Data" 
            onClick={exportData}
          />
        </SettingSection>

        <SettingSection title="About">
          <SettingItem 
            icon="info" 
            label="Version" 
            value="1.0.2 (Beta)"
          />
          <SettingItem 
            icon="help" 
            label="Help & Support" 
            hasArrow={true}
          />
          <SettingItem 
            icon="logout" 
            label="Sign Out" 
            isDestructive={true}
            onClick={handleLogout}
          />
        </SettingSection>

        <div className="text-center mt-4 mb-8">
           <p className="text-xs text-gray-300 dark:text-gray-600">FocusFlow Inc. © 2024</p>
        </div>
      </main>

      <BottomNav />

      {/* --- MODALS --- */}

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={activeModal === 'profile'} 
        onClose={() => setActiveModal(null)} 
        title="Edit Profile"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
            <input 
              type="text" 
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button 
            onClick={handleSaveProfile}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-2 hover:bg-primary-dark active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal 
        isOpen={activeModal === 'notifications'} 
        onClose={() => setActiveModal(null)} 
        title="Notifications"
      >
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Allow Notifications</span>
            <div 
              onClick={() => updatePreferences({ notifications: !preferences.notifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${preferences.notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
          <div className={`flex items-center justify-between py-3 transition-opacity ${!preferences.notifications ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Sounds</span>
            <div 
              onClick={() => updatePreferences({ sound: !preferences.sound })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${preferences.sound ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.sound ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
          <div className={`flex items-center justify-between py-3 transition-opacity ${!preferences.notifications ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Haptic Feedback</span>
             <div 
              onClick={() => updatePreferences({ haptics: !preferences.haptics })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${preferences.haptics ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.haptics ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Language Modal */}
      <Modal 
        isOpen={activeModal === 'language'} 
        onClose={() => setActiveModal(null)} 
        title="Select Language"
      >
        <div className="flex flex-col gap-1">
          {['English', 'Spanish', 'Chinese', 'Japanese'].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                updatePreferences({ language: lang as any });
                setActiveModal(null);
              }}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${preferences.language === lang ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300'}`}
            >
              <span className="font-medium">{lang}</span>
              {preferences.language === lang && <span className="material-symbols-outlined text-xl">check</span>}
            </button>
          ))}
        </div>
      </Modal>

    </div>
  );
};