import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { lessons } from '../data.ts';
import type { Lesson } from '../lib/types.ts';
import {
  loadProgress,
  loadSettings,
  recordLessonCompleted
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Learning: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Mini quiz state inside lesson modal
  const [quizSelectedIndex, setQuizSelectedIndex] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const [progress, setProgress] = useState(loadProgress());
  const settings = loadSettings();

  const topics = [
    'All',
    'Emotions',
    'Communication',
    'Friendship',
    'Self-Confidence',
    'Problem-Solving',
    'Daily Skills'
  ];

  const filteredLessons = lessons.filter((l) =>
    selectedTopic === 'All' ? true : l.topic === selectedTopic
  );

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStepIndex(0);
    setQuizSelectedIndex(null);
    setQuizAnswered(false);
    if (settings.soundEffects) calmSound.playTap(true);
  };

  const handleCloseLesson = () => {
    setActiveLesson(null);
    setCurrentStepIndex(0);
    setQuizSelectedIndex(null);
    setQuizAnswered(false);
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    const updated = recordLessonCompleted(activeLesson.id);
    setProgress(updated);
    if (settings.soundEffects) calmSound.playSuccess(true);
    handleCloseLesson();
  };

  return (
    <div className="learning-page">
      <section className="page-header">
        <h2 className="page-title">Emotional Learning</h2>
        <p className="page-description">
          Practical life skills, neurodiversity appreciation, communication tips, and step-by-step problem-solving.
        </p>
      </section>

      {/* Topic Filter Pills */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }} role="tablist">
          {topics.map((t) => {
            const isSelected = selectedTopic === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedTopic(t);
                  if (settings.soundEffects) calmSound.playTap(true);
                }}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* Lessons Grid */}
      <section>
        <div className="grid-3">
          {filteredLessons.map((lesson) => {
            const isDone = progress.completedLessons.includes(lesson.id);
            return (
              <Card
                key={lesson.id}
                accent="default"
                interactive
                onClick={() => handleOpenLesson(lesson)}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span
                    className={`badge ${
                      lesson.accent === 'teal'
                        ? 'badge-teal'
                        : lesson.accent === 'sage'
                        ? 'badge-sage'
                        : lesson.accent === 'blue'
                        ? 'badge-blue'
                        : 'badge-orange'
                    }`}
                  >
                    {lesson.topic}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} aria-hidden="true" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </span>
                    {isDone && (
                      <span className="badge badge-teal" style={{ textTransform: 'none' }}>
                        <CheckCircle2 size={11} aria-hidden="true" />
                        <span>Mastered</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {lesson.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, flex: 1, marginBottom: '0.75rem' }}>
                  {lesson.summary}
                </p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {lesson.steps.length} guided steps
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                    Start Lesson &rarr;
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-modal-title"
          onClick={handleCloseLesson}
        >
          <div
            className="modal-container"
            style={{ maxWidth: '640px', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div>
                <span className="badge badge-sage" style={{ marginBottom: '0.25rem' }}>
                  {activeLesson.topic}
                </span>
                <h3 id="lesson-modal-title" className="modal-title" style={{ fontSize: '1.2rem' }}>
                  {activeLesson.title}
                </h3>
              </div>
              <button className="icon-btn" onClick={handleCloseLesson} aria-label="Close lesson">
                <X size={16} />
              </button>
            </div>

            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {activeLesson.steps.map((step, idx) => (
                <button
                  key={step.title}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    if (settings.soundEffects) calmSound.playTap(true);
                  }}
                  className={`btn btn-sm ${currentStepIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '0.35rem 0.2rem', fontSize: '0.75rem' }}
                >
                  Step {idx + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  setCurrentStepIndex(activeLesson.steps.length);
                  if (settings.soundEffects) calmSound.playTap(true);
                }}
                className={`btn btn-sm ${currentStepIndex === activeLesson.steps.length ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.35rem 0.2rem', fontSize: '0.75rem' }}
              >
                Check
              </button>
            </div>

            {/* Content: Step View or Final Quiz */}
            {currentStepIndex < activeLesson.steps.length ? (
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-primary)', display: 'block', marginBottom: '0.25rem' }}>
                    STEP {activeLesson.steps[currentStepIndex].stepNumber}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                    {activeLesson.steps[currentStepIndex].title}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {activeLesson.steps[currentStepIndex].description}
                  </p>

                  {activeLesson.steps[currentStepIndex].actionTip && (
                    <div
                      style={{
                        backgroundColor: 'var(--teal-surface)',
                        border: '1px solid var(--teal-border)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        color: 'var(--teal-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Sparkles size={16} style={{ flexShrink: 0 }} />
                      <span>{activeLesson.steps[currentStepIndex].actionTip}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex((p) => p - 1)}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Step</span>
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setCurrentStepIndex((p) => p + 1)}
                  >
                    <span>
                      {currentStepIndex === activeLesson.steps.length - 1 ? 'Go to Check-In' : 'Next Step'}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* Mini Comprehension Check */
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--sage-surface)',
                    border: '1px solid var(--sage-border)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sage-text)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <HelpCircle size={16} />
                    <span>Quick Understanding Check</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    {activeLesson.quizQuestion.question}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {activeLesson.quizQuestion.options.map((opt, idx) => {
                      const isSelected = quizSelectedIndex === idx;
                      const isCorrect = idx === activeLesson.quizQuestion.correctIndex;
                      let borderColor = 'var(--border-light)';
                      let bg = 'var(--bg-surface)';

                      if (quizAnswered) {
                        if (isCorrect) {
                          borderColor = 'var(--sage-primary)';
                          bg = '#dff0e4';
                        } else if (isSelected) {
                          borderColor = 'var(--orange-primary)';
                          bg = '#feece2';
                        }
                      } else if (isSelected) {
                        borderColor = 'var(--teal-primary)';
                        bg = 'var(--teal-surface)';
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (!quizAnswered) {
                              setQuizSelectedIndex(idx);
                              setQuizAnswered(true);
                              if (isCorrect && settings.soundEffects) {
                                calmSound.playSuccess(true);
                              } else if (!isCorrect && settings.soundEffects) {
                                calmSound.playTap(true);
                              }
                            }
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            borderRadius: 'var(--radius-sm)',
                            border: `2px solid ${borderColor}`,
                            backgroundColor: bg,
                            fontSize: '0.9rem',
                            color: 'var(--text-main)',
                            fontWeight: isSelected ? 600 : 500,
                            cursor: quizAnswered ? 'default' : 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--sage-text)', backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--sage-border)' }}>
                      <strong>Helpful insight:</strong> {activeLesson.quizQuestion.explanation}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCurrentStepIndex(activeLesson.steps.length - 1)}
                  >
                    <ChevronLeft size={16} />
                    <span>Review Steps</span>
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleCompleteLesson}
                  >
                    <Sparkles size={16} />
                    <span>Master Lesson & Record Progress</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
