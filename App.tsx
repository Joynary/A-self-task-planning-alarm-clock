import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { CreateTask } from './pages/CreateTask';
import { CalendarPage } from './pages/CalendarPage';
import { Statistics } from './pages/Statistics';
import { SettingsPage } from './pages/SettingsPage';
import { InAppNotification } from './components/InAppNotification';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="relative h-full w-full">
          <InAppNotification />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;