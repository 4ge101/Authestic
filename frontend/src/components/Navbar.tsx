import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wind,
  Volume2,
  VolumeX,
  Search,
  X,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { loadProfile, loadSettings, saveSettings } from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';
import { stories, activities, lessons } from '../data.ts';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const profile = loadProfile();
  const [settings, setSettings] = useState(loadSettings());
  const [showCalmModal, setShowCalmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Breathing state in quick modal
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Daily Dashboard';
      case '/stories':
        return 'Story Library';
      case '/activities':
        return 'Calming Activities';
      case '/learning':
        return 'Emotional Learning';
      case '/games':
        return 'Playful Practice';
      case '/progress':
        return 'My Journey & Progress';
      case '/profile':
        return 'Child Profile';
      case '/settings':
        return 'Settings & Accessibility';
      default:
        return 'Authsetic';
    }
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEffects: !settings.soundEffects };
    setSettings(updated);
    saveSettings(updated);
    if (updated.soundEffects) {
      calmSound.playChime(true, 528);
    }
  };

  const handleOpenCalmModal = () => {
    setShowCalmModal(true);
    setBreathPhase('Inhale');
    if (settings.soundEffects) {
      calmSound.playChime(true, 432);
    }
  };

  // Filter items for search
  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredActivities = activities.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="navbar" role="banner">
        <div className="navbar-left">
          <h1 className="navbar-page-title">{getPageTitle()}</h1>
        </div>

        <div className="navbar-search" style={{ position: 'relative' }}>
          <Search size={16} aria-hidden="true" style={{ color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Search stories, lessons..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setShowSearchResults(true);
            }}
            aria-label="Search content"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              style={{ color: 'var(--text-subtle)' }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Dropdown Results */}
          {showSearchResults && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '6px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '0.75rem',
                zIndex: 60,
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                MATCHING RESOURCES
              </div>
              {filteredStories.slice(0, 2).map((s) => (
                <Link
                  key={s.id}
                  to="/stories"
                  onClick={() => setShowSearchResults(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.25rem'
                  }}
                >
                  <BookOpen size={14} style={{ color: 'var(--teal-primary)' }} />
                  <span>{s.title}</span>
                </Link>
              ))}
              {filteredActivities.slice(0, 2).map((a) => (
                <Link
                  key={a.id}
                  to="/activities"
                  onClick={() => setShowSearchResults(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.25rem'
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--sage-primary)' }} />
                  <span>{a.title}</span>
                </Link>
              ))}
              {filteredLessons.slice(0, 2).map((l) => (
                <Link
                  key={l.id}
                  to="/learning"
                  onClick={() => setShowSearchResults(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.25rem'
                  }}
                >
                  <GraduationCap size={14} style={{ color: 'var(--blue-primary)' }} />
                  <span>{l.title}</span>
                </Link>
              ))}
              {filteredStories.length === 0 && filteredActivities.length === 0 && filteredLessons.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', padding: '0.5rem' }}>
                  No matches found. Try "calm", "emotions", or "otter".
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-right">
          {/* Quick Sensory Break Button */}
          <button
            className="btn-calm-break"
            onClick={handleOpenCalmModal}
            aria-label="Take a quick one-minute calming breath"
          >
            <Wind size={15} aria-hidden="true" />
            <span>Calm Pause</span>
          </button>

          {/* Sound Toggle */}
          <button
            className={`icon-btn ${settings.soundEffects ? 'active' : ''}`}
            onClick={handleToggleSound}
            aria-label={settings.soundEffects ? 'Mute soothing sounds' : 'Enable soothing sounds'}
            title={settings.soundEffects ? 'Soothing sounds enabled' : 'Sounds muted'}
          >
            {settings.soundEffects ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Profile Quick Pill */}
          <Link to="/profile" className="nav-user-pill" aria-label={`View profile for ${profile.name}`}>
            <span className="avatar-badge">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'L'}
            </span>
            <span>{profile.name || 'Friend'}</span>
          </Link>
        </div>
      </header>

      {/* Quick Calm Modal Dialog */}
      {showCalmModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="calm-modal-title"
          onClick={() => setShowCalmModal(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div className="modal-header">
              <h2 id="calm-modal-title" className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind size={20} style={{ color: 'var(--teal-primary)' }} />
                <span>One-Minute Calm Pause</span>
              </h2>
              <button
                className="icon-btn"
                onClick={() => setShowCalmModal(false)}
                aria-label="Close calm pause"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Rest your hands gently on your lap. Follow the rhythm below.
            </p>

            <div
              style={{
                width: '160px',
                height: '160px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--teal-surface)',
                border: '2px solid var(--teal-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--teal-primary)' }}>
                {breathPhase}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                {breathPhase === 'Inhale' ? 'Breathe in softly' : breathPhase === 'Hold' ? 'Gently pause' : breathPhase === 'Exhale' ? 'Breathe out slowly' : 'Rest'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['Inhale', 'Hold', 'Exhale', 'Rest'] as const).map((phase) => (
                <button
                  key={phase}
                  onClick={() => {
                    setBreathPhase(phase);
                    if (settings.soundEffects) calmSound.playTap(true);
                  }}
                  className={`btn btn-sm ${breathPhase === phase ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {phase}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowCalmModal(false);
                if (settings.soundEffects) calmSound.playSuccess(true);
              }}
            >
              I Feel Calmer Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};
