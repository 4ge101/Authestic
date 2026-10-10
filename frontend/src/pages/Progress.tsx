import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Gamepad2,
  Award,
  Calendar,
  CheckCircle2,
  Info,
  Download,
  ShieldCheck,
  Wind,
  Smile,
  Palette,
  Puzzle
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { loadProgress, loadProfile } from '../lib/storage.ts';
import { stories, activities, lessons, milestones } from '../data.ts';

export const Progress: React.FC = () => {
  const profile = loadProfile();
  const [progress] = useState(loadProgress());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeeklyCount = Math.max(1, ...daysOfWeek.map((d) => progress.weeklyActivity[d] || 0));

  const totalStories = stories.length;
  const totalActivities = activities.length;
  const totalLessons = lessons.length;

  const completedStoriesCount = progress.completedStories.length;
  const completedActivitiesCount = progress.completedActivities.length;
  const completedLessonsCount = progress.completedLessons.length;
  const completedGamesCount = progress.completedGames.length;

  const handlePrintCertificate = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="progress-page">
      <section className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="page-title">{profile.name}'s Journey & Exploration Log</h2>
            <p className="page-description">
              Celebrating your curiosity, calming practices, and reading milestones.
            </p>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handlePrintCertificate}>
            <Download size={14} aria-hidden="true" />
            <span>Print or Save Summary</span>
          </button>
        </div>
      </section>

      {/* Honest Non-Clinical Disclaimer */}
      <div className="notice-box" role="note">
        <Info size={18} aria-hidden="true" />
        <div>
          <strong>About Activity Tracking:</strong> Authsetic tracks completed stories, calm exercises, and lessons to encourage positive daily habits. This represents your activity log and is not a clinical assessment, medical diagnosis, or therapeutic metric.
        </div>
      </div>

      {/* 4 Metric Cards */}
      <section style={{ marginBottom: '1.75rem' }}>
        <div className="grid-4">
          <Card accent="teal" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge badge-teal">Reading</span>
              <BookOpen size={16} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {completedStoriesCount} / {totalStories}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stories Explored</span>
          </Card>

          <Card accent="sage" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge badge-sage">Calm</span>
              <Sparkles size={16} style={{ color: 'var(--sage-primary)' }} aria-hidden="true" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {completedActivitiesCount} / {totalActivities}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calm Exercises Done</span>
          </Card>

          <Card accent="blue" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge badge-blue">Skills</span>
              <GraduationCap size={16} style={{ color: 'var(--blue-primary)' }} aria-hidden="true" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {completedLessonsCount} / {totalLessons}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lessons Mastered</span>
          </Card>

          <Card accent="orange" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span className="badge badge-orange">Games</span>
              <Gamepad2 size={16} style={{ color: 'var(--orange-primary)' }} aria-hidden="true" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {completedGamesCount}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Games Played</span>
          </Card>
        </div>
      </section>

      {/* Weekly Activity Visual Chart */}
      <section style={{ marginBottom: '2rem' }}>
        <Card accent="default">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Weekly Exploration Rhythm
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Completed activities this week
            </span>
          </div>

          {/* Accessible Bar Chart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '140px',
              padding: '0 0.5rem 0.5rem',
              borderBottom: '1px solid var(--border-light)',
              gap: '0.75rem'
            }}
          >
            {daysOfWeek.map((day) => {
              const count = progress.weeklyActivity[day] || 0;
              const barHeightPct = Math.round((count / maxWeeklyCount) * 100);

              return (
                <div
                  key={day}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: count > 0 ? 'var(--teal-primary)' : 'var(--text-subtle)' }}>
                    {count}
                  </span>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${Math.max(8, barHeightPct)}%`,
                      backgroundColor: count > 0 ? 'var(--teal-primary)' : 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`${day}: ${count} activities`}
                  />

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Milestones & Badges Showcase */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">
          <Award size={18} style={{ color: 'var(--orange-primary)' }} aria-hidden="true" />
          <span>Personal Milestones</span>
        </h3>

        <div className="grid-4">
          {milestones.map((m) => {
            const isUnlocked =
              m.id === 'first-breath'
                ? progress.completedActivities.length > 0
                : m.id === 'story-explorer'
                ? progress.completedStories.length > 0
                : m.id === 'emotion-detective'
                ? progress.completedGames.includes('feelings-quiz')
                : m.id === 'gratitude-star'
                ? progress.journalEntries.length > 0
                : m.id === 'mindful-artist'
                ? progress.completedActivities.includes('mindful-coloring')
                : m.id === 'memory-master'
                ? progress.completedGames.includes('memory-match')
                : m.id === 'kindness-hero'
                ? progress.completedLessons.includes('personal-space-friends')
                : progress.completedActivities.length >= 3;

            const IconComponent =
              m.iconName === 'Wind'
                ? Wind
                : m.iconName === 'BookOpen'
                ? BookOpen
                : m.iconName === 'Smile'
                ? Smile
                : m.iconName === 'Palette'
                ? Palette
                : m.iconName === 'Puzzle'
                ? Puzzle
                : m.iconName === 'ShieldCheck'
                ? ShieldCheck
                : Award;

            return (
              <Card
                key={m.id}
                accent="default"
                style={{
                  padding: '1rem',
                  opacity: isUnlocked ? 1 : 0.6,
                  border: isUnlocked ? '1px solid var(--orange-border)' : '1px solid var(--border-light)',
                  backgroundColor: isUnlocked ? 'var(--orange-surface)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isUnlocked ? '#fde68a' : 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isUnlocked ? 'var(--orange-primary)' : 'var(--text-subtle)'
                    }}
                  >
                    <IconComponent size={16} />
                  </div>
                  {isUnlocked && (
                    <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                      Unlocked
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {m.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Saved Journal Reflections & Completed Items Summary */}
      <section>
        <div className="grid-2">
          {/* Recent Journal Reflections */}
          <Card accent="default">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Saved Journal Moments ({progress.journalEntries.length})
            </h3>
            {progress.journalEntries.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                No journal reflections saved yet. Try the Gratitude Journal in Activities!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {progress.journalEntries.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      <span>Mood: {entry.mood}</span>
                      <span>{entry.date}</span>
                    </div>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>
                      "{entry.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Completed Resources Log */}
          <Card accent="default">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Completed Items Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              {progress.completedStories.map((id) => {
                const s = stories.find((item) => item.id === id);
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--teal-primary)' }} />
                    <span>Story: {s?.title || id}</span>
                  </div>
                );
              })}
              {progress.completedLessons.map((id) => {
                const l = lessons.find((item) => item.id === id);
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--sage-primary)' }} />
                    <span>Lesson: {l?.title || id}</span>
                  </div>
                );
              })}
              {progress.completedActivities.map((id) => {
                const a = activities.find((item) => item.id === id);
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--blue-primary)' }} />
                    <span>Activity: {a?.title || id}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
