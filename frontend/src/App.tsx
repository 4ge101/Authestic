/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { SearchResultsOverlay } from './components/SearchResultsOverlay';

// Auth & Protection
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { api } from './services/api';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Dedicated User Pages
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PlayPage } from './pages/PlayPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryReaderPage } from './pages/StoryReaderPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { LifeSkillsPage } from './pages/LifeSkillsPage';
import { SensoryPage } from './pages/SensoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { ActivityPlayerModal } from './components/ActivityPlayerModal';
import { SensoryBubbleModal } from './components/SensoryBubbleModal';
import { CaregiverModal } from './components/CaregiverModal';

// Motion & Global Components
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';

import {
  INITIAL_USER_PROFILE,
  INITIAL_DAILY_GOALS,
  INITIAL_LEARNING_PROGRESS,
  ACTIVITIES_CATALOG,
  RESOURCES_CATALOG,
} from './data/mockData';
import { Activity, DailyGoal, LearningProgress, ResourceItem, UserProfile } from './types';
import { playGentleChime, playSoftSuccess } from './utils/audio';

function MainAppShell() {
  const navigate = useNavigate();
  const { user: authUser, updatePreferences: savePreferences, updateName: saveName } = useAuth();

  // Application State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [goals, setGoals] = useState<DailyGoal[]>(INITIAL_DAILY_GOALS);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES_CATALOG);
  const [resources] = useState<ResourceItem[]>(RESOURCES_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [isActivityPlayerOpen, setIsActivityPlayerOpen] = useState(false);
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state from Authenticated User
  useEffect(() => {
    if (authUser) {
      setUser((prev: UserProfile) => ({
        ...prev,
        id: authUser.id,
        name: authUser.name,
        role: authUser.role,
        preferences: {
          ...prev.preferences,
          soundEnabled: authUser.preferences.soundEnabled ?? true,
          reducedMotion: authUser.preferences.reducedMotion ?? false,
          highContrast: authUser.preferences.highContrast ?? false,
        },
      }));
    }
  }, [authUser]);

  // Load Database Goals and Activities
  useEffect(() => {
    if (authUser) {
      api.progress.getGoals()
        .then((dbGoals) => {
          if (dbGoals && dbGoals.length > 0) {
            setGoals(dbGoals as any);
          }
        })
        .catch(() => {});

      api.content.getActivities()
        .then((dbActs) => {
          if (dbActs && dbActs.length > 0) {
            setActivities((prev: Activity[]) => {
              const map = new Map(prev.map((a) => [a.id, a]));
              for (const item of dbActs) {
                if (map.has(item.id)) {
                  const existing = map.get(item.id)!;
                  map.set(item.id, {
                    ...existing,
                    title: item.title,
                    description: item.description,
                  });
                }
              }
              return Array.from(map.values());
            });
          }
        })
        .catch(() => {});
    }
  }, [authUser]);

  // Derived Progress Calculation
  const progress: LearningProgress = useMemo(() => {
    const completedGoals = goals.filter((g) => g.completed).length;
    const completedActs = activities.filter((a) => a.completed).length;
    const totalAssigned = 5;
    const completedCount = Math.min(totalAssigned, completedGoals + completedActs);
    const overallPercentage = Math.round((completedCount / totalAssigned) * 100);

    return {
      overallPercentage,
      completedCount,
      totalAssigned,
      encouragingMessage: INITIAL_LEARNING_PROGRESS.encouragingMessage,
      currentMilestone: INITIAL_LEARNING_PROGRESS.currentMilestone,
    };
  }, [goals, activities]);

  // Goal Toggle with real backend persistence
  const handleToggleGoal = (goalId: string) => {
    setGoals((prev: DailyGoal[]) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const nextState = !g.completed;
          if (nextState) {
            playSoftSuccess(user.preferences.soundEnabled);
          } else {
            playGentleChime(user.preferences.soundEnabled, 350);
          }
          // Persist to backend database
          api.progress.toggleGoal(goalId, nextState).catch(() => {});
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  // Preference Updates with backend persistence
  const handleUpdatePreferences = (updated: Partial<UserProfile['preferences']>) => {
    setUser((prev: UserProfile) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updated,
      },
    }));
    savePreferences(updated).catch(() => {});
  };

  const handleUpdateUserName = (name: string) => {
    setUser((prev: UserProfile) => ({ ...prev, name }));
    saveName(name).catch(() => {});
  };

  const handleToggleSound = () => {
    const nextVal = !user.preferences.soundEnabled;
    handleUpdatePreferences({ soundEnabled: nextVal });
    if (nextVal) {
      playGentleChime(true, 520);
    }
  };

  const handleToggleMotion = () => {
    handleUpdatePreferences({ reducedMotion: !user.preferences.reducedMotion });
  };

  // Activity start
  const handleStartActivity = (activity: Activity) => {
    if (activity.id === 'act-breathing-bubble') {
      setIsSensoryModalOpen(true);
      return;
    }
    if (activity.id === 'act-visual-feelings') {
      navigate('/communication');
      return;
    }
    if (activity.id === 'act-routine-morning') {
      navigate('/life-skills');
      return;
    }
    setActiveActivity(activity);
    setIsActivityPlayerOpen(true);
  };

  const handleCompleteActivity = (activityId: string) => {
    setActivities((prev: Activity[]) =>
      prev.map((act) => {
        if (act.id === activityId) {
          // Persist completion to backend
          api.progress.completeActivity(activityId, act.totalSteps, 100).catch(() => {});
          return {
            ...act,
            completed: true,
            completedSteps: act.totalSteps,
            progressPercent: 100,
          };
        }
        return act;
      })
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#F8F6F0] text-[#263831] flex flex-col md:flex-row relative ${
        user.preferences.highContrast ? 'contrast-105' : ''
      }`}
    >
      {/* Desktop Fixed Left Sidebar */}
      <Sidebar
        onCloseMobileDrawer={() => setMobileMenuOpen(false)}
        className="hidden md:flex fixed top-0 left-0 bottom-0 z-30 h-screen"
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-[#263831]/40 md:hidden flex backdrop-blur-2xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#F0EBDD] p-4 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              onCloseMobileDrawer={() => setMobileMenuOpen(false)}
              className="w-full min-h-full border-none p-2"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative md:ml-[205px]">
        {/* Floating Top Right Area with Search & Profile */}
        <div className="relative">
          <Header
            user={user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCaregiverModal={() => setIsCaregiverModalOpen(true)}
            onToggleSound={handleToggleSound}
            onToggleMotion={handleToggleMotion}
            onOpenMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            mobileMenuOpen={mobileMenuOpen}
          />

          {/* Search Dropdown Overlay */}
          {searchQuery && (
            <SearchResultsOverlay
              query={searchQuery}
              activities={activities}
              resources={resources}
              onSelectActivity={(act: Activity) => {
                setSearchQuery('');
                handleStartActivity(act);
              }}
              onOpenResource={(res: ResourceItem) => {
                setSearchQuery('');
                navigate(`/resources/${res.id}`);
              }}
              onClose={() => setSearchQuery('')}
            />
          )}
        </div>

        {/* Dynamic User Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                progress={progress}
                goals={goals}
                activities={activities}
                onToggleGoal={handleToggleGoal}
                onStartActivity={handleStartActivity}
                onOpenSensoryBreak={() => setIsSensoryModalOpen(true)}
              />
            }
          />
          <Route
            path="/learn"
            element={
              <LearnPage
                activities={activities}
                onStartActivity={handleStartActivity}
              />
            }
          />
          <Route
            path="/play"
            element={
              <PlayPage
                activities={activities}
                onStartActivity={handleStartActivity}
              />
            }
          />
          <Route
            path="/games"
            element={
              <PlayPage
                activities={activities}
                onStartActivity={handleStartActivity}
              />
            }
          />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:storyId" element={<StoryReaderPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/life-skills" element={<LifeSkillsPage />} />
          <Route path="/sensory" element={<SensoryPage />} />
          <Route
            path="/progress"
            element={
              <ProgressPage
                progress={progress}
                goals={goals}
                activities={activities}
                onToggleGoal={handleToggleGoal}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                user={user}
                onUpdatePreferences={handleUpdatePreferences}
                onUpdateUserName={handleUpdateUserName}
              />
            }
          />
          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="px-6 py-20 text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-[#263831] mb-2">Page Not Found</h2>
                <p className="text-sm text-[#728078] mb-6">
                  Let us return to the gentle home screen together.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-full bg-[#568469] text-white font-bold text-xs cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            }
          />
        </Routes>

        {/* Footer */}
        <Footer
          soundEnabled={user.preferences.soundEnabled}
          onToggleSound={handleToggleSound}
          reducedMotion={user.preferences.reducedMotion}
          onToggleMotion={handleToggleMotion}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Interactive Modals */}
      <ActivityPlayerModal
        activity={activeActivity}
        isOpen={isActivityPlayerOpen}
        onClose={() => setIsActivityPlayerOpen(false)}
        onCompleteActivity={handleCompleteActivity}
        soundEnabled={user.preferences.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <SensoryBubbleModal
        isOpen={isSensoryModalOpen}
        onClose={() => setIsSensoryModalOpen(false)}
        soundEnabled={user.preferences.soundEnabled}
        onToggleSound={handleToggleSound}
        reducedMotion={user.preferences.reducedMotion}
      />

      <CaregiverModal
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
        user={user}
        resources={resources}
        onUpdatePreferences={handleUpdatePreferences}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Administrator Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="audit" element={<AdminAuditPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Protected Main Application */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainAppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
