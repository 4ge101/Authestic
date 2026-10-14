import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { WelcomeHero } from '../components/WelcomeHero';
import { ProgressAndGoals } from '../components/ProgressAndGoals';
import { QuickActions } from '../components/QuickActions';
import { TodayActivities } from '../components/TodayActivities';
import { ExploreSection } from '../components/ExploreSection';
import { Activity, DailyGoal, LearningProgress, UserProfile } from '../types';
import { playGentleChime } from '../utils/audio';
import { prefersReducedMotion } from '../utils/gsapMotion';

interface HomePageProps {
  user: UserProfile;
  progress: LearningProgress;
  goals: DailyGoal[];
  activities: Activity[];
  onToggleGoal: (goalId: string) => void;
  onStartActivity: (activity: Activity) => void;
  onOpenSensoryBreak: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  progress,
  goals,
  activities,
  onToggleGoal,
  onStartActivity,
  onOpenSensoryBreak,
}) => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  // Gentle GSAP Stagger Entrance for Homepage Sections
  useEffect(() => {
    if (!mainRef.current || user.preferences.reducedMotion || prefersReducedMotion()) {
      return;
    }

    const sections = mainRef.current.children;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sections,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, [user.preferences.reducedMotion]);

  const handleQuickAction = (actionKey: 'learn' | 'play' | 'communication' | 'resources') => {
    playGentleChime(user.preferences.soundEnabled, 480);
    switch (actionKey) {
      case 'learn':
        navigate('/learn');
        break;
      case 'play':
        navigate('/play');
        break;
      case 'communication':
        navigate('/communication');
        break;
      case 'resources':
        navigate('/resources');
        break;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0">
      <main
        ref={mainRef}
        className="px-4 sm:px-8 lg:px-12 py-3 max-w-[1280px] mx-auto w-full z-10 flex flex-col gap-6 lg:gap-7"
      >
        {/* Section A: Welcome Hero */}
        <section aria-label="Hero Overview">
          <WelcomeHero
            user={user}
            onContinueLearning={() => {
              playGentleChime(user.preferences.soundEnabled, 520);
              navigate('/play');
            }}
            onTakeBreak={onOpenSensoryBreak}
          />
        </section>

        {/* Section B: Progress and Today's Goals */}
        <section id="progress-section" aria-label="Goals and Progress">
          <ProgressAndGoals
            progress={progress}
            goals={goals}
            onToggleGoal={onToggleGoal}
          />
        </section>

        {/* Section C: Quick Actions */}
        <section aria-label="Quick Actions">
          <QuickActions onSelectAction={handleQuickAction} />
        </section>

        {/* Section D: Today's Activities */}
        <section aria-label="Today's Activities">
          <TodayActivities
            activities={activities}
            onStartActivity={onStartActivity}
            onViewAllActivities={() => navigate('/play')}
          />
        </section>

        {/* Section E: Explore */}
        <section aria-label="Explore Topics">
          <ExploreSection onNavigate={(route) => navigate(route)} />
        </section>
      </main>
    </div>
  );
};
