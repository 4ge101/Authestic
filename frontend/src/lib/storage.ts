import type { UserProfile, UserSettings, UserProgress, JournalEntry } from './types.ts';

const PROFILE_KEY = 'authsetic_user_profile';
const SETTINGS_KEY = 'authsetic_user_settings';
const PROGRESS_KEY = 'authsetic_user_progress';

export const defaultProfile: UserProfile = {
  name: 'Leo',
  ageRange: '7-9',
  avatar: 'otter',
  readingPreference: 'Picture stories with clear text',
  languagePreference: 'English',
  bio: 'Curious learner who enjoys ocean stories and quiet drawing breaks.'
};

export const defaultSettings: UserSettings = {
  textSize: 'standard',
  reducedMotion: false,
  soundEffects: true,
  highContrast: false,
  dyslexicFont: false,
  language: 'en'
};

export const defaultProgress: UserProgress = {
  completedStories: ['quiet-otter'],
  completedActivities: ['breathing-box'],
  completedLessons: ['understanding-emotions'],
  completedGames: ['feelings-quiz'],
  bookmarkedStories: ['quiet-otter', 'maya-space-bubble'],
  favoritedActivities: ['breathing-box', 'gratitude-journal'],
  weeklyActivity: {
    Mon: 2,
    Tue: 3,
    Wed: 1,
    Thu: 4,
    Fri: 2,
    Sat: 3,
    Sun: 1
  },
  journalEntries: [
    {
      id: 'entry-1',
      date: '2026-10-09',
      mood: 'Calm',
      prompt: 'What was something soft or comforting today?',
      text: 'My fluffy blanket during story time made me feel calm and safe.'
    }
  ],
  gameHighScores: {
    'feelings-quiz': 5,
    'memory-match': 8
  },
  savedAffirmations: ['I take my time and do my best', 'My ideas are special']
};

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage quota or disabled
  }
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettingsToDOM(settings);
  } catch {
    // Storage quota or disabled
  }
}

export function applySettingsToDOM(settings: UserSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Text size
  root.setAttribute('data-text-size', settings.textSize);

  // Reduced motion
  root.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');

  // High contrast
  root.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');

  // Dyslexic font mode
  root.setAttribute('data-font-mode', settings.dyslexicFont ? 'dyslexic' : 'normal');
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage quota or disabled
  }
}

export function recordActivityCompleted(activityId: string): UserProgress {
  const current = loadProgress();
  const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const currentCount = current.weeklyActivity[today] || 0;

  const updated: UserProgress = {
    ...current,
    completedActivities: current.completedActivities.includes(activityId)
      ? current.completedActivities
      : [...current.completedActivities, activityId],
    weeklyActivity: {
      ...current.weeklyActivity,
      [today]: currentCount + 1
    }
  };
  saveProgress(updated);
  return updated;
}

export function recordStoryCompleted(storyId: string): UserProgress {
  const current = loadProgress();
  const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const currentCount = current.weeklyActivity[today] || 0;

  const updated: UserProgress = {
    ...current,
    completedStories: current.completedStories.includes(storyId)
      ? current.completedStories
      : [...current.completedStories, storyId],
    weeklyActivity: {
      ...current.weeklyActivity,
      [today]: currentCount + 1
    }
  };
  saveProgress(updated);
  return updated;
}

export function recordLessonCompleted(lessonId: string): UserProgress {
  const current = loadProgress();
  const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const currentCount = current.weeklyActivity[today] || 0;

  const updated: UserProgress = {
    ...current,
    completedLessons: current.completedLessons.includes(lessonId)
      ? current.completedLessons
      : [...current.completedLessons, lessonId],
    weeklyActivity: {
      ...current.weeklyActivity,
      [today]: currentCount + 1
    }
  };
  saveProgress(updated);
  return updated;
}

export function recordGameCompleted(gameId: string, score: number): UserProgress {
  const current = loadProgress();
  const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const currentCount = current.weeklyActivity[today] || 0;

  const previousHighScore = current.gameHighScores[gameId] || 0;
  const updated: UserProgress = {
    ...current,
    completedGames: current.completedGames.includes(gameId)
      ? current.completedGames
      : [...current.completedGames, gameId],
    gameHighScores: {
      ...current.gameHighScores,
      [gameId]: Math.max(previousHighScore, score)
    },
    weeklyActivity: {
      ...current.weeklyActivity,
      [today]: currentCount + 1
    }
  };
  saveProgress(updated);
  return updated;
}

export function toggleStoryBookmark(storyId: string): UserProgress {
  const current = loadProgress();
  const isBookmarked = current.bookmarkedStories.includes(storyId);
  const updated: UserProgress = {
    ...current,
    bookmarkedStories: isBookmarked
      ? current.bookmarkedStories.filter((id) => id !== storyId)
      : [...current.bookmarkedStories, storyId]
  };
  saveProgress(updated);
  return updated;
}

export function toggleActivityFavorite(activityId: string): UserProgress {
  const current = loadProgress();
  const isFav = current.favoritedActivities.includes(activityId);
  const updated: UserProgress = {
    ...current,
    favoritedActivities: isFav
      ? current.favoritedActivities.filter((id) => id !== activityId)
      : [...current.favoritedActivities, activityId]
  };
  saveProgress(updated);
  return updated;
}

export function addJournalEntry(entry: Omit<JournalEntry, 'id'>): UserProgress {
  const current = loadProgress();
  const newEntry: JournalEntry = {
    ...entry,
    id: `entry-${Date.now()}`
  };
  const updated: UserProgress = {
    ...current,
    journalEntries: [newEntry, ...current.journalEntries]
  };
  saveProgress(updated);
  return updated;
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Ignore
  }
}
