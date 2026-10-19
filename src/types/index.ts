export type NavTab = 
  | 'home' 
  | 'learn' 
  | 'play' 
  | 'stories'
  | 'communication' 
  | 'progress' 
  | 'resources' 
  | 'settings'
  | 'life-skills'
  | 'sensory';

export type ActivityCategory = 
  | 'Learn' 
  | 'Play' 
  | 'Communication' 
  | 'Life Skills' 
  | 'Stories' 
  | 'Sensory';

export interface SensoryPreferences {
  reducedMotion: boolean;
  soundEnabled: boolean;
  sensoryPacing: 'calm' | 'standard' | 'gentle';
  highContrast: boolean;
  voiceGuidance: boolean;
  largeTouchTargets: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  caregiverModeActive: boolean;
  preferences: SensoryPreferences;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  durationMinutes: number;
  progressPercent: number;
  thumbnail: string;
  completed: boolean;
  totalSteps?: number;
  completedSteps?: number;
  difficulty?: 'beginner' | 'moderate';
  tags: string[];
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  iconType: 'star' | 'book' | 'sparkle' | 'leaf' | 'sun';
}

export interface LearningProgress {
  overallPercentage: number;
  completedCount: number;
  totalAssigned: number;
  encouragingMessage: string;
  currentMilestone: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustration: string;
  cue?: string;
}

export interface SocialStory {
  id: string;
  title: string;
  category: 'Transitions' | 'Daily Routines' | 'Sensory' | 'Social & Feelings';
  description: string;
  readTimeMinutes: number;
  thumbnail: string;
  pages: StoryPage[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  audience: 'Caregiver' | 'Child' | 'Educator';
  format: 'Article' | 'Visual Schedule' | 'Guide' | 'Checklist';
  takeaways?: string[];
  fullContent?: string[];
}

export interface LifeSkillRoutine {
  id: string;
  title: string;
  category: 'Morning' | 'Hygiene' | 'School' | 'Evening';
  description: string;
  steps: {
    id: string;
    stepNumber: number;
    title: string;
    instruction: string;
    iconSymbol: string;
  }[];
}
