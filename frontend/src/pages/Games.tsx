import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Smile,
  Puzzle,
  Compass,
  X
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
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
      options: ['Frustrated or Angry', 'Sleepy', 'Excited'],
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
      options: ['Hungry for pizza', 'Nervous and excited (Anticipation)', 'Tired'],
      correct: 1,
      feedback: 'Butterflies in the stomach are very common before trying something brave and new.'
    }
  ];

  // 2. Memory Match Game State
  interface MemoryCard {
    id: number;
    symbol: string;
    label: string;
    flipped: boolean;
    matched: boolean;
  }

  const initialSymbols = [
    { symbol: '🦦', label: 'Otter' },
    { symbol: '🦉', label: 'Owl' },
    { symbol: '🦊', label: 'Fox' },
    { symbol: '🐢', label: 'Turtle' },
    { symbol: '🐻', label: 'Bear' },
    { symbol: '🐬', label: 'Dolphin' }
  ];

  const buildMemoryDeck = (): MemoryCard[] => {
    const deck: MemoryCard[] = [];
    let counter = 0;
    initialSymbols.forEach((item) => {
      deck.push({ id: counter++, symbol: item.symbol, label: item.label, flipped: false, matched: false });
      deck.push({ id: counter++, symbol: item.symbol, label: item.label, flipped: false, matched: false });
    });
    // Friendly shuffle
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
    { targetLabel: 'Teal Circle', color: '#0d8276', shape: 'circle' },
    { targetLabel: 'Sage Square', color: '#417558', shape: 'square' },
    { targetLabel: 'Sky Blue Triangle', color: '#0284c7', shape: 'triangle' },
    { targetLabel: 'Orange Circle', color: '#d97706', shape: 'circle' },
    { targetLabel: 'Teal Square', color: '#0d8276', shape: 'square' }
  ];

  const shapeGridOptions = [
    { label: 'Teal Circle', color: '#0d8276', shape: 'circle' },
    { label: 'Sage Square', color: '#417558', shape: 'square' },
    { label: 'Sky Blue Triangle', color: '#0284c7', shape: 'triangle' },
    { label: 'Orange Circle', color: '#d97706', shape: 'circle' },
    { label: 'Teal Square', color: '#0d8276', shape: 'square' },
    { label: 'Sage Triangle', color: '#417558', shape: 'triangle' }
  ];

  // 4. Pattern Sequence Builder State
  const [patternRound, setPatternRound] = useState(0);
  const [patternScore, setPatternScore] = useState(0);
  const [patternFeedback, setPatternFeedback] = useState<string | null>(null);

  const patternChallenges = [
    {
      sequence: ['🔵', '🟧', '🔵', '🟧'],
      options: ['🔵', '🟧', '🟢'],
      correct: '🔵',
      rule: 'Alternating Blue Circle and Orange Square'
    },
    {
      sequence: ['🟢', '🟢', '🔵', '🟢', '🟢'],
      options: ['🟢', '🔵', '🟧'],
      correct: '🔵',
      rule: 'Two Green Circles followed by One Blue Circle'
    },
    {
      sequence: ['⭐', '🌙', '⭐', '🌙'],
      options: ['⭐', '🌙', '☀️'],
      correct: '⭐',
      rule: 'Star then Moon pattern'
    },
    {
      sequence: ['🍃', '💧', '☀️', '🍃', '💧'],
      options: ['🍃', '☀️', '💧'],
      correct: '☀️',
      rule: 'Leaf, Water Drop, Sun rhythm'
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

    const newDeck = memoryDeck.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setMemoryDeck(newDeck);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newDeck[firstIdx].label === newDeck[secondIdx].label) {
        // Match!
        const matchedDeck = newDeck.map((c, i) =>
          i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
        );
        setMemoryDeck(matchedDeck);
        setMemoryMatches((m) => m + 1);
        setFlippedCards([]);
        if (settings.soundEffects) calmSound.playSuccess(true);

        if (memoryMatches + 1 === initialSymbols.length) {
          // Finished!
          const updated = recordGameCompleted('memory-match', 10);
          setProgress(updated);
        }
      } else {
        // No match: flip back
        setTimeout(() => {
          setMemoryDeck((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="games-page">
      <section className="page-header">
        <h2 className="page-title">Playful Practice</h2>
        <p className="page-description">
          Low-pressure, interactive educational games designed for emotional recognition, pattern matching, and memory.
        </p>
      </section>

      {/* Games Showcase Grid */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="grid-2">
          {games.map((game) => {
            const isPlayed = progress.completedGames.includes(game.id);
            const highScore = progress.gameHighScores[game.id];
            const GameIcon =
              game.type === 'feelings-quiz'
                ? Smile
                : game.type === 'memory-match'
                ? Puzzle
                : game.type === 'shape-sort'
                ? Compass
                : Gamepad2;

            return (
              <Card
                key={game.id}
                accent="default"
                interactive
                onClick={() => handleOpenGame(game)}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        game.accent === 'teal'
                          ? 'var(--teal-surface)'
                          : game.accent === 'sage'
                          ? 'var(--sage-surface)'
                          : game.accent === 'blue'
                          ? 'var(--blue-surface)'
                          : 'var(--orange-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color:
                        game.accent === 'teal'
                          ? 'var(--teal-primary)'
                          : game.accent === 'sage'
                          ? 'var(--sage-primary)'
                          : game.accent === 'blue'
                          ? 'var(--blue-primary)'
                          : 'var(--orange-primary)'
                    }}
                  >
                    <GameIcon size={18} aria-hidden="true" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isPlayed && (
                      <span className="badge badge-teal" style={{ textTransform: 'none' }}>
                        <CheckCircle2 size={11} />
                        <span>Score: {highScore || 'Done'}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {game.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, flex: 1, marginBottom: '0.75rem' }}>
                  {game.description}
                </p>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  {game.skillsTrained.map((skill) => (
                    <span key={skill} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    Accessible & Gentle
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                    Play Game &rarr;
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive Playable Game Modal */}
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
            style={{ maxWidth: '640px', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="game-modal-title" className="modal-title">
                {selectedGame.title}
              </h3>
              <button
                className="icon-btn"
                onClick={() => setSelectedGame(null)}
                aria-label="Close game"
              >
                <X size={16} />
              </button>
            </div>

            {/* GAME 1: FEELINGS DETECTIVE QUIZ */}
            {selectedGame.type === 'feelings-quiz' && (
              <div>
                {!quizFinished ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                      <span>Scenario {quizRound + 1} of {quizScenarios.length}</span>
                      <span>Score: {quizScore}</span>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'var(--teal-surface)',
                        border: '1px solid var(--teal-border)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.55, marginBottom: '0.75rem' }}>
                        "{quizScenarios[quizRound].story}"
                      </p>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--teal-text)' }}>
                        {quizScenarios[quizRound].question}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {quizScenarios[quizRound].options.map((opt, idx) => {
                        const isChosen = quizAnswerSelected === idx;
                        const isCorrect = idx === quizScenarios[quizRound].correct;
                        let borderColor = 'var(--border-light)';
                        let bg = 'var(--bg-surface)';

                        if (quizAnswerSelected !== null) {
                          if (isCorrect) {
                            borderColor = 'var(--sage-primary)';
                            bg = '#e3f3e8';
                          } else if (isChosen) {
                            borderColor = 'var(--orange-primary)';
                            bg = '#feefe7';
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
                        <strong>Detective insight:</strong> {quizScenarios[quizRound].feedback}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  <span>Pairs Matched: {memoryMatches} / {initialSymbols.length}</span>
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
                        height: '75px',
                        borderRadius: 'var(--radius-md)',
                        border: card.matched ? '2px solid var(--sage-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: card.flipped || card.matched ? 'var(--sage-surface)' : 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: card.matched ? 'default' : 'pointer',
                        fontSize: '1.75rem',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                      aria-label={`Card ${index + 1}: ${card.flipped || card.matched ? card.label : 'Hidden'}`}
                    >
                      {card.flipped || card.matched ? (
                        <>
                          <span>{card.symbol}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--sage-text)', fontWeight: 600 }}>
                            {card.label}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1rem', color: 'var(--text-subtle)' }}>?</span>
                      )}
                    </button>
                  ))}
                </div>

                {memoryMatches === initialSymbols.length && (
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--sage-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-border)', textAlign: 'center', marginBottom: '1.25rem' }}>
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--orange-text)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    WHAT COMES NEXT IN THIS RHYTHM?
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem' }}>
                    {patternChallenges[patternRound].sequence.map((sym, i) => (
                      <span key={i}>{sym}</span>
                    ))}
                    <span style={{ width: '40px', height: '40px', border: '2px dashed var(--orange-primary)', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--orange-primary)' }}>
                      ?
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  {patternChallenges[patternRound].options.map((opt) => (
                    <button
                      key={opt}
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
                        width: '64px',
                        height: '64px',
                        fontSize: '1.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      {opt}
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
