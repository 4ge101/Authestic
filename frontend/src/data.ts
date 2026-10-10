import type { Story, Activity, Lesson, Game, Milestone } from './lib/types.ts';

export const stories: Story[] = [
  {
    id: 'quiet-otter',
    title: "The Quiet Otter's Big Day",
    category: 'Emotions',
    readTimeMinutes: 4,
    ageRange: 'Ages 5 to 8',
    summary: 'Ollie the otter loves gentle river sounds. When the harbor festival gets too noisy, Ollie discovers that listening to quiet feelings is a true superpower.',
    coverAccent: 'teal',
    reflectionQuestion: 'Where is your favorite quiet spot when sounds or crowds feel too big?',
    pages: [
      {
        pageNumber: 1,
        text: 'Ollie was a river otter with velvety fur and very sensitive whiskers. While other otters loved splashing in roaring waterfalls, Ollie preferred floating softly on green water lilies, listening to the gentle hum of dragonflies.',
        highlightWords: ['whiskers', 'floating', 'gentle']
      },
      {
        pageNumber: 2,
        text: 'One sunny morning, the river animals announced the Grand Pebble Splash. Drums began to beat. Horns sounded loud and bright. Ollie felt his chest grow tight, and his ears began to buzz. Everything felt too fast and too noisy.',
        highlightWords: ['tight', 'buzz', 'noisy']
      },
      {
        pageNumber: 3,
        text: 'Ollie remembered what his grandmother taught him: "When the world is too loud, find your quiet anchor." Ollie swam gently toward a cool willow cove. He took three slow breaths, feeling the cool water lap against his paws.',
        highlightWords: ['anchor', 'slow breaths', 'cool water']
      },
      {
        pageNumber: 4,
        text: 'Soon, his friend Pip the duck wandered in, looking tired. "Can I sit here with you?" Pip asked softly. Ollie nodded with a warm smile. They shared quiet pebbles together, realizing that taking a calm pause makes room for real peace.',
        highlightWords: ['warm smile', 'calm pause', 'peace']
      }
    ]
  },
  {
    id: 'bramble-tree',
    title: 'Bramble and the Tree of Whispers',
    category: 'Bravery',
    readTimeMinutes: 5,
    ageRange: 'Ages 6 to 9',
    summary: 'When a sudden gust of wind rearranges the forest trail, Bramble the hedgehog learns that unexpected changes do not have to be scary.',
    coverAccent: 'sage',
    reflectionQuestion: 'What helps you feel brave when a plan changes unexpectedly?',
    pages: [
      {
        pageNumber: 1,
        text: 'Bramble liked having a regular routine. Every Tuesday at precisely nine acorn clicks, he would count seven pinecones and walk to the mossy stone. Knowing what was coming next made his quills stay flat and relaxed.',
        highlightWords: ['routine', 'pinecones', 'relaxed']
      },
      {
        pageNumber: 2,
        text: 'One afternoon, a great gust of wind swept through the valley. It scattered Bramble’s favorite stepping stones across the brook! Bramble stopped. His quills stood up like little prickles. The path looked completely different.',
        highlightWords: ['quills', 'brook', 'different']
      },
      {
        pageNumber: 3,
        text: 'Bramble placed his little paws over his chest and counted four long breaths: in through the nose, out like a gentle sigh. "The stones moved," Bramble whispered, "but I am still right here, and I can take one step at a time."',
        highlightWords: ['long breaths', 'one step', 'whispered']
      },
      {
        pageNumber: 4,
        text: 'Step by step, he found a soft patch of wild clover he had never noticed before. It smelled sweet like honey. Bramble smiled. Changing the trail had led him to a wonderful new discovery.',
        highlightWords: ['clover', 'discovery', 'smiled']
      }
    ]
  },
  {
    id: 'maya-space-bubble',
    title: "Maya's Friendly Space Bubble",
    category: 'Friendship',
    readTimeMinutes: 4,
    ageRange: 'Ages 5 to 8',
    summary: 'Maya loves her clear invisible space bubble. Learn how friends can show warmth and caring while honoring each other’s personal boundaries.',
    coverAccent: 'blue',
    reflectionQuestion: 'How do you like to greet people when you want gentle personal space?',
    pages: [
      {
        pageNumber: 1,
        text: 'Maya the squirrel imagined a soft, shimmering bubble around herself. Inside her bubble, she had plenty of room to stretch her arms, think quiet thoughts, and breathe peacefully without bumping elbows.',
        highlightWords: ['bubble', 'stretch', 'peacefully']
      },
      {
        pageNumber: 2,
        text: 'At school, her cheerful classmate Benny rabbit loved bouncing very close and giving sudden high-fives. Sometimes Benny’s fast jumps popped into Maya’s bubble before she was ready, making her want to hide inside her hollow log.',
        highlightWords: ['bouncing', 'ready', 'hide']
      },
      {
        pageNumber: 3,
        text: 'Her teacher, Owl, taught them the Friendly Wave Check: "Before we get close, we hold our hands up and check if our friend’s bubble is open for a hug, a wave, or a friendly thumbs-up."',
        highlightWords: ['wave', 'check', 'thumbs-up']
      },
      {
        pageNumber: 4,
        text: 'The next morning, Benny stopped two hops away and flashed a bright peace sign. Maya beamed and gave a two-handed wave. Both friends felt respected, comfortable, and happy to build a sandcastle side by side.',
        highlightWords: ['respected', 'comfortable', 'happy']
      }
    ]
  },
  {
    id: 'sam-morning-routine',
    title: "Sam's Smooth Morning Rhythm",
    category: 'Daily Life',
    readTimeMinutes: 3,
    ageRange: 'Ages 4 to 7',
    summary: 'Mornings can feel rushed and scratchy. Sam discovers visual cards and seamless socks that turn morning chaos into a smooth song.',
    coverAccent: 'orange',
    reflectionQuestion: 'Which part of your morning routine feels easiest, and which part feels tricky?',
    pages: [
      {
        pageNumber: 1,
        text: 'Sam was a bear cub who had very sensitive skin. Stiff shirt tags felt like prickly pine needles, and the ticking hallway clock felt like tiny hammers when he was trying to put his boots on.',
        highlightWords: ['sensitive', 'tags', 'boots']
      },
      {
        pageNumber: 2,
        text: 'His mother helped him make a Morning Picture Board: four wooden clips with little drawings. One for warm oatmeal, one for seamless socks, one for teeth brushing, and one for backpack zipper.',
        highlightWords: ['picture board', 'drawings', 'backpack']
      },
      {
        pageNumber: 3,
        text: 'Instead of rushing, Sam turned on gentle flute music. Whenever he finished a picture step, he slid the wooden clip across the board with a satisfying snap. No one yelled or rushed.',
        highlightWords: ['gentle music', 'clip', 'satisfying']
      },
      {
        pageNumber: 4,
        text: 'By the time the school bus arrived, Sam had five whole minutes left to water his little fern on the porch. "Slow mornings are happy mornings," Sam hummed happily.',
        highlightWords: ['school bus', 'fern', 'happy']
      }
    ]
  },
  {
    id: 'cloud-that-rained',
    title: 'The Cloud That Needed to Rain',
    category: 'Emotions',
    readTimeMinutes: 4,
    ageRange: 'Ages 5 to 9',
    summary: 'Little Cloud tried to hold in all the heavy mist until it felt heavy inside. Learning that tears and feelings help clear the sky for sunshine.',
    coverAccent: 'teal',
    reflectionQuestion: 'What helps you feel lighter after you let out sad or frustrated tears?',
    pages: [
      {
        pageNumber: 1,
        text: 'Little Nimbus was a fluffy cloud that drifted over sunny meadows. He always wanted to be bright and white so everyone below would smile. But over the week, he soaked up grey damp mist from rainy winds.',
        highlightWords: ['fluffy', 'meadows', 'damp mist']
      },
      {
        pageNumber: 2,
        text: 'Nimbus held the mist tightly inside. His belly felt heavy, and his edges turned dark grey. He worried that if he let any drops fall, he would ruin the afternoon for the meadow rabbits.',
        highlightWords: ['tightly', 'heavy', 'worried']
      },
      {
        pageNumber: 3,
        text: 'Old Mountain Peak called up gently: "Little Nimbus, all clouds must rain. Letting go of heavy drops is how you help flowers grow, and how you feel light again."',
        highlightWords: ['rain', 'letting go', 'flowers']
      },
      {
        pageNumber: 4,
        text: 'Nimbus took a deep breath and released warm, soft rain onto the dry soil. Down below, daisies opened wide and the earth smelled clean. Nimbus looked at himself: he was light, fluffy, and glowing in warm sunlight.',
        highlightWords: ['warm rain', 'daisies', 'light']
      }
    ]
  },
  {
    id: 'leo-wonder-workshop',
    title: "Leo's Wonder Workshop",
    category: 'Bravery',
    readTimeMinutes: 5,
    ageRange: 'Ages 6 to 10',
    summary: 'When a tall tower of wooden blocks tumbles down, Leo discovers the power of the Reset Breath and engineering new solutions.',
    coverAccent: 'orange',
    reflectionQuestion: 'When a project falls or breaks, what is one thing you can do before trying again?',
    pages: [
      {
        pageNumber: 1,
        text: 'Leo spent all morning arranging smooth cedar blocks into an arched bridge. It had seven support towers, two ramps, and a miniature station for wooden trains. It was his masterpiece.',
        highlightWords: ['cedar blocks', 'arched bridge', 'masterpiece']
      },
      {
        pageNumber: 2,
        text: 'As he placed the final golden arch on top, his elbow nudged the table leg. CRASH! Blocks clattered and bounced across the rug. In one second, hours of careful work lay scattered in a messy pile.',
        highlightWords: ['clattered', 'bounced', 'scattered']
      },
      {
        pageNumber: 3,
        text: 'Leo felt a hot rush of heat rise into his cheeks. His hands clenched into tight fists. He wanted to kick the blocks away! But then he paused. He unclenched his fingers and blew out a long breath like blowing out a giant birthday candle.',
        highlightWords: ['paused', 'unclenched', 'long breath']
      },
      {
        pageNumber: 4,
        text: 'He looked at the fallen pieces with curious eyes: "The center base was a little wobbly. If I make the foundation wider, it will be twice as strong!" He smiled, picked up two blocks, and started building an even sturdier tower.',
        highlightWords: ['curious', 'foundation', 'stronger']
      }
    ]
  }
];

export const activities: Activity[] = [
  {
    id: 'breathing-box',
    title: 'Visual Calming Breath',
    type: 'breathing',
    durationMinutes: 3,
    description: 'An interactive rhythmic breathing pacer with inhale, hold, exhale, and rest circles to reset your nervous system.',
    accent: 'teal',
    tags: ['Calm', 'Focus', 'Nervous System']
  },
  {
    id: 'sensory-grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    type: 'grounding',
    durationMinutes: 4,
    description: 'Tap through your senses to connect with your real surroundings when feelings or sounds become overwhelming.',
    accent: 'sage',
    tags: ['Mindfulness', 'Sensory', 'Grounding']
  },
  {
    id: 'stretch-break',
    title: 'Movement & Body Stretch',
    type: 'movement',
    durationMinutes: 3,
    description: 'Gentle, animal-inspired physical stretches that release shoulder tension and ground your feet into the floor.',
    accent: 'orange',
    tags: ['Body', 'Energy', 'Gentle']
  },
  {
    id: 'gratitude-journal',
    title: 'Daily Gratitude & Thoughts',
    type: 'journaling',
    durationMinutes: 5,
    description: 'Reflect on comforting moments, soft textures, and friendly gestures with guided child-safe prompts.',
    accent: 'blue',
    tags: ['Reflect', 'Writing', 'Empathy']
  },
  {
    id: 'mindful-coloring',
    title: 'Mindful Drawing & Canvas',
    type: 'coloring',
    durationMinutes: 5,
    description: 'Color calming outlines using a soothing palette of teal, sage, sky blue, sand, and warm earth tones.',
    accent: 'teal',
    tags: ['Creative', 'Art', 'Focus']
  },
  {
    id: 'positive-affirmations',
    title: 'My Inner Strengths Shield',
    type: 'reflection',
    durationMinutes: 2,
    description: 'Choose empowering reminder cards that celebrate your unique thinking, patience, and kind heart.',
    accent: 'sage',
    tags: ['Confidence', 'Self-Esteem', 'Kindness']
  }
];

export const lessons: Lesson[] = [
  {
    id: 'understanding-emotions',
    title: 'Understanding Big Emotions',
    topic: 'Emotions',
    summary: 'Discover what happens in your body when big emotions show up and how to name feelings before they overflow.',
    accent: 'teal',
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Emotions are Like Weather',
        description: 'Feelings come and go just like weather patterns. Sunshine, rain showers, and thunder storms all have a purpose. No emotion is bad or forbidden.',
        actionTip: 'Notice what the weather in your chest feels like right now.'
      },
      {
        stepNumber: 2,
        title: 'Body Clues Tell Us First',
        description: 'Before you even realize you are angry or overwhelmed, your body gives clues: warm cheeks, tight fists, shallow breaths, or restless toes.',
        actionTip: 'Place one hand on your stomach and check if muscles feel tight or soft.'
      },
      {
        stepNumber: 3,
        title: 'Name It to Tame It',
        description: 'When you say inside your head "I feel overwhelmed" or "I feel sad", your wise brain helps your emotional alarm system cool down.',
        actionTip: 'Whispering the name of your feeling gives you back your calm control.'
      }
    ],
    quizQuestion: {
      question: 'What is a helpful thing to remember when you feel a big emotion like frustration?',
      options: [
        'Emotions are like weather, they visit and then pass with time',
        'You must hide your feelings so nobody notices',
        'Feelings are bad and should never happen'
      ],
      correctIndex: 0,
      explanation: 'Emotions are natural visitor states. Just like clouds passing across the sky, they come, share a message, and move on.'
    }
  },
  {
    id: 'asking-for-needs',
    title: 'How to Ask for What You Need',
    topic: 'Communication',
    summary: 'Learn clear, simple ways to ask for breaks, quiet spaces, or sensory adjustments when words feel hard.',
    accent: 'blue',
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Words Can Feel Heavy',
        description: 'When our brains are tired or overloaded by noise, talking out loud can feel like lifting heavy rocks. That is completely normal.',
        actionTip: 'You do not have to give long speeches to communicate your needs.'
      },
      {
        stepNumber: 2,
        title: 'The Three-Word Rescue',
        description: 'Practice short phrases: "I need break", "Too loud please", or "Need quiet time". Adults and friends appreciate simple, honest clarity.',
        actionTip: 'Even showing a card, a symbol, or a hand signal is a valid way to communicate.'
      },
      {
        stepNumber: 3,
        title: 'Finding Your Safe Adult',
        description: 'Pick one or two people at school or home who understand your signals. Let them know ahead of time what your break signal looks like.',
        actionTip: 'Clear agreements prevent misunderstandings before big feelings happen.'
      }
    ],
    quizQuestion: {
      question: 'What can you do if talking feels too difficult during an overwhelming moment?',
      options: [
        'Use a short phrase like "I need a break" or show a break signal',
        'Scream as loudly as possible so everyone leaves',
        'Force yourself to talk even if your throat hurts'
      ],
      correctIndex: 0,
      explanation: 'Short phrases or simple visual signals let people know you need space without requiring exhausting explanations.'
    }
  },
  {
    id: 'personal-space-friends',
    title: 'Friendship and Personal Bubbles',
    topic: 'Friendship',
    summary: 'Understand personal space boundaries, turn-taking, and how respecting space creates trust with peers.',
    accent: 'sage',
    estimatedMinutes: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Everyone Has an Invisible Bubble',
        description: 'Imagine an invisible arm-length bubble around yourself and everyone around you. Inside this bubble is each person’s comfort zone.',
        actionTip: 'Extend both arms out gently. That is roughly the size of your comfortable personal space.'
      },
      {
        stepNumber: 2,
        title: 'Checking Before Entering',
        description: 'Before hugging, touching toys, or leaning close, look at your friend’s face and ask: "Can I join?" or "May I share this space?"',
        actionTip: 'If your friend steps backward or looks away, that is a sign they need space.'
      },
      {
        stepNumber: 3,
        title: 'Parallel Play is Great Too',
        description: 'You do not always have to play the exact same game. Sitting near each other while drawing your own pictures is a wonderful way to be friends.',
        actionTip: 'Sharing peaceful presence side by side builds strong, gentle friendships.'
      }
    ],
    quizQuestion: {
      question: 'What is a polite way to check if a friend wants close contact like a hug?',
      options: [
        'Look at them and ask or offer a gentle wave first',
        'Hug them by surprise from behind',
        'Grab their arm without saying anything'
      ],
      correctIndex: 0,
      explanation: 'Asking first or offering a wave allows your friend to choose what feels comfortable for their personal bubble.'
    }
  },
  {
    id: 'unique-strengths',
    title: 'My Unique Brain and Strengths',
    topic: 'Self-Confidence',
    summary: 'Celebrate neurodiversity and discover how seeing details, pattern skills, and deep interests make our world richer.',
    accent: 'orange',
    estimatedMinutes: 3,
    steps: [
      {
        stepNumber: 1,
        title: 'Brains Work in Different Ways',
        description: 'Some brains think in vivid pictures. Some think in sounds or stories. Some notice small details that everyone else walks past.',
        actionTip: 'Diversity of thought is why humans invent telescopes, music, and art.'
      },
      {
        stepNumber: 2,
        title: 'Deep Interests are Superpowers',
        description: 'When you care deeply about dinosaurs, train systems, constellations, or drawing, you build incredible knowledge and focus.',
        actionTip: 'Your special interests make you interesting, capable, and uniquely you.'
      },
      {
        stepNumber: 3,
        title: 'Needing Adjustments is Natural',
        description: 'Needing headphones, sunglasses in bright stores, or quiet breaks is just like needing glasses to read. It helps you do your best work.',
        actionTip: 'Asking for what helps you thrive is a sign of wisdom, not weakness.'
      }
    ],
    quizQuestion: {
      question: 'Why is it good that people have different types of brains and ways of thinking?',
      options: [
        'Different minds bring unique talents, creativity, and solutions to the world',
        'Only one kind of thinking is ever correct',
        'It makes everyone do the exact same thing'
      ],
      correctIndex: 0,
      explanation: 'Every type of brain brings distinct strengths. When we value all styles of thinking, everyone can shine in their own way.'
    }
  },
  {
    id: 'stop-breathe-choose',
    title: 'The Stop-Breathe-Choose Method',
    topic: 'Problem-Solving',
    summary: 'A simple 3-step strategy for handling unexpected disruptions, changes in schedule, or confusing moments.',
    accent: 'teal',
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Stop (Press the Pause Button)',
        description: 'When plans suddenly change or a toy breaks, pretend your feet are frozen like ice statues for just five seconds.',
        actionTip: 'Do not speak or react yet. Just press pause.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Breathe (Blow the Bubble)',
        description: 'Take one slow, deep breath in through your nose and blow it softly out your mouth like blowing a delicate soap bubble.',
        actionTip: 'This oxygen helps your thinking brain take charge.'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Choose (Pick Your Next Step)',
        description: 'Now ask: "What is one small helpful thing I can do right now?" Ask for help, pick an alternative activity, or try again slowly.',
        actionTip: 'Having options turns feeling stuck into feeling empowered.'
      }
    ],
    quizQuestion: {
      question: 'What is the very first step when something unexpected or frustrating happens?',
      options: [
        'Stop and pause before reacting right away',
        'Throw something across the table',
        'Run away without telling anyone'
      ],
      correctIndex: 0,
      explanation: 'Pausing gives your nervous system a moment to settle down so your thinking brain can decide what to do next.'
    }
  },
  {
    id: 'daily-routines-transitions',
    title: 'Sensory-Friendly Daily Transitions',
    topic: 'Daily Skills',
    summary: 'Tips for shifting between playtime, homework, and bedtime without sensory overwhelm or sudden stress.',
    accent: 'sage',
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Give Yourself a 5-Minute Warning',
        description: 'Brain gears need time to shift from fun play to packing up. Using a visual sand timer or soft alarm makes transitions predictable.',
        actionTip: 'Say to yourself: "In five minutes, I will wrap up this drawing."'
      },
      {
        stepNumber: 2,
        title: 'Sensory Check Before Bed',
        description: 'Dim bright overhead lights 30 minutes before sleep. Check if pajamas feel soft, and ensure pillows are plumped just the way you like.',
        actionTip: 'A calm sensory environment signals to your body that it is safe to rest.'
      },
      {
        stepNumber: 3,
        title: 'Celebrate Small Steps',
        description: 'Every time you put on shoes without frustration or finish packing your bag, give yourself a mental pat on the back.',
        actionTip: 'Small daily victories add up to great independence.'
      }
    ],
    quizQuestion: {
      question: 'How can you make switching between activities feel easier?',
      options: [
        'Use a gentle timer or warning so your brain knows the shift is coming',
        'Switch instantly with no preparation at all',
        'Wait until someone gets frustrated'
      ],
      correctIndex: 0,
      explanation: 'Predictable timers and gentle reminders give your brain time to adjust smoothly between different tasks.'
    }
  }
];

export const games: Game[] = [
  {
    id: 'feelings-quiz',
    title: 'Feelings Detective',
    type: 'feelings-quiz',
    description: 'Read friendly everyday scenarios and figure out what emotion the character might be experiencing.',
    accent: 'teal',
    skillsTrained: ['Emotion Recognition', 'Empathy', 'Perspective Taking']
  },
  {
    id: 'memory-match',
    title: 'Calm Animal Memory Match',
    type: 'memory-match',
    description: 'Flip and match pairs of gentle woodland creatures to build visual working memory in a calm environment.',
    accent: 'sage',
    skillsTrained: ['Visual Focus', 'Working Memory', 'Patience']
  },
  {
    id: 'shape-sort',
    title: 'Color & Shape Focus Quest',
    type: 'shape-sort',
    description: 'Listen to the visual prompt and select the matching shape and soft color before time runs out.',
    accent: 'blue',
    skillsTrained: ['Visual Discrimination', 'Category Sorting', 'Coordination']
  },
  {
    id: 'pattern-match',
    title: 'Mindful Pattern Builder',
    type: 'pattern-match',
    description: 'Look at peaceful shape sequences and choose the correct piece that completes the rhythm.',
    accent: 'orange',
    skillsTrained: ['Pattern Reasoning', 'Logical Sequences', 'Attention']
  }
];

export const milestones: Milestone[] = [
  {
    id: 'first-breath',
    title: 'Calm Starter',
    description: 'Completed your first guided breathing exercise',
    iconName: 'Wind',
    unlockedAt: '2026-10-08'
  },
  {
    id: 'story-explorer',
    title: 'Story Explorer',
    description: 'Read and finished an entire therapeutic story',
    iconName: 'BookOpen',
    unlockedAt: '2026-10-09'
  },
  {
    id: 'emotion-detective',
    title: 'Emotion Detective',
    description: 'Recognized 5 feelings in the Feelings Detective game',
    iconName: 'Smile',
    unlockedAt: '2026-10-09'
  },
  {
    id: 'mindful-artist',
    title: 'Mindful Artist',
    description: 'Created a soothing artwork in Mindful Drawing',
    iconName: 'Palette'
  },
  {
    id: 'memory-master',
    title: 'Memory Champion',
    description: 'Matched all pairs in Animal Memory Match',
    iconName: 'Puzzle'
  },
  {
    id: 'gratitude-star',
    title: 'Gratitude Star',
    description: 'Saved your first thoughtful journal reflection',
    iconName: 'Award',
    unlockedAt: '2026-10-09'
  },
  {
    id: 'kindness-hero',
    title: 'Space & Kindness Hero',
    description: 'Completed the Friendship & Personal Space lesson',
    iconName: 'ShieldCheck'
  },
  {
    id: 'calm-champion',
    title: 'Daily Rhythm Master',
    description: 'Practiced 5 different calming activities',
    iconName: 'Sparkles'
  }
];

export const avatars = [
  { id: 'otter', name: 'Ollie the Otter', label: 'Playful & calm river friend' },
  { id: 'owl', name: 'Barnaby Owl', label: 'Wise & observant listener' },
  { id: 'fox', name: 'Finley Fox', label: 'Curious & clever explorer' },
  { id: 'turtle', name: 'Toby Turtle', label: 'Patient & grounded steady traveler' },
  { id: 'bear', name: 'Barnaby Bear', label: 'Warm, cozy & gentle protector' },
  { id: 'dolphin', name: 'Daisy Dolphin', label: 'Cheerful & rhythmic ocean swimmer' }
];

export const moodOptions = [
  { id: 'calm', label: 'Calm', icon: 'Wind', color: 'teal', message: 'Wonderful. You are in a relaxed, peaceful headspace.' },
  { id: 'happy', label: 'Happy', icon: 'Smile', color: 'orange', message: 'Great energy! Let us explore a fun story or memory game.' },
  { id: 'sensitive', label: 'Tired or Sensitive', icon: 'Eye', color: 'blue', message: 'Take it easy. A low-stimulation activity like breathing or coloring is perfect.' },
  { id: 'overwhelmed', label: 'Big Feelings', icon: 'Flame', color: 'orange', message: 'It is okay to pause. Try the 5-4-3-2-1 grounding exercise or close your eyes.' },
  { id: 'curious', label: 'Curious', icon: 'Compass', color: 'sage', message: 'Your brain is ready to learn! Check out one of our interactive lessons.' }
];
