import { useState, useEffect } from 'react';
import type { UserProfile, UserSettings, UserProgress } from '../lib/types.ts';
import { loadProfile, loadSettings, loadProgress } from '../lib/storage.ts';

export function useAuthsetic() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  useEffect(() => {
    // Listen for storage changes across tabs or window updates
    const handleStorage = () => {
      setProfile(loadProfile());
      setSettings(loadSettings());
      setProgress(loadProgress());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    profile,
    setProfile,
    settings,
    setSettings,
    progress,
    setProgress
  };
}
