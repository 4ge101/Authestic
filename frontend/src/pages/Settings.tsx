import React, { useState } from 'react';
import {
  Eye,
  Type,
  Lock,
  Unlock,
  ShieldCheck,
  RotateCcw,
  Download,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import type { UserSettings } from '../lib/types.ts';
import {
  loadSettings,
  saveSettings,
  loadProgress,
  resetAllData
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Settings: React.FC = () => {
  const [settings, setSettingsState] = useState<UserSettings>(loadSettings());
  const [saveToast, setSaveToast] = useState(false);

  // Adult verification gate state
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [parentGateError, setParentGateError] = useState(false);

  // Confirmation state for reset
  const [confirmReset, setConfirmReset] = useState(false);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettingsState(updated);
    saveSettings(updated);
    setSaveToast(true);
    if (updated.soundEffects) {
      calmSound.playTap(true);
    }
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleUnlockParentGate = (e: React.FormEvent) => {
    e.preventDefault();
    // 7 + 8 = 15
    if (parentGateAnswer.trim() === '15') {
      setParentUnlocked(true);
      setParentGateError(false);
      if (settings.soundEffects) calmSound.playSuccess(true);
    } else {
      setParentGateError(true);
      if (settings.soundEffects) calmSound.playTap(true);
    }
  };

  const handleExportData = () => {
    const progress = loadProgress();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'authsetic_progress_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="settings-page">
      <section className="page-header">
        <h2 className="page-title">Settings & Accessibility</h2>
        <p className="page-description">
          Customize sensory display preferences, sound feedback, and caregiver controls.
        </p>
      </section>

      {saveToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--teal-primary)',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 100,
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={16} />
          <span>Preference updated</span>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2rem' }}>
        {/* Left Column: Visual & Sensory Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card accent="default">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={18} style={{ color: 'var(--teal-primary)' }} />
              <span>Text & Reading Comfort</span>
            </h3>

            {/* Text Size Controls */}
            <div className="form-group">
              <label className="form-label">Interface Text Sizing</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: 'standard', label: 'Standard (16px)' },
                  { id: 'large', label: 'Large (18px)' },
                  { id: 'xlarge', label: 'Extra Large (20px)' }
                ].map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => updateSetting('textSize', size.id as UserSettings['textSize'])}
                    className={`btn btn-sm ${settings.textSize === size.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexic Friendly Spacing Toggle */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                  Relaxed Letter & Word Spacing
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Increases spacing and line height for easier visual tracking.
                </span>
              </div>
              <label className="toggle-switch" aria-label="Toggle relaxed letter spacing">
                <input
                  type="checkbox"
                  checked={settings.dyslexicFont}
                  onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className={`switch-track ${settings.dyslexicFont ? 'active' : ''}`}>
                  <span className="switch-thumb" />
                </span>
              </label>
            </div>
          </Card>

          <Card accent="default">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} style={{ color: 'var(--sage-primary)' }} />
              <span>Sensory & Motion Preferences</span>
            </h3>

            {/* Reduced Motion Toggle */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                  Reduced Motion
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Minimizes transitions and disables movement animations.
                </span>
              </div>
              <label className="toggle-switch" aria-label="Toggle reduced motion">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className={`switch-track ${settings.reducedMotion ? 'active' : ''}`}>
                  <span className="switch-thumb" />
                </span>
              </label>
            </div>

            {/* High Contrast Toggle */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                  High Contrast Mode
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Enhances borders and strengthens text contrast.
                </span>
              </div>
              <label className="toggle-switch" aria-label="Toggle high contrast">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className={`switch-track ${settings.highContrast ? 'active' : ''}`}>
                  <span className="switch-thumb" />
                </span>
              </label>
            </div>

            {/* Sound Effects Toggle */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                  Calming Sound Feedback
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Plays gentle harmonic chimes upon completing activities.
                </span>
              </div>
              <label className="toggle-switch" aria-label="Toggle sound effects">
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className={`switch-track ${settings.soundEffects ? 'active' : ''}`}>
                  <span className="switch-thumb" />
                </span>
              </label>
            </div>
          </Card>

          <Card accent="default">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} style={{ color: 'var(--blue-primary)' }} />
              <span>Language Selection</span>
            </h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="app-language">
                Platform Language Interface
              </label>
              <select
                id="app-language"
                className="form-select"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value as UserSettings['language'])}
              >
                <option value="en">English (Default)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Right Column: Privacy & Caregiver Portal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Privacy Information */}
          <Card accent="default">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--teal-primary)' }} />
              <span>Privacy & Child Safety Commitments</span>
            </h3>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p>
                <strong>No Tracking & No Ads:</strong> Authsetic contains no commercial trackers, third-party analytics pixels, or sponsored advertisements.
              </p>
              <p>
                <strong>Device-Only Storage:</strong> Your child’s reading progress, journal reflections, and preferences reside solely in the local browser storage.
              </p>
              <p>
                <strong>No Unmoderated Chat:</strong> There are no public chatrooms, open social channels, or unvetted messaging systems.
              </p>
            </div>
          </Card>

          {/* Caregiver Portal (Gated) */}
          <Card accent={parentUnlocked ? 'sage' : 'default'}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {parentUnlocked ? (
                  <Unlock size={18} style={{ color: 'var(--sage-primary)' }} />
                ) : (
                  <Lock size={18} style={{ color: 'var(--orange-primary)' }} />
                )}
                <span>Caregiver & Parent Controls</span>
              </h3>

              <span className={`badge ${parentUnlocked ? 'badge-sage' : 'badge-orange'}`}>
                {parentUnlocked ? 'Unlocked' : 'Protected'}
              </span>
            </div>

            {!parentUnlocked ? (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  To access caregiver tools and data management, please verify you are an adult:
                </p>

                <form onSubmit={handleUnlockParentGate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" htmlFor="parent-math">
                      What is 7 + 8?
                    </label>
                    <input
                      id="parent-math"
                      className="form-input"
                      type="text"
                      placeholder="Enter answer"
                      value={parentGateAnswer}
                      onChange={(e) => setParentGateAnswer(e.target.value)}
                      required
                    />
                  </div>

                  {parentGateError && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--orange-primary)' }}>
                      Please enter the correct answer to unlock caregiver tools.
                    </span>
                  )}

                  <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    Verify & Unlock
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked Caregiver Dashboard */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Caregiver portal unlocked. You can export data for school or occupational therapy reviews, or reset the prototype session.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleExportData} style={{ justifyContent: 'flex-start' }}>
                    <Download size={15} />
                    <span>Export Progress Data (JSON)</span>
                  </button>

                  {!confirmReset ? (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setConfirmReset(true)}
                      style={{ justifyContent: 'flex-start', color: 'var(--orange-primary)', borderColor: 'var(--orange-border)' }}
                    >
                      <RotateCcw size={15} />
                      <span>Reset Activity Progress Data</span>
                    </button>
                  ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: '#feefe7', border: '1px solid var(--orange-border)', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--orange-text)', marginBottom: '0.5rem' }}>
                        Are you sure? This clears locally saved progress and journal notes.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-orange btn-sm" onClick={handleResetData}>
                          Yes, Reset All Data
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setConfirmReset(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Co-Reading Tip:</strong> For sensory sensitivity, consider doing the 5-4-3-2-1 grounding exercise together before bedtime.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
