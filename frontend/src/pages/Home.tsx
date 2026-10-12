import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  GraduationCap,
  Gamepad2,
  Clock,
  CheckCircle2,
  TrendingUp,
  Heart,
  Volume2,
  Play,
  Pause,
  ShieldCheck,
  CheckSquare,
  Square,
  Compass
} from 'lucide-react';
import { AnimalAvatar } from '../components/AnimalAvatars.tsx';
import { Card } from '../components/Card.tsx';
import { loadProfile, loadProgress, loadSettings } from '../lib/storage.ts';
import { stories, activities, lessons, games } from '../data.ts';
import { calmSound } from '../lib/audio.ts';
import { animatePageEntrance } from '../lib/smoothScroll.ts';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const progress = loadProgress();
  const settings = loadSettings();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeMood, setActiveMood] = useState<string | null>(null);

  // Trigger smooth entrance animation on mount
  useEffect(() => {
    if (containerRef.current) {
      animatePageEntrance(containerRef.current);
    }
  }, []);

  // Today's Visual Schedule persistence
  const [routineChecked, setRoutineChecked] = useState<{ [id: string]: boolean }>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('authsetic_routine_checked');
      return raw ? JSON.parse(raw) : { morning: true, story: false, sensory: false, evening: false };
    } catch {
      return { morning: true, story: false, sensory: false, evening: false };
    }
  });

  const toggleRoutine = (id: string) => {
    const updated = { ...routineChecked, [id]: !routineChecked[id] };
    setRoutineChecked(updated);
    try {
      localStorage.setItem('authsetic_routine_checked', JSON.stringify(updated));
    } catch {
      // Storage quota
    }
    if (settings.soundEffects) {
      if (updated[id]) {
        calmSound.playChime(true, 659.25);
      } else {
        calmSound.playTap(true);
      }
    }
  };

  // Ambient Sound Sanctuary State
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState<'stream' | 'rain' | 'wind' | 'waves'>('stream');

  const handleToggleAmbient = (type: 'stream' | 'rain' | 'wind' | 'waves') => {
    if (ambientPlaying && ambientType === type) {
      calmSound.stopAmbient();
      setAmbientPlaying(false);
    } else {
      setAmbientType(type);
      calmSound.startAmbient(type);
      setAmbientPlaying(true);
    }
  };

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      calmSound.stopAmbient();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const moods = [
    { id: 'calm', label: 'Calm', note: 'Ready for quiet reading or gentle focus.' },
    { id: 'curious', label: 'Curious', note: 'A great headspace to learn something new.' },
    { id: 'tired', label: 'Tired', note: 'Take it easy. A soothing breath pause is ready for you.' },
    { id: 'big-feelings', label: 'Big feelings', note: 'Take your time. You are safe here to go at your own pace.' }
  ];

  const handleMoodSelect = (moodId: string) => {
    setActiveMood(moodId);
    if (settings.soundEffects) {
      calmSound.playTap(true);
    }
  };

  // 1. Featured Focal Experience
  const featuredStory = stories[0];
  const isFeaturedCompleted = progress.completedStories.includes(featuredStory.id);

  // Recommended items
  const recommendedActivity = activities[0]; // Visual Calming Breath
  const recommendedLesson = lessons[0]; // Understanding Big Emotions
  const recommendedGame = games[1]; // Memory Match

  const totalCompleted =
    progress.completedStories.length +
    progress.completedActivities.length +
    progress.completedLessons.length +
    progress.completedGames.length;

  const routinesList = [
    {
      id: 'morning',
      title: 'Morning Launch & Stretch',
      description: 'Take 3 peaceful breaths and drink a glass of water.'
    },
    {
      id: 'story',
      title: 'Daily Story Reading',
      description: 'Explore one chapter in Story Woods.'
    },
    {
      id: 'sensory',
      title: 'Calm Sensory Reset',
      description: 'Practice a 2-minute visual breathing pause.'
    },
    {
      id: 'evening',
      title: 'Evening Wind-down',
      description: 'Notice 3 things that made you feel safe today.'
    }
  ];

  const routinesDoneCount = Object.values(routineChecked).filter(Boolean).length;

  return (
    <div ref={containerRef} className="home-container" style={{ maxWidth: '1040px', margin: '0 auto' }}>
      {/* 1. Compact Friendly Welcome */}
      <section
        className="welcome-strip"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-medium)',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <AnimalAvatar id={profile.avatar} size={46} showBg />
          <div>
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              {getGreeting()}, {profile.name}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Your peaceful space for stories, calming activities, and everyday learning.
            </p>
          </div>
        </div>

        {/* Emotion check-in pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginRight: '0.2rem' }}>
            Check-in:
          </span>
          {moods.map((m) => {
            const isSelected = activeMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                aria-pressed={isSelected}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mood affirmation notice if selected */}
      {activeMood && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--teal-surface)',
            border: '1px solid var(--teal-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            color: 'var(--teal-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <span>{moods.find((m) => m.id === activeMood)?.note}</span>
          <button
            onClick={() => setActiveMood(null)}
            style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', fontWeight: 600 }}
          >
            Clear
          </button>
        </div>
      )}

      {/* 2. Quick Self-Regulation Station (Immediate Real Utility) */}
      <section style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {/* Quick Action: Calm Breath */}
          <button
            onClick={() => navigate('/activities')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.9rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
            className="quick-action-card"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--teal-surface)',
                color: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Sparkles size={16} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                Need to calm down?
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Guided 1-min breathing pacer
              </span>
            </div>
          </button>

          {/* Quick Action: Feeling Garden */}
          <button
            onClick={() => navigate('/garden')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.9rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
            className="quick-action-card"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--sage-surface)',
                color: 'var(--sage-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Heart size={16} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                Express a feeling
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Emotion blooms & cue cards
              </span>
            </div>
          </button>

          {/* Quick Action: Learning Workshop */}
          <button
            onClick={() => navigate('/learning')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.9rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
            className="quick-action-card"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--blue-surface)',
                color: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GraduationCap size={16} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                Practise a life skill
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Communication & routines
              </span>
            </div>
          </button>

          {/* Quick Action: Play a gentle game */}
          <button
            onClick={() => navigate('/games')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.9rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
            className="quick-action-card"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--orange-surface)',
                color: 'var(--orange-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Gamepad2 size={16} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                Playful game break
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Animal memory & patterns
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. One Distinctive Featured Story (Clear Focal Point) */}
      <section style={{ marginBottom: '2rem' }}>
        <div
          className="featured-hero-card"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.4fr) minmax(220px, 1fr)',
            gap: '1.75rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                Featured Story
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} aria-hidden="true" />
                <span>{featuredStory.readTimeMinutes} min read</span>
              </span>
              {isFeaturedCompleted && (
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle2 size={11} aria-hidden="true" />
                  <span>Completed</span>
                </span>
              )}
            </div>

            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '0 0 0.5rem',
                lineHeight: 1.3
              }}
            >
              {featuredStory.title}
            </h2>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: '0 0 1.25rem'
              }}
            >
              {featuredStory.summary}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/stories')}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
              >
                <span>Read Story</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                {featuredStory.ageRange}
              </span>
            </div>
          </div>

          {/* Book Cover Illustration Frame */}
          <div
            style={{
              backgroundColor: 'var(--teal-surface)',
              border: '1px solid var(--teal-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '160px'
            }}
          >
            <AnimalAvatar id="otter" size={64} showBg={false} />
            <span
              style={{
                marginTop: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--teal-text)'
              }}
            >
              Ollie the River Otter
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              A story about finding your calm anchor
            </span>
          </div>
        </div>
      </section>

      {/* 4. Interactive Visual Schedule & Nature Sound Sanctuary */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.25rem'
        }}
      >
        {/* Today's Visual Schedule */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Today's Visual Schedule
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                {routinesDoneCount} of {routinesList.length} completed
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.85rem' }}>
              Tap each block when you finish to build gentle confidence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {routinesList.map((item) => {
                const isDone = !!routineChecked[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleRoutine(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      backgroundColor: isDone ? 'var(--teal-surface)' : 'var(--bg-subtle)',
                      borderColor: isDone ? 'var(--teal-border)' : 'var(--border-light)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ marginTop: '2px', color: isDone ? 'var(--teal-primary)' : 'var(--text-subtle)' }}>
                      {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                    </span>
                    <div>
                      <span
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          color: isDone ? 'var(--teal-text)' : 'var(--text-main)',
                          textDecoration: isDone ? 'line-through' : 'none',
                          display: 'block'
                        }}
                      >
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calm Sound Sanctuary Player */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Volume2 size={16} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Calm Sound Sanctuary
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: ambientPlaying ? 'var(--teal-primary)' : 'var(--text-subtle)'
                }}
              >
                {ambientPlaying ? 'Playing Softly' : 'Paused'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Gentle harmonic white noise generated in real time to filter background distractions.
            </p>

            {/* Sound options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              {[
                { id: 'stream', label: 'River Brook', desc: 'Gentle water murmur' },
                { id: 'rain', label: 'Soft Rain', desc: 'Light rhythmic drops' },
                { id: 'wind', label: 'Forest Wind', desc: 'Deep rustling leaves' },
                { id: 'waves', label: 'Ocean Shore', desc: 'Slow resting tide' }
              ].map((sound) => {
                const isActive = ambientPlaying && ambientType === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => handleToggleAmbient(sound.id as 'stream' | 'rain' | 'wind' | 'waves')}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      backgroundColor: isActive ? 'var(--teal-surface)' : 'var(--bg-subtle)',
                      borderColor: isActive ? 'var(--teal-primary)' : 'var(--border-light)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {sound.label}
                      </span>
                      {isActive ? (
                        <Pause size={12} style={{ color: 'var(--teal-primary)' }} />
                      ) : (
                        <Play size={12} style={{ color: 'var(--text-subtle)' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {sound.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Safe audio levels. Zero external ads or loops.</span>
            {ambientPlaying && (
              <button
                onClick={() => {
                  calmSound.stopAmbient();
                  setAmbientPlaying(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--teal-primary)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Stop Audio
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. Core Destinations (Crisp Border Design) */}
      <section style={{ marginBottom: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Explore Destinations
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Destination: Stories */}
          <div
            onClick={() => navigate('/stories')}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
            className="destination-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--teal-surface)',
                  color: 'var(--teal-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={18} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {stories.length} stories
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                Stories
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Gentle illustrated reading adventures on emotions and change.
              </p>
            </div>
          </div>

          {/* Destination: Feelings */}
          <div
            onClick={() => navigate('/garden')}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
            className="destination-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--teal-surface)',
                  color: 'var(--teal-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Heart size={18} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Feelings Garden
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                Feelings
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Explore emotions, body clues, and communication strategies.
              </p>
            </div>
          </div>

          {/* Destination: Activities */}
          <div
            onClick={() => navigate('/activities')}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
            className="destination-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--sage-surface)',
                  color: 'var(--sage-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {activities.length} exercises
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                Activities
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Paced breathing, 5-4-3-2-1 grounding, and mindful drawing.
              </p>
            </div>
          </div>

          {/* Destination: Learning */}
          <div
            onClick={() => navigate('/learning')}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
            className="destination-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--blue-surface)',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GraduationCap size={18} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {lessons.length} lessons
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                Learning
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Clear steps for communication, friendship, and routines.
              </p>
            </div>
          </div>

          {/* Destination: Games */}
          <div
            onClick={() => navigate('/games')}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
            className="destination-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--orange-surface)',
                  color: 'var(--orange-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Gamepad2 size={18} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {games.length} games
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
                Games
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Playful animal memory matching, feelings quiz, and patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Carefully Arranged Recommended Content */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Recommended For Today
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          {/* Recommended Activity */}
          <Card
            accent="default"
            interactive
            onClick={() => navigate('/activities')}
            style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-medium)' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-sage">Calm Activity</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {recommendedActivity.durationMinutes} mins
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                {recommendedActivity.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                {recommendedActivity.description}
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Visual Pacer</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                Start exercise &rarr;
              </span>
            </div>
          </Card>

          {/* Recommended Lesson */}
          <Card
            accent="default"
            interactive
            onClick={() => navigate('/learning')}
            style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-medium)' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-blue">Life Skill</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {recommendedLesson.estimatedMinutes} mins
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                {recommendedLesson.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                {recommendedLesson.summary}
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{recommendedLesson.topic}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                Open lesson &rarr;
              </span>
            </div>
          </Card>

          {/* Recommended Game */}
          <Card
            accent="default"
            interactive
            onClick={() => navigate('/games')}
            style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-medium)' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-orange">Playful Challenge</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Working Memory</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                {recommendedGame.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                {recommendedGame.description}
              </p>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>6 Animal Pairs</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                Play game &rarr;
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Why Families Trust Authsetic (Evidence & Safety Principles) */}
      <section style={{ marginBottom: '2rem' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--teal-surface)',
                color: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                Sensory-Safe Environment
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                Zero advertisements, jarring popups, or sudden loud sound effects.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--sage-surface)',
                color: 'var(--sage-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Heart size={18} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                Neurodiversity-Affirming
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                Celebrates different ways of thinking, communicating, and taking breaks.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--blue-surface)',
                color: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Compass size={18} aria-hidden="true" />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                Self-Paced Exploration
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                No stressful countdown timers or punitive game-over screens.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Small, Useful Progress Snapshot (Only when real data exists) */}
      {totalCompleted > 0 && (
        <section
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--teal-primary)' }} aria-hidden="true" />
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                Your Learning Journey
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {progress.completedStories.length} stories read, {progress.completedActivities.length} calming breaks practiced
              </span>
            </div>
          </div>

          <Link
            to="/progress"
            style={{
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--teal-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>View personal progress</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
};
