import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { FeelingGarden } from './pages/FeelingGarden.tsx';
import { CaregiverPortal } from './pages/CaregiverPortal.tsx';
import { loadSettings, applySettingsToDOM } from './lib/storage.ts';
import { smoothScrollTo, animatePageEntrance } from './lib/smoothScroll.ts';

const RouteNavigationHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    smoothScrollTo(0, 0.4);
    const mainEl = document.querySelector('main.page-content') as HTMLElement | null;
    if (mainEl) {
      animatePageEntrance(mainEl);
    }
  }, [location.pathname]);

  return null;
};

export const App: React.FC = () => {
  // Initialize accessibility preferences on mount
  useEffect(() => {
    const settings = loadSettings();
    applySettingsToDOM(settings);
  }, []);

  return (
    <BrowserRouter>
      <RouteNavigationHandler />
      <div className="app-container">
        {/* Desktop Sidebar & Mobile Bottom Bar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="main-wrapper">
          <Navbar />
          <main className="page-content" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/garden" element={<FeelingGarden />} />
              <Route path="/feelings" element={<FeelingGarden />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/games" element={<Games />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/caregiver" element={<CaregiverPortal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
