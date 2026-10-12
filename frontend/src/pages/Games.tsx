import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  RotateCcw,
  Trophy,
  X
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { AnimalAvatar } from '../components/AnimalAvatars.tsx';
import { GameToken, type GameTokenType } from '../components/GameTokens.tsx';
import { games } from '../data.ts';
import type { Game } from '../lib/types.ts';
import {
  loadProgress,
  loadSettings,
  recordGameCompleted
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [progress, setProgress] = useState(loadProgress());
  const settings = loadSettings();

  // 1. Feelings Quiz State
  const [quizRound, setQuizRound] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizScenarios = [
    {
      story: "Sarah's tower of blocks got accidentally knocked over by a passing backpack. Her face feels warm and her fists are tight.",
      question: 'What emotion might Sarah be feeling right now?',
      options: ['Frustrated or Overwhelmed', 'Sleepy', 'Excited'],
      correct: 0,
      feedback: 'Hot cheeks and tight hands are classic physical signs of frustration. Taking a breath helps Sarah pause.'
    },
    {
      story: 'Ben walked into a birthday party with loud blaring music, flashing disco lights, and sixty kids shouting at once. He covered his ears and looked for a corner.',
      question: 'What is happening for Ben?',
      options: ['He feels bored', 'He feels sensorily overwhelmed', 'He feels silly'],
      correct: 1,
      feedback: 'Covering ears and seeking a quiet corner indicates high sensory volume. Finding a low-stimulation spot helps.'
    },
    {
      story: 'Maya spent two days searching for her favorite green sketch marker, and this morning her brother found it safe under the couch.',
      question: 'How might Maya feel?',
      options: ['Relieved and Grateful', 'Angry', 'Disappointed'],
      correct: 0,
      feedback: 'When something you care about is found, you feel relieved, light, and happy.'
    },
    {
      story: 'Leo is about to try riding his two-wheel bicycle for the very first time without training wheels. His tummy has fluttery butterflies.',
      question: 'What is that fluttery feeling in his tummy?',
      options: ['Hungry for pizza', 'Nervous and excited anticipation', 'Tired'],
      correct: 1,
      feedback: 'Butterflies in the stomach are very common before trying something brave and new.'
    }
  ];

  // 2. Memory Match Cards (Using AnimalAvatars instead of emojis)
  interface MemoryCard {
    id: number;
    animalId: 'otter' | 'owl' | 'fox' | 'turtle' | 'bear' | 'dolphin';
    label: string;
    flipped: boolean;
    matched: boolean;
  }

  const initialAnimals: Array<{ id: 'otter' | 'owl' | 'fox' | 'turtle' | 'bear' | 'dolphin'; label: string }> = [
    { id: 'otter', label: 'Otter' },
    { id: 'owl', label: 'Owl' },
    { id: 'fox', label: 'Fox' },
    { id: 'turtle', label: 'Turtle' },
    { id: 'bear', label: 'Bear' },
    { id: 'dolphin', label: 'Dolphin' }
  ];

  const buildMemoryDeck = (): MemoryCard[] => {
    const deck: MemoryCard[] = [];
    let counter = 0;
    initialAnimals.forEach((item) => {
      deck.push({ id: counter++, animalId: item.id, label: item.label, flipped: false, matched: false });
      deck.push({ id: counter++, animalId: item.id, label: item.label, flipped: false, matched: false });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const [memoryDeck, setMemoryDeck] = useState<MemoryCard[]>(buildMemoryDeck());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // 3. Color & Shape Quest State
  const [shapeRound, setShapeRound] = useState(0);
  const [shapeScore, setShapeScore] = useState(0);
  const [shapeFeedback, setShapeFeedback] = useState<string | null>(null);

  const shapeChallenges = [
    { targetLabel: 'Teal Circle', color: '#0d8276', shape: 'circle' as const },
    { targetLabel: 'Sage Square', color: '#417558', shape: 'square' as const },
    { targetLabel: 'Sky Blue Triangle', color: '#0284c7', shape: 'triangle' as const },
    { targetLabel: 'Orange Circle', color: '#d97706', shape: 'circle' as const },
    { targetLabel: 'Teal Square', color: '#0d8276', shape: 'square' as const }
  ];

  const shapeGridOptions = [
    { label: 'Teal Circle', color: '#0d8276', shape: 'circle' as const },
    { label: 'Sage Square', color: '#417558', shape: 'square' as const },
    { label: 'Sky Blue Triangle', color: '#0284c7', shape: 'triangle' as const },
    { label: 'Orange Circle', color: '#d97706', shape: 'circle' as const },
    { label: 'Teal Square', color: '#0d8276', shape: 'square' as const },
    { label: 'Sage Triangle', color: '#417558', shape: 'triangle' as const }
  ];

  // 4. Pattern Sequence Builder State (Using GameTokens instead of emojis)
  const [patternRound, setPatternRound] = useState(0);
  const [patternScore, setPatternScore] = useState(0);
  const [patternFeedback, setPatternFeedback] = useState<string | null>(null);

  interface PatternChallenge {
    sequence: GameTokenType[];
    options: GameTokenType[];
    correct: GameTokenType;
    rule: string;
  }

  const patternChallenges: PatternChallenge[] = [
    {
      sequence: ['circle', 'square', 'circle', 'square'],
      options: ['circle', 'square', 'triangle'],
      correct: 'circle',
      rule: 'Alternating Circle and Square'
    },
    {
      sequence: ['leaf', 'leaf', 'water', 'leaf', 'leaf'],
      options: ['leaf', 'water', 'sun'],
      correct: 'water',
      rule: 'Two Leaves followed by One Water Drop'
    },
    {
      sequence: ['sun', 'pebble', 'sun', 'pebble'],
      options: ['sun', 'pebble', 'diamond'],
      correct: 'sun',
      rule: 'Sun and Pebble sequence'
    },
    {
      sequence: ['leaf', 'water', 'sun', 'leaf', 'water'],
      options: ['leaf', 'sun', 'water'],
      correct: 'sun',
      rule: 'Leaf, Water, Sun rhythm'
    }
  ];

  // Reset helpers
  const handleOpenGame = (game: Game) => {
    setSelectedGame(game);
    if (game.type === 'feelings-quiz') {
      setQuizRound(0);
      setQuizScore(0);
      setQuizAnswerSelected(null);
      setQuizFinished(false);
    } else if (game.type === 'memory-match') {
      setMemoryDeck(buildMemoryDeck());
      setFlippedCards([]);
      setMemoryMatches(0);
      setMemoryMoves(0);
    } else if (game.type === 'shape-sort') {
      setShapeRound(0);
      setShapeScore(0);
      setShapeFeedback(null);
    } else if (game.type === 'pattern-match') {
      setPatternRound(0);
      setPatternScore(0);
      setPatternFeedback(null);
    }
    if (settings.soundEffects) calmSound.playTap(true);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || memoryDeck[index].flipped || memoryDeck[index].matched) return;

    if (settings.soundEffects) calmSound.playTap(true);

    const newDeck = [...memoryDeck];
    newDeck[index].flipped = true;
    setMemoryDeck(newDeck);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newDeck[firstIdx].animalId === newDeck[secondIdx].animalId) {
        // Matched
        setTimeout(() => {
          const matchedDeck = [...newDeck];
          matchedDeck[firstIdx].matched = true;
          matchedDeck[secondIdx].matched = true;
          setMemoryDeck(matchedDeck);
          setFlippedCards([]);
          setMemoryMatches((prev) => {
            const next = prev + 1;
            if (next === initialAnimals.length) {
              const updated = recordGameCompleted('memory-match', initialAnimals.length);
              setProgress(updated);
              if (settings.soundEffects) calmSound.playSuccess(true);
            } else {
              if (settings.soundEffects) calmSound.playChime(true, 528);
            }
            return next;
          });
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          const resetDeck = [...newDeck];
          resetDeck[firstIdx].flipped = false;
          resetDeck[secondIdx].flipped = false;
          setMemoryDeck(resetDeck);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="games-page">
      {/* Page Header */}
      <section className="page-header" style={{ marginBottom: '1.25rem' }}>
        <h1 className="page-title">Games</h1>
        <p className="page-description">
          Low-pressure, engaging games for memory, emotional awareness, and pattern reasoning.
        </p>
      </section>

      {/* Game Cards Grid */}
      <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {games.map((game) => {
          const isCompleted = progress.completedGames.includes(game.id);
          const highScore = progress.gameHighScores[game.id];

          return (
            <Card
              key={game.id}
              accent={game.accent}
              interactive
              onClick={() => handleOpenGame(game)}
              style={{ padding: '1.25rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}
              >
                <span className={`badge badge-${game.accent}`}>
                  {game.type === 'feelings-quiz'
                    ? 'Social Perspective'
                    : game.type === 'memory-match'
                    ? 'Working Memory'
                    : game.type === 'shape-sort'
                    ? 'Visual Focus'
                    : 'Pattern Reasoning'}
                </span>

                {isCompleted && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: 'var(--teal-primary)',
                      fontWeight: 600
                    }}
                  >
                    <CheckCircle2 size={13} aria-hidden="true" />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {game.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
                {game.description}
              </p>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {game.skillsTrained.map((sk) => (
                  <span
                    key={sk}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 7px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '0.75rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  {highScore ? `Best record: ${highScore}` : 'Play at your own pace'}
                </span>
                <button className="btn btn-primary btn-sm">
                  <span>Enter Game</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Playable Game Modal / Drawer */}
      {selectedGame && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-modal-title"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', width: '95%' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gamepad2 size={20} style={{ color: `var(--${selectedGame.accent}-primary)` }} />
                <h3 id="game-modal-title" className="modal-title">
                  {selectedGame.title}
                </h3>
              </div>
              <button
                className="icon-btn"
                onClick={() => setSelectedGame(null)}
                aria-label="Close game"
              >
                <X size={16} />
              </button>
            </div>

            {/* GAME 1: FEELINGS DETECTIVE */}
            {selectedGame.type === 'feelings-quiz' && (
              <div>
                {!quizFinished ? (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-subtle)'
                      }}
                    >
                      <span>Scenario {quizRound + 1} of {quizScenarios.length}</span>
                      <span>Score: {quizScore}</span>
                    </div>

                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        color: 'var(--text-main)'
                      }}
                    >
                      {quizScenarios[quizRound].story}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                      {quizScenarios[quizRound].question}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {quizScenarios[quizRound].options.map((opt, idx) => {
                        const isCorrect = idx === quizScenarios[quizRound].correct;
                        const isChosen = quizAnswerSelected === idx;

                        let borderColor = 'var(--border-light)';
                        let bg = 'var(--bg-surface)';

                        if (quizAnswerSelected !== null) {
                          if (isCorrect) {
                            borderColor = 'var(--sage-primary)';
                            bg = 'var(--sage-surface)';
                          } else if (isChosen) {
                            borderColor = 'var(--orange-primary)';
                            bg = 'var(--orange-surface)';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={quizAnswerSelected !== null}
                            onClick={() => {
                              setQuizAnswerSelected(idx);
                              if (isCorrect) {
                                setQuizScore((s) => s + 1);
                                if (settings.soundEffects) calmSound.playSuccess(true);
                              } else {
                                if (settings.soundEffects) calmSound.playTap(true);
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
                              fontWeight: 500,
                              cursor: quizAnswerSelected === null ? 'pointer' : 'default'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizAnswerSelected !== null && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          marginBottom: '1.25rem'
                        }}
                      >
                        <strong>Detective insight: </strong>{quizScenarios[quizRound].feedback}
                      </div>
                    )}

                    {quizAnswerSelected !== null && (
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                          if (quizRound < quizScenarios.length - 1) {
                            setQuizRound((r) => r + 1);
                            setQuizAnswerSelected(null);
                          } else {
                            setQuizFinished(true);
                            const updated = recordGameCompleted('feelings-quiz', quizScore + (quizAnswerSelected === quizScenarios[quizRound].correct ? 0 : 0));
                            setProgress(updated);
                            if (settings.soundEffects) calmSound.playSuccess(true);
                          }
                        }}
                      >
                        {quizRound < quizScenarios.length - 1 ? 'Next Scenario' : 'View Detective Summary'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <Trophy size={48} style={{ color: 'var(--orange-primary)', margin: '0 auto 0.75rem' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      Great Detective Work!
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      You recognized {quizScore} out of {quizScenarios.length} emotional situations with care and kindness.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setQuizRound(0);
                          setQuizScore(0);
                          setQuizAnswerSelected(null);
                          setQuizFinished(false);
                        }}
                      >
                        <RotateCcw size={16} />
                        <span>Play Again</span>
                      </button>
                      <button className="btn btn-primary" onClick={() => setSelectedGame(null)}>
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GAME 2: MEMORY MATCH */}
            {selectedGame.type === 'memory-match' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-subtle)'
                  }}
                >
                  <span>Pairs Matched: {memoryMatches} / {initialAnimals.length}</span>
                  <span>Turns: {memoryMoves}</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  {memoryDeck.map((card, index) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(index)}
                      style={{
                        height: '80px',
                        borderRadius: 'var(--radius-md)',
                        border: card.matched ? '2px solid var(--sage-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: card.flipped || card.matched ? 'var(--sage-surface)' : 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: card.matched ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                      aria-label={`Card ${index + 1}: ${card.flipped || card.matched ? card.label : 'Hidden'}`}
                    >
                      {card.flipped || card.matched ? (
                        <>
                          <AnimalAvatar id={card.animalId} size={38} showBg={false} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--sage-text)', fontWeight: 600, marginTop: '2px' }}>
                            {card.label}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1rem', color: 'var(--text-subtle)', fontWeight: 700 }}>?</span>
                      )}
                    </button>
                  ))}
                </div>

                {memoryMatches === initialAnimals.length && (
                  <div
                    style={{
                      padding: '0.85rem',
                      backgroundColor: 'var(--sage-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--sage-border)',
                      textAlign: 'center',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <h5 style={{ fontWeight: 700, color: 'var(--sage-text)', fontSize: '1rem', marginBottom: '0.2rem' }}>
                      All Friendly Pairs Matched!
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Completed in {memoryMoves} turns. Your memory progress has been recorded!
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setMemoryDeck(buildMemoryDeck());
                      setFlippedCards([]);
                      setMemoryMatches(0);
                      setMemoryMoves(0);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>Reshuffle Cards</span>
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedGame(null)}>
                    <span>Done Playing</span>
                  </button>
                </div>
              </div>
            )}

            {/* GAME 3: COLOR & SHAPE FOCUS QUEST */}
            {selectedGame.type === 'shape-sort' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  <span>Round {shapeRound + 1} of {shapeChallenges.length}</span>
                  <span>Matches: {shapeScore}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--blue-surface)',
                    border: '1px solid var(--blue-border)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--blue-text)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                    FIND AND CLICK:
                  </span>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {shapeChallenges[shapeRound].targetLabel}
                  </h4>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  {shapeGridOptions.map((opt) => {
                    const isTarget = opt.label === shapeChallenges[shapeRound].targetLabel;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                          if (isTarget) {
                            setShapeScore((s) => s + 1);
                            setShapeFeedback('Correct match!');
                            if (settings.soundEffects) calmSound.playSuccess(true);
                            setTimeout(() => {
                              setShapeFeedback(null);
                              if (shapeRound < shapeChallenges.length - 1) {
                                setShapeRound((r) => r + 1);
                              } else {
                                const updated = recordGameCompleted('shape-sort', shapeScore + 1);
                                setProgress(updated);
                              }
                            }, 600);
                          } else {
                            setShapeFeedback('Try looking closely at color and shape!');
                            if (settings.soundEffects) calmSound.playTap(true);
                          }
                        }}
                        style={{
                          height: '90px',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Shape Drawing */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: opt.color,
                            borderRadius: opt.shape === 'circle' ? '50%' : opt.shape === 'square' ? '4px' : '0',
                            clipPath: opt.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {shapeFeedback && (
                  <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--blue-text)', marginBottom: '1rem', fontWeight: 600 }}>
                    {shapeFeedback}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedGame(null)}>
                    Done Playing
                  </button>
                </div>
              </div>
            )}

            {/* GAME 4: MINDFUL PATTERN BUILDER */}
            {selectedGame.type === 'pattern-match' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  <span>Pattern {patternRound + 1} of {patternChallenges.length}</span>
                  <span>Score: {patternScore}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--orange-surface)',
                    border: '1px solid var(--orange-border)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--orange-text)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                    WHAT COMES NEXT IN THIS RHYTHM?
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.85rem' }}>
                    {patternChallenges[patternRound].sequence.map((type, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '6px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <GameToken type={type} size={32} />
                      </div>
                    ))}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        border: '2px dashed var(--orange-primary)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        color: 'var(--orange-primary)',
                        fontWeight: 700
                      }}
                    >
                      ?
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  {patternChallenges[patternRound].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        const isCorrect = opt === patternChallenges[patternRound].correct;
                        if (isCorrect) {
                          setPatternScore((s) => s + 1);
                          setPatternFeedback(`Correct! Pattern: ${patternChallenges[patternRound].rule}`);
                          if (settings.soundEffects) calmSound.playSuccess(true);
                          setTimeout(() => {
                            setPatternFeedback(null);
                            if (patternRound < patternChallenges.length - 1) {
                              setPatternRound((r) => r + 1);
                            } else {
                              const updated = recordGameCompleted('pattern-match', patternScore + 1);
                              setProgress(updated);
                            }
                          }, 900);
                        } else {
                          setPatternFeedback('Look closely at what repeated earlier!');
                          if (settings.soundEffects) calmSound.playTap(true);
                        }
                      }}
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                      aria-label={`Option: ${opt}`}
                    >
                      <GameToken type={opt} size={36} />
                    </button>
                  ))}
                </div>

                {patternFeedback && (
                  <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--orange-text)', marginBottom: '1rem', fontWeight: 600 }}>
                    {patternFeedback}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedGame(null)}>
                    Done Playing
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
