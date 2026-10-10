import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Gamepad2,
  ArrowRight,
  Wind,
  Smile,
  Compass,
  Eye,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { loadProfile, loadProgress, loadSettings } from '../lib/storage.ts';
import { stories, activities, lessons, moodOptions } from '../data.ts';
import { calmSound } from '../lib/audio.ts';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const progress = loadProgress();
  const settings = loadSettings();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const featuredStory = stories[0]; // The Quiet Otter's Big Day
  const featuredLesson = lessons[0]; // Understanding Big Emotions
  const activeMoodObj = moodOptions.find((m) => m.id === selectedMood);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    if (settings.soundEffects) {
      calmSound.playTap(true);
    }
  };

  return (
    <div className="home-page">
      {/* Friendly Personalized Header */}
      <section className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
              {getGreeting()}, {profile.name}!
            </h2>
            <p className="page-description">
              Welcome to your calm learning space. Take things at your own gentle pace.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-teal">
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>{progress.completedActivities.length} activities completed</span>
            </span>
          </div>
        </div>
      </section>

      {/* Daily Mood Check-In Widget */}
      <section style={{ marginBottom: '1.5rem' }}>
        <Card accent="default" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={16} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                How does your body feel right now?
              </span>
            </div>
            {selectedMood && (
              <span style={{ fontSize: '0.8rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
                Check-in logged for today
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {moodOptions.map((mood) => {
              const isSelected = selectedMood === mood.id;
              const MoodIcon =
                mood.id === 'calm'
                  ? Wind
                  : mood.id === 'happy'
                  ? Smile
                  : mood.id === 'sensitive'
                  ? Eye
                  : Compass;

              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <MoodIcon size={14} aria-hidden="true" />
                  <span>{mood.label}</span>
                </button>
              );
            })}
          </div>

          {activeMoodObj && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--teal-surface)',
                border: '1px solid var(--teal-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--teal-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <span>{activeMoodObj.message}</span>
              <button
                onClick={() => navigate('/activities')}
                style={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'var(--teal-primary)',
                  textDecoration: 'underline'
                }}
              >
                Go to calming activities
              </button>
            </div>
          )}
        </Card>
      </section>

      {/* Quick-Access 4 Hub Cards */}
      <section style={{ marginBottom: '1.75rem' }}>
        <h3 className="section-title">
          <span>Explore Resources</span>
        </h3>
        <div className="grid-4">
          <Card
            accent="teal"
            interactive
            onClick={() => navigate('/stories')}
            style={{ padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-teal">Library</span>
              <BookOpen size={18} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Stories
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {stories.length} illustrated therapeutic stories designed for gentle reading.
            </p>
          </Card>

          <Card
            accent="sage"
            interactive
            onClick={() => navigate('/activities')}
            style={{ padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-sage">Calm</span>
              <Sparkles size={18} style={{ color: 'var(--sage-primary)' }} aria-hidden="true" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Activities
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Guided breathing, sensory check-in, stretches, and mindful drawing.
            </p>
          </Card>

          <Card
            accent="blue"
            interactive
            onClick={() => navigate('/learning')}
            style={{ padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-blue">Skills</span>
              <GraduationCap size={18} style={{ color: 'var(--blue-primary)' }} aria-hidden="true" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Learning
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Short, practical lessons on emotional awareness and communication.
            </p>
          </Card>

          <Card
            accent="orange"
            interactive
            onClick={() => navigate('/games')}
            style={{ padding: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-orange">Play</span>
              <Gamepad2 size={18} style={{ color: 'var(--orange-primary)' }} aria-hidden="true" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Games
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Playful matching, feeling detective quiz, and pattern quests.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Story and In-Progress Section */}
      <section style={{ marginBottom: '1.75rem' }}>
        <div className="grid-2">
          {/* Featured Story Card */}
          <Card accent="default">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-teal">{featuredStory.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} aria-hidden="true" />
                <span>{featuredStory.readTimeMinutes} min read</span>
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              {featuredStory.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
              {featuredStory.summary}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                {featuredStory.ageRange}
              </span>
              <Link to="/stories" className="btn btn-primary btn-sm">
                <span>Read Story</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </Card>

          {/* Continue Learning Card */}
          <Card accent="default">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-sage">Guided Lesson</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {featuredLesson.topic}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              {featuredLesson.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
              {featuredLesson.summary}
            </p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                {progress.completedLessons.includes(featuredLesson.id) ? 'Completed' : '3 simple steps'}
              </span>
              <Link to="/learning" className="btn btn-sage btn-sm">
                <span>Start Lesson</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Recommended Calm Exercises */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            <span>Recommended Calm Exercises</span>
          </h3>
          <Link
            to="/activities"
            style={{ fontSize: '0.85rem', color: 'var(--teal-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>View all</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid-3">
          {activities.slice(0, 3).map((activity) => (
            <Card
              key={activity.id}
              accent={activity.accent}
              interactive
              onClick={() => navigate('/activities')}
              style={{ padding: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-neutral">{activity.durationMinutes} mins</span>
                {progress.completedActivities.includes(activity.id) && (
                  <CheckCircle2 size={16} style={{ color: 'var(--teal-primary)' }} aria-label="Completed" />
                )}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {activity.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {activity.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
