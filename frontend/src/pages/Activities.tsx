import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Eye,
  Activity as ActivityIcon,
  Heart,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { activities } from '../data.ts';
import type { Activity } from '../lib/types.ts';
import {
  loadProgress,
  loadSettings,
  recordActivityCompleted,
  toggleActivityFavorite,
  addJournalEntry
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Activities: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [progress, setProgress] = useState(loadProgress());
  const settings = loadSettings();

  // State for Breathing Pacer
  const [breathTechnique, setBreathTechnique] = useState<'box' | 'belly' | 'humming'>('box');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCycle, setBreathCycle] = useState(1);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);

  // State for 5-4-3-2-1 Sensory Grounding
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingChecked, setGroundingChecked] = useState<{ [key: string]: boolean }>({});

  // State for Movement Stretch Break
  const [stretchIndex, setStretchIndex] = useState(0);
  const [stretchTimer, setStretchTimer] = useState(20);
  const [stretchActive, setStretchActive] = useState(false);

  // State for Gratitude Journal
  const [journalMood, setJournalMood] = useState('Calm');
  const [journalPromptIndex, setJournalPromptIndex] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [journalSavedAlert, setJournalSavedAlert] = useState(false);

  // State for Mindful Coloring Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushColor, setBrushColor] = useState('#0d8276');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedCanvasOutline, setSelectedCanvasOutline] = useState<'turtle' | 'flower' | 'owl'>('turtle');

  // State for Affirmations Shield
  const [selectedAffirmations, setSelectedAffirmations] = useState<string[]>([]);

  const journalPrompts = [
    'What was something soft, warm, or cozy you touched today?',
    'Who was kind or helpful to you this week?',
    'What is your favorite quiet spot when you want to rest?',
    'What made you smile or laugh recently?'
  ];

  const stretchPoses = [
    {
      title: 'Starfish Reach',
      instruction: 'Stand tall. Spread your arms and legs wide like a gentle starfish. Take a deep breath in through your nose.',
      cue: 'Feel your fingers stretch wide toward the sky.'
    },
    {
      title: 'Gentle Turtle Tuck',
      instruction: 'Roll your shoulders slowly up toward your ears, then let them drop softly like a turtle relaxing into its shell.',
      cue: 'Notice how soft your neck muscles feel when they release.'
    },
    {
      title: 'Tall Tree Balance',
      instruction: 'Stand on both feet, press your soles into the floor like deep roots. Rest your hands over your heart.',
      cue: 'You are steady, strong, and calm.'
    },
    {
      title: 'Floating Cloud Sweeps',
      instruction: 'Slowly sweep both arms up overhead as you inhale, then gently float them down as you exhale.',
      cue: 'Smooth like a white cloud floating through clear air.'
    }
  ];

  const affirmationOptions = [
    'I take my time and do my best',
    'My feelings are allowed to be here',
    'I know how to ask for a quiet break',
    'I have creative and unique ideas',
    'I am gentle with myself when I make mistakes',
    'My curiosity helps me learn new things',
    'I am a thoughtful and caring friend',
    'I am proud of who I am'
  ];

  const groundingData = [
    {
      sense: '5 Things You Can See',
      description: 'Look around your space right now. Notice 5 calm details:',
      items: ['A patch of light or shadow', 'Something made of wood', 'A green plant or leaf', 'A favorite book or item', 'A soft color on the wall']
    },
    {
      sense: '4 Things You Can Physically Feel',
      description: 'Bring your awareness to physical touch:',
      items: ['Your feet touching the floor', 'The texture of your shirt', 'The cool air on your cheeks', 'The softness of your fingertips']
    },
    {
      sense: '3 Things You Can Hear',
      description: 'Listen closely to the room or outside:',
      items: ['The gentle hum of the room', 'A distant voice or step', 'Your own quiet breath']
    },
    {
      sense: '2 Things You Can Smell',
      description: 'Gently breathe through your nose:',
      items: ['Fresh clean air', 'A cozy fabric or paper scent']
    },
    {
      sense: '1 Thing You Appreciate Right Now',
      description: 'Think of one comforting thought:',
      items: ['A safe resting spot right here']
    }
  ];

  // Breathing Pacer Interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathTechnique === 'box') {
              // 4-4-4-4
              if (breathPhase === 'Inhale') {
                setBreathPhase('Hold');
                if (settings.soundEffects) calmSound.playTap(true);
                return 4;
              }
              if (breathPhase === 'Hold') {
                setBreathPhase('Exhale');
                if (settings.soundEffects) calmSound.playTap(true);
                return 4;
              }
              if (breathPhase === 'Exhale') {
                setBreathPhase('Rest');
                if (settings.soundEffects) calmSound.playTap(true);
                return 4;
              }
              if (breathPhase === 'Rest') {
                setBreathPhase('Inhale');
                setBreathCycle((c) => c + 1);
                if (settings.soundEffects) calmSound.playChime(true, 528);
                return 4;
              }
            } else if (breathTechnique === 'belly') {
              // 4-2-6
              if (breathPhase === 'Inhale') {
                setBreathPhase('Hold');
                return 2;
              }
              if (breathPhase === 'Hold') {
                setBreathPhase('Exhale');
                return 6;
              }
              if (breathPhase === 'Exhale') {
                setBreathPhase('Inhale');
                setBreathCycle((c) => c + 1);
                if (settings.soundEffects) calmSound.playChime(true, 528);
                return 4;
              }
            } else {
              // humming: 3-1-5
              if (breathPhase === 'Inhale') {
                setBreathPhase('Hold');
                return 1;
              }
              if (breathPhase === 'Hold') {
                setBreathPhase('Exhale');
                return 5;
              }
              if (breathPhase === 'Exhale') {
                setBreathPhase('Inhale');
                setBreathCycle((c) => c + 1);
                if (settings.soundEffects) calmSound.playChime(true, 432);
                return 3;
              }
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathPhase, breathTechnique, settings.soundEffects]);

  // Stretch Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (stretchActive) {
      timer = setInterval(() => {
        setStretchTimer((prev) => {
          if (prev <= 1) {
            if (stretchIndex < stretchPoses.length - 1) {
              setStretchIndex((s) => s + 1);
              if (settings.soundEffects) calmSound.playChime(true, 440);
              return 20;
            } else {
              setStretchActive(false);
              if (settings.soundEffects) calmSound.playSuccess(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stretchActive, stretchIndex, stretchPoses.length, settings.soundEffects]);

  // Canvas setup and redraw outline
  useEffect(() => {
    if (selectedActivity?.type === 'coloring' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw initial clean background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw simple coloring template outline
      ctx.strokeStyle = '#142333';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      if (selectedCanvasOutline === 'turtle') {
        // Draw cute turtle outline
        ctx.beginPath();
        ctx.ellipse(200, 150, 75, 55, 0, 0, Math.PI * 2); // Shell
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(285, 140, 24, 0, Math.PI * 2); // Head
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(292, 134, 3, 0, Math.PI * 2); // Eye
        ctx.fillStyle = '#142333';
        ctx.fill();

        // Legs
        ctx.beginPath();
        ctx.ellipse(150, 205, 16, 12, 0.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(235, 205, 16, 12, -0.3, 0, Math.PI * 2);
        ctx.stroke();

        // Shell patterns
        ctx.beginPath();
        ctx.arc(200, 150, 25, 0, Math.PI * 2);
        ctx.stroke();
      } else if (selectedCanvasOutline === 'flower') {
        // Sunflower / Daisy
        ctx.beginPath();
        ctx.arc(200, 150, 35, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = 200 + Math.cos(angle) * 65;
          const y = 150 + Math.sin(angle) * 65;
          ctx.beginPath();
          ctx.arc(x, y, 22, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Stem & Leaf
        ctx.beginPath();
        ctx.moveTo(200, 185);
        ctx.lineTo(200, 270);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(230, 230, 25, 12, 0.4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Friendly Owl
        ctx.beginPath();
        ctx.ellipse(200, 160, 60, 80, 0, 0, Math.PI * 2); // Body
        ctx.stroke();

        // Eyes
        ctx.beginPath();
        ctx.arc(175, 130, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(225, 130, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(175, 130, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#142333';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(225, 130, 6, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.beginPath();
        ctx.moveTo(195, 142);
        ctx.lineTo(205, 142);
        ctx.lineTo(200, 155);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }, [selectedActivity, selectedCanvasOutline]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSaveJournalEntry = () => {
    if (!journalText.trim()) return;
    const updated = addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      mood: journalMood,
      prompt: journalPrompts[journalPromptIndex],
      text: journalText.trim()
    });
    setProgress(updated);
    setJournalSavedAlert(true);
    if (settings.soundEffects) calmSound.playSuccess(true);
    setTimeout(() => setJournalSavedAlert(false), 3000);
    setJournalText('');
  };

  const handleToggleFavorite = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    const updated = toggleActivityFavorite(activityId);
    setProgress(updated);
    if (settings.soundEffects) calmSound.playTap(true);
  };

  const handleCompleteCurrentActivity = (activityId: string) => {
    const updated = recordActivityCompleted(activityId);
    setProgress(updated);
    if (settings.soundEffects) calmSound.playSuccess(true);
    setSelectedActivity(null);
  };

  return (
    <div className="activities-page">
      <section className="page-header">
        <h2 className="page-title">Calming Activities</h2>
        <p className="page-description">
          Interactive sensory tools, guided breathing rhythms, gentle movement, and creative expression.
        </p>
      </section>

      {/* Activities Grid */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="grid-3">
          {activities.map((act) => {
            const isFav = progress.favoritedActivities.includes(act.id);
            const isDone = progress.completedActivities.includes(act.id);
            const ActIcon =
              act.type === 'breathing'
                ? Wind
                : act.type === 'grounding'
                ? Eye
                : act.type === 'movement'
                ? ActivityIcon
                : act.type === 'journaling'
                ? Heart
                : act.type === 'coloring'
                ? Palette
                : ShieldCheck;

            return (
              <Card
                key={act.id}
                accent="default"
                interactive
                onClick={() => {
                  setSelectedActivity(act);
                  if (settings.soundEffects) calmSound.playTap(true);
                }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        act.accent === 'teal'
                          ? 'var(--teal-surface)'
                          : act.accent === 'sage'
                          ? 'var(--sage-surface)'
                          : act.accent === 'blue'
                          ? 'var(--blue-surface)'
                          : 'var(--orange-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color:
                        act.accent === 'teal'
                          ? 'var(--teal-primary)'
                          : act.accent === 'sage'
                          ? 'var(--sage-primary)'
                          : act.accent === 'blue'
                          ? 'var(--blue-primary)'
                          : 'var(--orange-primary)'
                    }}
                  >
                    <ActIcon size={18} aria-hidden="true" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isDone && (
                      <span className="badge badge-teal" style={{ textTransform: 'none' }}>
                        <CheckCircle2 size={11} aria-hidden="true" />
                        <span>Completed</span>
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleFavorite(e, act.id)}
                      aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                      style={{
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)',
                        color: isFav ? 'var(--orange-primary)' : 'var(--text-subtle)'
                      }}
                    >
                      {isFav ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {act.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, flex: 1, marginBottom: '0.75rem' }}>
                  {act.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {act.durationMinutes} minutes
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                    Begin &rarr;
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive Activity Modals */}
      {selectedActivity && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="activity-modal-title"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="modal-container"
            style={{ maxWidth: '620px', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="activity-modal-title" className="modal-title">
                {selectedActivity.title}
              </h3>
              <button
                className="icon-btn"
                onClick={() => setSelectedActivity(null)}
                aria-label="Close activity"
              >
                <X size={16} />
              </button>
            </div>

            {/* 1. GUIDED BREATHING INTERACTIVE EXPERIENCE */}
            {selectedActivity.type === 'breathing' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Select a gentle breathing pattern and match your breath to the expanding circle.
                </p>

                {/* Technique Selector */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'box', label: 'Box Breath (4-4-4-4)' },
                    { id: 'belly', label: 'Belly Breath (4-2-6)' },
                    { id: 'humming', label: 'Bee Humming (3-1-5)' }
                  ].map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => {
                        setBreathTechnique(tech.id as 'box' | 'belly' | 'humming');
                        setBreathPhase('Inhale');
                        setBreathSecondsLeft(tech.id === 'box' ? 4 : tech.id === 'belly' ? 4 : 3);
                      }}
                      className={`btn btn-sm ${breathTechnique === tech.id ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {tech.label}
                    </button>
                  ))}
                </div>

                {/* Animated Breathing Circle */}
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal-surface)',
                    border: '3px solid var(--teal-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transform:
                      breathPhase === 'Inhale' || breathPhase === 'Hold'
                        ? 'scale(1.15)'
                        : 'scale(0.92)',
                    transition: 'transform 3.5s ease'
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--teal-primary)' }}>
                    {breathPhase}
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {breathSecondsLeft}s
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Cycle {breathCycle}
                  </span>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button
                    className={`btn ${breathingActive ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => {
                      setBreathingActive(!breathingActive);
                      if (settings.soundEffects) calmSound.playTap(true);
                    }}
                  >
                    {breathingActive ? <Pause size={16} /> : <Play size={16} />}
                    <span>{breathingActive ? 'Pause' : 'Start Pacer'}</span>
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setBreathingActive(false);
                      setBreathPhase('Inhale');
                      setBreathCycle(1);
                      setBreathSecondsLeft(4);
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => handleCompleteCurrentActivity(selectedActivity.id)}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Finish Exercise & Save Progress</span>
                </button>
              </div>
            )}

            {/* 2. 5-4-3-2-1 SENSORY GROUNDING */}
            {selectedActivity.type === 'grounding' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  When sensory overload or big worries visit, focus on what is right around you right now.
                </p>

                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {groundingData.map((step, idx) => (
                    <button
                      key={step.sense}
                      onClick={() => setGroundingStep(idx)}
                      className={`btn btn-sm ${groundingStep === idx ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.35rem 0.2rem', fontSize: '0.75rem' }}
                    >
                      Step {idx + 1}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {groundingData[groundingStep].sense}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {groundingData[groundingStep].description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {groundingData[groundingStep].items.map((item) => {
                      const key = `${groundingStep}-${item}`;
                      const isChecked = !!groundingChecked[key];
                      return (
                        <label
                          key={item}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setGroundingChecked((prev) => ({ ...prev, [key]: !prev[key] }));
                              if (settings.soundEffects) calmSound.playTap(true);
                            }}
                            style={{ accentColor: 'var(--teal-primary)', width: '16px', height: '16px' }}
                          />
                          <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--text-subtle)' : 'var(--text-main)' }}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={groundingStep === 0}
                    onClick={() => setGroundingStep((s) => s - 1)}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Sense</span>
                  </button>

                  {groundingStep === groundingData.length - 1 ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCompleteCurrentActivity(selectedActivity.id)}
                    >
                      <Sparkles size={16} />
                      <span>Complete Grounding</span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setGroundingStep((s) => s + 1)}
                    >
                      <span>Next Sense</span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. STRETCH AND MOVEMENT BREAKS */}
            {selectedActivity.type === 'movement' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Gentle physical breaks release muscle stiffness and calm body signals.
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--orange-surface)',
                    border: '1px solid var(--orange-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
                    Pose {stretchIndex + 1} of {stretchPoses.length}
                  </span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {stretchPoses[stretchIndex].title}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {stretchPoses[stretchIndex].instruction}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--orange-text)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                    Tip: {stretchPoses[stretchIndex].cue}
                  </p>

                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange-primary)', marginBottom: '0.75rem' }}>
                    {stretchTimer}s
                  </div>

                  <button
                    className={`btn ${stretchActive ? 'btn-secondary' : 'btn-orange'}`}
                    onClick={() => {
                      setStretchActive(!stretchActive);
                      if (settings.soundEffects) calmSound.playTap(true);
                    }}
                  >
                    {stretchActive ? <Pause size={16} /> : <Play size={16} />}
                    <span>{stretchActive ? 'Pause Pose' : 'Hold Pose (20s)'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={stretchIndex === 0}
                    onClick={() => {
                      setStretchIndex((s) => s - 1);
                      setStretchTimer(20);
                      setStretchActive(false);
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Pose</span>
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCompleteCurrentActivity(selectedActivity.id)}
                  >
                    <Sparkles size={16} />
                    <span>Complete Movement Break</span>
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={stretchIndex === stretchPoses.length - 1}
                    onClick={() => {
                      setStretchIndex((s) => s + 1);
                      setStretchTimer(20);
                      setStretchActive(false);
                    }}
                  >
                    <span>Next Pose</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* 4. GRATITUDE JOURNALING */}
            {selectedActivity.type === 'journaling' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Writing down one small comforting moment helps build gentle awareness.
                </p>

                {/* Mood Tag */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">How do you feel as you write?</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Calm', 'Happy', 'Peaceful', 'Thoughtful'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setJournalMood(m)}
                        className={`btn btn-sm ${journalMood === m ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Box */}
                <div
                  style={{
                    backgroundColor: 'var(--blue-surface)',
                    border: '1px solid var(--blue-border)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-text)', display: 'block' }}>
                      PROMPT
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                      {journalPrompts[journalPromptIndex]}
                    </span>
                  </div>
                  <button
                    onClick={() => setJournalPromptIndex((p) => (p + 1) % journalPrompts.length)}
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    New Prompt
                  </button>
                </div>

                {/* Textarea */}
                <div className="form-group">
                  <textarea
                    className="form-textarea"
                    placeholder="Type a thought, drawing description, or cozy moment..."
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    maxLength={300}
                    style={{ minHeight: '100px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                    <span>Your thoughts are saved safely only on your device.</span>
                    <span>{journalText.length}/300</span>
                  </div>
                </div>

                {journalSavedAlert && (
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--teal-surface)', color: 'var(--teal-text)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
                    Journal note saved successfully!
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={handleSaveJournalEntry}
                    disabled={!journalText.trim()}
                  >
                    Save Note
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (journalText.trim()) handleSaveJournalEntry();
                      handleCompleteCurrentActivity(selectedActivity.id);
                    }}
                  >
                    Finish Journaling
                  </button>
                </div>
              </div>
            )}

            {/* 5. MINDFUL COLORING CANVAS */}
            {selectedActivity.type === 'coloring' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Pick a template outline, select gentle colors, and color inside or outside the lines.
                </p>

                {/* Template picker */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {(['turtle', 'flower', 'owl'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedCanvasOutline(t)}
                      className={`btn btn-sm ${selectedCanvasOutline === t ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Palette */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Palette:</span>
                  {[
                    { name: 'Teal', hex: '#0d8276' },
                    { name: 'Sage', hex: '#417558' },
                    { name: 'Sky Blue', hex: '#0284c7' },
                    { name: 'Orange', hex: '#d97706' },
                    { name: 'Sand', hex: '#b45309' },
                    { name: 'Charcoal', hex: '#142333' },
                    { name: 'Eraser', hex: '#ffffff' }
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setBrushColor(c.hex)}
                      aria-label={`Color ${c.name}`}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: brushColor === c.hex ? '2px solid #142333' : '1px solid var(--border-medium)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: 'auto' }}>Size:</span>
                  {[4, 8, 16].map((s) => (
                    <button
                      key={s}
                      onClick={() => setBrushSize(s)}
                      className={`btn btn-sm ${brushSize === s ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      {s === 4 ? 'Fine' : s === 8 ? 'Medium' : 'Thick'}
                    </button>
                  ))}
                </div>

                {/* Canvas Container */}
                <div
                  style={{
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    marginBottom: '1rem'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    style={{ cursor: 'crosshair', maxWidth: '100%', height: 'auto', display: 'block' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = '#ffffff';
                          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                      }
                    }}
                  >
                    Clear Canvas
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCompleteCurrentActivity(selectedActivity.id)}
                  >
                    <Sparkles size={16} />
                    <span>Finish Drawing & Save Progress</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. POSITIVE SELF-REFLECTION (INNER STRENGTHS) */}
            {selectedActivity.type === 'reflection' && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Choose 1 to 3 strengths that fit who you are. These are your true inner superpowers.
                </p>

                <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                  {affirmationOptions.map((aff) => {
                    const isSelected = selectedAffirmations.includes(aff);
                    return (
                      <button
                        key={aff}
                        type="button"
                        onClick={() => {
                          setSelectedAffirmations((prev) =>
                            prev.includes(aff) ? prev.filter((a) => a !== aff) : [...prev, aff]
                          );
                          if (settings.soundEffects) calmSound.playTap(true);
                        }}
                        style={{
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--teal-primary)' : '1px solid var(--border-light)',
                          backgroundColor: isSelected ? 'var(--teal-surface)' : 'var(--bg-surface)',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          color: isSelected ? 'var(--teal-text)' : 'var(--text-main)',
                          fontWeight: isSelected ? 600 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <ShieldCheck size={16} style={{ color: isSelected ? 'var(--teal-primary)' : 'var(--text-subtle)', flexShrink: 0 }} />
                        <span>{aff}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={selectedAffirmations.length === 0}
                  onClick={() => handleCompleteCurrentActivity(selectedActivity.id)}
                >
                  <Sparkles size={16} />
                  <span>Lock in My Strengths ({selectedAffirmations.length} Selected)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
