import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Home } from './pages/Home.tsx';
import { Stories } from './pages/Stories.tsx';
import { Activities } from './pages/Activities.tsx';
import { Learning } from './pages/Learning.tsx';
import { Games } from './pages/Games.tsx';
import { Progress } from './pages/Progress.tsx';
import { Profile } from './pages/Profile.tsx';
import { Settings } from './pages/Settings.tsx';
import { loadSettings, applySettingsToDOM } from './lib/storage.ts';

export const App: React.FC = () => {
  // Initialize accessibility preferences on mount
  useEffect(() => {
    const settings = loadSettings();
    applySettingsToDOM(settings);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Desktop Sidebar & Mobile Bottom Bar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="main-wrapper">
          <Navbar />
          <main className="page-content" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/games" element={<Games />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
