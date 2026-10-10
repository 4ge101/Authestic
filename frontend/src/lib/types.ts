export type Category = 'Emotions' | 'Friendship' | 'Bravery' | 'Daily Life';

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt?: string;
  highlightWords?: string[];
}

export interface Story {
  id: string;
  title: string;
  category: Category;
  readTimeMinutes: number;
  ageRange: string;
  summary: string;
  coverAccent: 'teal' | 'sage' | 'blue' | 'orange';
  pages: StoryPage[];
  reflectionQuestion: string;
}

export type ActivityType =
  | 'breathing'
  | 'grounding'
  | 'movement'
  | 'journaling'
  | 'coloring'
  | 'reflection';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  durationMinutes: number;
  description: string;
  accent: 'teal' | 'sage' | 'blue' | 'orange';
  tags: string[];
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  description: string;
  actionTip?: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  summary: string;
  accent: 'teal' | 'sage' | 'blue' | 'orange';
  estimatedMinutes: number;
  steps: LessonStep[];
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Game {
  id: string;
  title: string;
  type: 'feelings-quiz' | 'memory-match' | 'shape-sort' | 'pattern-match';
  description: string;
  accent: 'teal' | 'sage' | 'blue' | 'orange';
  skillsTrained: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  prompt: string;
  text: string;
}

export interface UserProfile {
  name: string;
  ageRange: '4-6' | '7-9' | '10-12';
  avatar: 'otter' | 'owl' | 'fox' | 'turtle' | 'bear' | 'dolphin';
  readingPreference: string;
  languagePreference: string;
  bio: string;
}

export interface UserSettings {
  textSize: 'standard' | 'large' | 'xlarge';
  reducedMotion: boolean;
  soundEffects: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
  language: 'en' | 'es' | 'fr';
}

export interface UserProgress {
  completedStories: string[];
  completedActivities: string[];
  completedLessons: string[];
  completedGames: string[];
  bookmarkedStories: string[];
  favoritedActivities: string[];
  weeklyActivity: { [day: string]: number };
  journalEntries: JournalEntry[];
  gameHighScores: { [gameId: string]: number };
  savedAffirmations: string[];
}
