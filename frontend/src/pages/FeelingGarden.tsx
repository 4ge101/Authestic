import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Eye,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { loadProgress, loadSettings, recordActivityCompleted } from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

interface EmotionBloom {
  id: string;
  name: string;
  color: string;
  surface: string;
  border: string;
  bodyClues: string;
  thoughtClues: string;
  comfortTips: string[];
}

export const FeelingGarden: React.FC = () => {
  const navigate = useNavigate();
  const settings = loadSettings();
  const [, setProgress] = useState(loadProgress());

  const [activeTab, setActiveTab] = useState<'blooms' | 'expressions' | 'perspectives' | 'cards'>('blooms');
  const [selectedBloomId, setSelectedBloomId] = useState<string>('calm');
  const [plantedBlooms, setPlantedBlooms] = useState<string[]>(['calm']);
  const [plantedFeedback, setPlantedFeedback] = useState<string | null>(null);

  // Perspective Scenario State
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const emotionBlooms: EmotionBloom[] = [
    {
      id: 'calm',
      name: 'Peaceful & Grounded',
      color: '#417558',
      surface: '#F3F8F5',
      border: '#C6E0D0',
      bodyClues: 'Shoulders are relaxed, breathing is slow and steady, hands are resting easily.',
      thoughtClues: '"I am safe. I can take my time with what I am doing."',
      comfortTips: [
        'Enjoy a quiet story or gentle drawing',
        'Notice three calm things in your room',
        'Share your peaceful mood with a friend or pet'
      ]
    },
    {
      id: 'joy',
      name: 'Joy & Excitement',
      color: '#D97706',
      surface: '#FAF2EA',
      border: '#FEDCB0',
      bodyClues: 'A light fluttering in your chest, bouncy feet, or wishing to flap hands with happiness.',
      thoughtClues: '"Something wonderful just happened! I want to explore and share!"',
      comfortTips: [
        'Dance or bounce safely in your space',
        'Tell someone about your favorite special topic',
        'Draw a bright picture of what made you smile'
      ]
    },
    {
      id: 'overwhelmed',
      name: 'Sensory Overload',
      color: '#0D8276',
      surface: '#EEF6F5',
      border: '#B6D6D1',
      bodyClues: 'Ears buzzing, lights feeling piercingly bright, stomach tight, wanting to cover head.',
      thoughtClues: '"Everything is too loud, too fast, or too much at once."',
      comfortTips: [
        'Put on noise-cancelling headphones or dim lights',
        'Step away to a quiet cozy corner with a heavy blanket',
        'Use the 3-word phrase: "Need quiet break"'
      ]
    },
    {
      id: 'nervous',
      name: 'Nervous & Uncertain',
      color: '#0284C7',
      surface: '#E6EFF7',
      border: '#BCE1F8',
      bodyClues: 'Butterflies fluttering in your tummy, heart beating faster, cold fingertips.',
      thoughtClues: '"I do not know what is going to happen next, or a plan changed."',
      comfortTips: [
        'Look at a visual schedule or ask what comes next',
        'Take three long exhale breaths (the soap bubble breath)',
        'Hold a comforting smooth pebble or soft fabric'
      ]
    },
    {
      id: 'sad',
      name: 'Gentle Sadness',
      color: '#637587',
      surface: '#F2EEE8',
      border: '#D6CEC0',
      bodyClues: 'Heavy eyelids, a lump in the throat, low energy, wanting to curl up softly.',
      thoughtClues: '"I lost something I cared about, or I feel lonely right now."',
      comfortTips: [
        'Tears are natural rain that helps clean the sky',
        'Curl up with your favorite warm hoodie or plushie',
        'You do not have to smile when you feel sad'
      ]
    },
    {
      id: 'curious',
      name: 'Curious & Focused',
      color: '#5D9C94',
      surface: '#EEF6F5',
      border: '#B6D6D1',
      bodyClues: 'Eyes wide and attentive, leaning in, quiet concentration on intricate details.',
      thoughtClues: '"How does this work? I want to discover every piece of this."',
      comfortTips: [
        'Dive into your favorite subject without rush',
        'Build or organize objects in satisfying patterns',
        'Keep a notebook of cool facts you notice'
      ]
    }
  ];

  const selectedBloom = emotionBlooms.find((b) => b.id === selectedBloomId) || emotionBlooms[0];

  const handlePlantBloom = (bloom: EmotionBloom) => {
    if (!plantedBlooms.includes(bloom.id)) {
      setPlantedBlooms([...plantedBlooms, bloom.id]);
    }
    setPlantedFeedback(`You planted the ${bloom.name} bloom in your daily garden.`);
    if (settings.soundEffects) {
      calmSound.playChime(true, 528);
    }
    const updated = recordActivityCompleted('positive-affirmations');
    setProgress(updated);
    setTimeout(() => setPlantedFeedback(null), 3500);
  };

  const perspectiveScenarios = [
    {
      title: 'The School Fire Alarm Drill',
      event: 'A loud buzzing horn sounds across the hallway for a scheduled practice drill.',
      perspectiveA: {
        character: 'Pip the Duck',
        reaction: 'Covers ears immediately because loud high-pitch sounds cause physical pain. Needs to walk calmly outside with ear defenders.'
      },
      perspectiveB: {
        character: 'Benny Rabbit',
        reaction: 'Feels excited by the change in schedule and likes walking outdoors, but notices his friend Pip needs quiet space.'
      },
      takeaway: 'Both feelings are completely real. What is loud and painful for one person might feel ordinary to another.'
    },
    {
      title: 'A Sudden Schedule Shift',
      event: 'The teacher announces: "Instead of drawing time today, we will play outside."',
      perspectiveA: {
        character: 'Bramble the Hedgehog',
        reaction: 'Feels startled and anxious because he had prepared his pencils and planned his picture. He needs a minute to adjust.'
      },
      perspectiveB: {
        character: 'Maya the Squirrel',
        reaction: 'Leaps up happily because she loves outdoor running. Then remembers to give Bramble time to pack his pencil case.'
      },
      takeaway: 'Adjusting to unexpected change takes energy. Giving friends advance warning makes everyone feel respected.'
    },
    {
      title: 'Listening During Storytime',
      event: 'The group is listening to a guest reader in the library.',
      perspectiveA: {
        character: 'Leo the Otter',
        reaction: 'Looks down at a smooth pebble in his lap and rolls it between his paws. He hears every word clearly.'
      },
      perspectiveB: {
        character: 'Daisy Dolphin',
        reaction: 'Looks directly at the reader’s face and smiles. She learns best through facial expressions.'
      },
      takeaway: 'Listening does not require staring at someone’s eyes. Fidgeting softly or looking down often helps brains focus.'
    }
  ];

  const currentScenario = perspectiveScenarios[scenarioIndex];

  return (
    <div className="feeling-garden-page">
      {/* Navigation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            aria-label="Back to world map"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>World Map</span>
          </button>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Feeling Garden
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Explore feelings, body signals, and compassionate communication
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-sage">
            <CheckCircle2 size={13} aria-hidden="true" />
            <span>{plantedBlooms.length} Blooms Visited</span>
          </span>
        </div>
      </div>

      {/* Garden Category Tabs */}
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
          onClick={() => setActiveTab('blooms')}
          className={`btn btn-sm ${activeTab === 'blooms' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Emotion Blooms</span>
        </button>
        <button
          onClick={() => setActiveTab('expressions')}
          className={`btn btn-sm ${activeTab === 'expressions' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Expression Explorer</span>
        </button>
        <button
          onClick={() => setActiveTab('perspectives')}
          className={`btn btn-sm ${activeTab === 'perspectives' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Perspective Bridge</span>
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`btn btn-sm ${activeTab === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <span>Communication Cards</span>
        </button>
      </div>

      {/* Tab 1: Emotion Blooms */}
      {activeTab === 'blooms' && (
        <div className="blooms-tab">
          {plantedFeedback && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--sage-surface)',
                border: '1px solid var(--sage-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--sage-text)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{plantedFeedback}</span>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            {emotionBlooms.map((bloom) => {
              const isSelected = selectedBloomId === bloom.id;
              const isPlanted = plantedBlooms.includes(bloom.id);

              return (
                <button
                  key={bloom.id}
                  onClick={() => {
                    setSelectedBloomId(bloom.id);
                    if (settings.soundEffects) calmSound.playTap(true);
                  }}
                  style={{
                    backgroundColor: bloom.surface,
                    border: `2px solid ${isSelected ? bloom.color : bloom.border}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: 'center',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  aria-pressed={isSelected}
                >
                  {/* Flower Graphic */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: bloom.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      color: '#FFFFFF'
                    }}
                  >
                    <Heart size={20} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {bloom.name}
                  </span>
                  {isPlanted && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        color: 'var(--teal-primary)'
                      }}
                    >
                      <CheckCircle2 size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Bloom Explorer Card */}
          <Card accent="default" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: selectedBloom.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Heart size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    {selectedBloom.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    All feelings visit and leave like weather in the garden
                  </span>
                </div>
              </div>

              <button
                onClick={() => handlePlantBloom(selectedBloom)}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: selectedBloom.color, borderColor: selectedBloom.color }}
              >
                <span>Plant in My Garden Today</span>
              </button>
            </div>

            <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Eye size={16} style={{ color: selectedBloom.color }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Body Signals
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {selectedBloom.bodyClues}
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Sparkles size={16} style={{ color: selectedBloom.color }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    What Your Brain Might Whisper
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {selectedBloom.thoughtClues}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Gentle Things That Help
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {selectedBloom.comfortTips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', lineHeight: 1.45 }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Expression Explorer */}
      {activeTab === 'expressions' && (
        <div className="expressions-tab">
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              There is no single "correct" way for human beings to look or act when experiencing an emotion. Explore these neurodiversity-affirming clues.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <Card accent="teal" style={{ padding: '1.25rem' }}>
              <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Listening & Focusing</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Different Ways We Listen
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Some friends look directly at faces. Others look down at their hands or a soft pebble to hear better without visual distraction. Both ways are respectful.
              </p>
            </Card>

            <Card accent="orange" style={{ padding: '1.25rem' }}>
              <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>Sharing Excitement</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Different Ways We Show Joy
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Joy can be a quiet peaceful smile, or it can be hand-flapping, bouncing, or talking enthusiastically about a favorite animal or train line.
              </p>
            </Card>

            <Card accent="blue" style={{ padding: '1.25rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Needing Rest</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Different Ways We Recharge
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                When tired, some friends prefer curling up alone under a heavy blanket, while others feel calm doing a gentle puzzle side by side in parallel play.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Perspective Bridge */}
      {activeTab === 'perspectives' && (
        <div className="perspectives-tab">
          <Card accent="sage" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <div>
                <span className="badge badge-sage">Scenario {scenarioIndex + 1} of {perspectiveScenarios.length}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {currentScenario.title}
                </h3>
              </div>
              <button
                onClick={() => setScenarioIndex((prev) => (prev + 1) % perspectiveScenarios.length)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RefreshCw size={14} />
                <span>Next Scenario</span>
              </button>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                color: 'var(--text-main)'
              }}
            >
              <strong>What Happens: </strong>{currentScenario.event}
            </div>

            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  padding: '1rem',
                  border: '1.5px solid var(--teal-border)',
                  backgroundColor: 'var(--teal-surface)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-primary)' }}>
                  {currentScenario.perspectiveA.character}'s Experience
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--teal-text)', margin: '0.4rem 0 0', lineHeight: 1.45 }}>
                  {currentScenario.perspectiveA.reaction}
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1.5px solid var(--orange-border)',
                  backgroundColor: 'var(--orange-surface)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--orange-primary)' }}>
                  {currentScenario.perspectiveB.character}'s Experience
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--orange-text)', margin: '0.4rem 0 0', lineHeight: 1.45 }}>
                  {currentScenario.perspectiveB.reaction}
                </p>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.85rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}
            >
              <strong>Helpful Takeaway: </strong>{currentScenario.takeaway}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Communication Cards */}
      {activeTab === 'cards' && (
        <div className="cards-tab">
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              When spoken words feel heavy, tap or show these clear visual message cards to a caregiver, teacher, or friend.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {[
              { title: 'I Need a Quiet Break', desc: 'Please let me rest in a calm spot for 5 minutes.', accent: 'teal' as const },
              { title: 'Sounds Are Too Loud', desc: 'Can we lower the volume or use ear protectors?', accent: 'blue' as const },
              { title: 'Can You Give Me Time?', desc: 'I am processing your question. I will answer soon.', accent: 'sage' as const },
              { title: 'Can We Stick to the Plan?', desc: 'I feel most comfortable when I know what comes next.', accent: 'orange' as const },
              { title: 'I Want Parallel Play', desc: 'I would love to sit near you while doing my own drawing.', accent: 'teal' as const },
              { title: 'I Am Happy Today', desc: 'My energy feels good and I am ready to explore.', accent: 'sage' as const }
            ].map((card, idx) => (
              <Card key={idx} accent={card.accent} style={{ padding: '1.25rem', textAlign: 'center' }}>
                <ShieldCheck size={28} style={{ margin: '0 auto 0.5rem', color: `var(--${card.accent}-primary)` }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {card.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {card.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
