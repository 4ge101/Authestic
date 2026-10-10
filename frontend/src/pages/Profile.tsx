import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { avatars, stories, activities } from '../data.ts';
import type { UserProfile } from '../lib/types.ts';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  loadSettings
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [progress] = useState(loadProgress());
  const settings = loadSettings();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setSaveSuccess(true);
    if (settings.soundEffects) {
      calmSound.playSuccess(true);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Find bookmarked stories and favorited activities
  const bookmarkedStoryList = stories.filter((s) => progress.bookmarkedStories.includes(s.id));
  const favoritedActivityList = activities.filter((a) => progress.favoritedActivities.includes(a.id));

  return (
    <div className="profile-page">
      <section className="page-header">
        <h2 className="page-title">Child Profile & Favorites</h2>
        <p className="page-description">
          Personalize your learning space, select your companion avatar, and review your favorite saved items.
        </p>
      </section>

      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2rem' }}>
          {/* Left Column: Avatar & Basic Info */}
          <Card accent="default">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Companion Avatar & Name
            </h3>

            {/* Avatar Selector */}
            <div className="form-group">
              <label className="form-label">Select Your Calm Companion</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.65rem',
                  marginBottom: '1rem'
                }}
              >
                {avatars.map((av) => {
                  const isSelected = profile.avatar === av.id;
                  const emoji =
                    av.id === 'otter'
                      ? '🦦'
                      : av.id === 'owl'
                      ? '🦉'
                      : av.id === 'fox'
                      ? '🦊'
                      : av.id === 'turtle'
                      ? '🐢'
                      : av.id === 'bear'
                      ? '🐻'
                      : '🐬';

                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setProfile({ ...profile, avatar: av.id as UserProfile['avatar'] });
                        if (settings.soundEffects) calmSound.playTap(true);
                      }}
                      style={{
                        padding: '0.65rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--teal-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--teal-surface)' : 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1.65rem' }}>{emoji}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'var(--teal-text)' : 'var(--text-main)', textAlign: 'center' }}>
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Name Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Preferred Name or Nickname
              </label>
              <input
                id="profile-name"
                className="form-input"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Leo"
                required
              />
            </div>

            {/* Age Range */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-age">
                Age Range Guidance
              </label>
              <select
                id="profile-age"
                className="form-select"
                value={profile.ageRange}
                onChange={(e) => setProfile({ ...profile, ageRange: e.target.value as UserProfile['ageRange'] })}
              >
                <option value="4-6">Ages 4 to 6 (Early Learner)</option>
                <option value="7-9">Ages 7 to 9 (Explorer)</option>
                <option value="10-12">Ages 10 to 12 (Independent)</option>
              </select>
            </div>

            {/* Bio / Strengths */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">
                Favorite Things & Unique Strengths
              </label>
              <textarea
                id="profile-bio"
                className="form-textarea"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="What do you enjoy? (e.g., drawing maps, quiet music, ocean animals)"
              />
            </div>
          </Card>

          {/* Right Column: Reading & Language Preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card accent="default">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Pacing & Language
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="reading-pref">
                  Reading Style Preference
                </label>
                <select
                  id="reading-pref"
                  className="form-select"
                  value={profile.readingPreference}
                  onChange={(e) => setProfile({ ...profile, readingPreference: e.target.value })}
                >
                  <option value="Picture stories with clear text">Picture stories with clear text</option>
                  <option value="Short chapters with slow pacing">Short chapters with slow pacing</option>
                  <option value="Read-along audio narration pace">Read-along audio narration pace</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="language-pref">
                  Language Preference
                </label>
                <select
                  id="language-pref"
                  className="form-select"
                  value={profile.languagePreference}
                  onChange={(e) => setProfile({ ...profile, languagePreference: e.target.value })}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>

              {saveSuccess && (
                <div style={{ padding: '0.65rem', backgroundColor: 'var(--teal-surface)', border: '1px solid var(--teal-border)', color: 'var(--teal-text)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Save size={16} aria-hidden="true" />
                <span>Save Profile Changes</span>
              </button>
            </Card>

            {/* Quick Privacy Statement */}
            <div className="notice-box" style={{ margin: 0 }}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span>
                <strong>Local Storage Only:</strong> Personal preferences are saved directly to this browser. Authsetic does not collect or transmit child identities.
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Bookmarked & Favorited Content Section */}
      <section>
        <h3 className="section-title">
          <Bookmark size={18} style={{ color: 'var(--orange-primary)' }} aria-hidden="true" />
          <span>My Favorite Content</span>
        </h3>

        <div className="grid-2">
          {/* Bookmarked Stories */}
          <Card accent="default">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} style={{ color: 'var(--teal-primary)' }} />
              <span>Bookmarked Stories ({bookmarkedStoryList.length})</span>
            </h4>

            {bookmarkedStoryList.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                No stories bookmarked yet. Tap the bookmark icon on any story to save it here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {bookmarkedStoryList.map((story) => (
                  <Link
                    key={story.id}
                    to="/stories"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      fontWeight: 500
                    }}
                  >
                    <span>{story.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
                      Read &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Favorited Activities */}
          <Card accent="default">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--sage-primary)' }} />
              <span>Favorited Activities ({favoritedActivityList.length})</span>
            </h4>

            {favoritedActivityList.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                No activities favorited yet. Bookmark your favorite calm tools in Activities.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {favoritedActivityList.map((act) => (
                  <Link
                    key={act.id}
                    to="/activities"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      fontWeight: 500
                    }}
                  >
                    <span>{act.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sage-primary)', fontWeight: 600 }}>
                      Open &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};
