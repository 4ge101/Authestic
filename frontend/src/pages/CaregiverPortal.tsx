import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  ArrowLeft
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { loadProfile, loadProgress } from '../lib/storage.ts';
import { stories, activities, lessons } from '../data.ts';

export const CaregiverPortal: React.FC = () => {
  const navigate = useNavigate();
  const profile = loadProfile();
  const progress = loadProgress();

  const [activeTab, setActiveTab] = useState<'summary' | 'sensory' | 'routines' | 'strategies'>('summary');

  // Sensory Profile Local Preferences
  const [soundSensitivity, setSoundSensitivity] = useState<'mild' | 'moderate' | 'high'>('high');
  const [lightSensitivity, setLightSensitivity] = useState<'mild' | 'moderate' | 'high'>('moderate');
  const [preferredBreakSignal, setPreferredBreakSignal] = useState('Showing the visual break card or raising two fingers');
  const [specialInterests, setSpecialInterests] = useState('River otters, wooden train lines, star constellations');

  const [printSuccess, setPrintSuccess] = useState(false);

  const completedStoryObjects = stories.filter((s) => progress.completedStories.includes(s.id));
  const completedActivityObjects = activities.filter((a) => progress.completedActivities.includes(a.id));
  const completedLessonObjects = lessons.filter((l) => progress.completedLessons.includes(l.id));

  const totalCalmMinutes = completedActivityObjects.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
      setPrintSuccess(true);
      setTimeout(() => setPrintSuccess(false), 3000);
    }
  };

  return (
    <div className="caregiver-portal-page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Adult & Caregiver View</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Child: {profile.name}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Caregiver & Educator Dashboard
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Practical records, sensory support tools, and accommodations for home and school
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Printer size={14} aria-hidden="true" />
            <span>Print Summary</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Switch to Child World</span>
          </button>
        </div>
      </div>

      {printSuccess && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--sage-surface)',
            border: '1px solid var(--sage-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--sage-text)',
            fontSize: '0.875rem'
          }}
        >
          Caregiver summary formatted for print or export.
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.5rem',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('summary')}
          className={`btn btn-sm ${activeTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Activity & Progress Records</span>
        </button>
        <button
          onClick={() => setActiveTab('sensory')}
          className={`btn btn-sm ${activeTab === 'sensory' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Sensory Accommodations</span>
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={`btn btn-sm ${activeTab === 'routines' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Visual Daily Schedules</span>
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`btn btn-sm ${activeTab === 'strategies' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>De-Escalation Strategies</span>
        </button>
      </div>

      {/* Tab 1: Summary */}
      {activeTab === 'summary' && (
        <div>
          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <Card accent="teal" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teal-text)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Stories Completed
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {progress.completedStories.length}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {completedStoryObjects.map((s) => s.title).join(', ') || 'No stories finished yet'}
              </p>
            </Card>

            <Card accent="sage" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--sage-text)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Calming Practice
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {totalCalmMinutes} mins
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Across {progress.completedActivities.length} calming sessions
              </p>
            </Card>

            <Card accent="orange" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--orange-text)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Life Skill Lessons
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {progress.completedLessons.length}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {completedLessonObjects.map((l) => l.title).join(', ') || 'No lessons completed yet'}
              </p>
            </Card>
          </div>

          <Card accent="default" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Logged Interaction History
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-subtle)' }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Category</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Item Name</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Support Type</th>
                  </tr>
                </thead>
                <tbody>
                  {completedStoryObjects.map((story) => (
                    <tr key={story.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>Story Woods</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{story.title}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--teal-primary)' }}>Finished</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{story.category}</td>
                    </tr>
                  ))}
                  {completedActivityObjects.map((act) => (
                    <tr key={act.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>Calm Cove</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{act.title}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--sage-primary)' }}>Practiced</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{act.type}</td>
                    </tr>
                  ))}
                  {completedLessonObjects.map((les) => (
                    <tr key={les.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>Learning Workshop</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{les.title}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--blue-primary)' }}>Explored</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{les.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Sensory Profile */}
      {activeTab === 'sensory' && (
        <div>
          <Card accent="default" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Sensory Accommodations Reference
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Document accommodations that can be shared with teachers, substitute educators, and speech/OT therapists.
            </p>

            <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Auditory Sensitivity Level
                </label>
                <select
                  value={soundSensitivity}
                  onChange={(e) => setSoundSensitivity(e.target.value as 'mild' | 'moderate' | 'high')}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <option value="mild">Mild (Comfortable with normal classroom tones)</option>
                  <option value="moderate">Moderate (Needs ear defenders during assemblies)</option>
                  <option value="high">High (Needs ear protection for bells, crowds, alarms)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Visual & Light Sensitivity
                </label>
                <select
                  value={lightSensitivity}
                  onChange={(e) => setLightSensitivity(e.target.value as 'mild' | 'moderate' | 'high')}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <option value="mild">Mild (Standard indoor lighting)</option>
                  <option value="moderate">Moderate (Prefers natural daylight over fluorescent)</option>
                  <option value="high">High (Flashing visuals or bright fluorescents induce fatigue)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Preferred Break Request Signal
              </label>
              <input
                type="text"
                value={preferredBreakSignal}
                onChange={(e) => setPreferredBreakSignal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                How the child communicates needing a break without requiring complex speech.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Special Interests & Calming Anchors
              </label>
              <input
                type="text"
                value={specialInterests}
                onChange={(e) => setSpecialInterests(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Topics that help co-regulate and rebuild comfort after big feelings.
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Visual Schedules */}
      {activeTab === 'routines' && (
        <div>
          <div className="grid-2" style={{ gap: '1.25rem' }}>
            <Card accent="teal" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Morning Visual Sequence
              </h4>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li style={{ marginBottom: '0.5rem' }}>Wake up with soft lamp (no sudden ceiling lights)</li>
                <li style={{ marginBottom: '0.5rem' }}>Put on seamless socks & comfortable tag-free clothing</li>
                <li style={{ marginBottom: '0.5rem' }}>Eat warm breakfast at preferred seat</li>
                <li style={{ marginBottom: '0.5rem' }}>Check backpack for ear defenders and favorite comfort item</li>
                <li style={{ marginBottom: '0.5rem' }}>Review morning plan together before leaving the house</li>
              </ol>
            </Card>

            <Card accent="sage" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Transition From School to Home
              </h4>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li style={{ marginBottom: '0.5rem' }}>30 minutes of low-demand quiet decompression time</li>
                <li style={{ marginBottom: '0.5rem' }}>Offer a protein snack and cold water</li>
                <li style={{ marginBottom: '0.5rem' }}>Sensory input: heavy blanket or gentle swing</li>
                <li style={{ marginBottom: '0.5rem' }}>No interrogation about school until regulation is restored</li>
                <li style={{ marginBottom: '0.5rem' }}>Choose a calm activity in Authsetic (Breathing or Memory)</li>
              </ol>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 4: De-Escalation Strategies */}
      {activeTab === 'strategies' && (
        <div>
          <Card accent="default" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Sensory Overload & Meltdown Protocol
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              A sensory meltdown is an involuntary nervous system response, never a deliberate behavioral choice.
            </p>

            <div className="grid-3" style={{ gap: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--teal-surface)',
                  border: '1px solid var(--teal-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--teal-text)', marginBottom: '0.35rem' }}>
                  1. Lower The Demands
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Stop asking questions. Turn down lights, turn off background television, and give the child physical space.
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--sage-surface)',
                  border: '1px solid var(--sage-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--sage-text)', marginBottom: '0.35rem' }}>
                  2. Co-Regulate In Silence
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Sit nearby peacefully without crowding. Your calm body signals safety to their over-activated nervous system.
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--orange-surface)',
                  border: '1px solid var(--orange-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--orange-text)', marginBottom: '0.35rem' }}>
                  3. Post-Recovery Care
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Do not lecture or analyze immediately after. Offer water, a soft blanket, and reassure that they are safe and loved.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
