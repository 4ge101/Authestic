# Authsetic

**Authsetic** is an accessible, child-friendly platform that brings together emotional learning, therapeutic storytelling, calming activities, educational games, and progress tracking in one place.

The goal is to make developmental and emotional-wellbeing resources accessible to children and families who cannot afford multiple paid subscriptions.

---

## Key Features

1. **Daily Dashboard (Home)**:
   - Personalized time-of-day greeting and companion avatar.
   - Interactive daily mood check-in with tailored calm activity suggestions.
   - Quick access to all 4 learning hubs: Stories, Activities, Learning, and Games.
   - Featured story spotlight and guided lesson continuation.

2. **Therapeutic Story Library (Stories)**:
   - Category filtering: Emotions, Friendship, Bravery, Daily Life.
   - Search by title or topic.
   - Interactive multi-page distraction-free Story Reader with page indicators and progress bars.
   - Text size controls and gentle read-aloud simulation.
   - Gentle reflection questions and progress recording.
   - Story bookmarking persisting to local storage.

3. **Calming Activities (Activities)**:
   - **Visual Calming Breath**: Interactive rhythmic breathing circle with technique selector (Box Breath 4-4-4-4, Belly Breath 4-2-6, Bee Humming 3-1-5), cycle counter, and soft harmonic chime.
   - **5-4-3-2-1 Sensory Grounding**: Interactive step-by-step tool to guide children through sight, touch, sound, smell, and gratitude.
   - **Movement & Body Stretch**: Gentle child-friendly physical poses with 20-second timers and form cues.
   - **Daily Gratitude Journal**: Child-safe writing prompts, mood tags, and private local storage.
   - **Mindful Drawing Canvas**: Interactive HTML5 coloring canvas with outlines (Turtle, Sunflower, Owl), child-friendly palette (Teal, Sage, Sky Blue, Orange, Sand), brush sizing, eraser, and reset.
   - **Inner Strengths Shield**: Positive affirmation card deck to help children celebrate their superpowers.

4. **Emotional Learning Lessons (Learning)**:
   - Practical lessons on:
     - Understanding Big Emotions
     - How to Ask for What You Need
     - Friendship and Personal Bubbles
     - My Unique Brain and Strengths (celebrating neurodiversity)
     - The Stop-Breathe-Choose Method
     - Sensory-Friendly Daily Transitions
   - Interactive multi-step guide with action tips.
   - Comprehension check with friendly, supportive explanations.
   - Mastery tracking that updates the learner's journey.

5. **Playful Practice (Games)**:
   - **Feelings Detective**: Everyday scenario quiz identifying emotions through physical body clues.
   - **Calm Animal Memory Match**: 4x4 card flip memory game with woodland animals and pair tracking.
   - **Color & Shape Focus Quest**: Interactive visual sorting and discrimination challenge.
   - **Mindful Pattern Builder**: Visual sequence completion game training rhythm and logical reasoning.

6. **Exploration Journey & Progress (Progress)**:
   - Honest, non-clinical progress logging distinguishing activity completion from medical metrics.
   - Accessible weekly activity rhythm bar chart.
   - 8 achievable personal milestone badges.
   - Saved journal moments history.
   - Printable summary certificate for caregivers and educators.

7. **Child Profile & Favorites (Profile)**:
   - 6 friendly companion avatars (Otter, Owl, Fox, Turtle, Bear, Dolphin).
   - Display name, age range selector, and reading preferences.
   - Bookmarked stories and favorited activities quick access.

8. **Settings & Accessibility (Settings)**:
   - Interface text size scaling (Standard 16px, Large 18px, Extra Large 20px).
   - Relaxed dyslexic-friendly letter and word spacing mode.
   - Reduced motion toggle respecting sensory sensitivities.
   - High contrast mode.
   - Calming sound feedback toggle (powered by Web Audio API harmonic sine waves).
   - Platform language selection interface (English, Spanish, French).
   - Caregiver and parent gate (math challenge protected) with JSON export and session reset.

---

## Design System & Accessibility Principles

- **Color Palette**: Warm off-white backgrounds (`#f9f8f5`, `#ffffff`), dark navy text (`#142333`), with teal (`#0d8276`), sage green (`#417558`), sky blue (`#0284c7`), and muted orange (`#d97706`) accents. Zero purple or violet is used.
- **Visual Restraint**: Thin neutral borders, subtle shadows, and medium rounded corners (`10px`). No oversized hero typography, flashing animations, glassmorphism, or distracting floating decorations.
- **Copy Standards**: Zero em dashes in visible UI copy. Respectful, non-stigmatizing language designed for neurodiverse learners.
- **Privacy First**: All preferences, bookmarks, and completed milestones are saved locally on the device (`localStorage`). No child identities or tracking data are sent to external servers.

---

## Technology Stack

- **React 19**
- **TypeScript & TSX**
- **Vite 8**
- **React Router 7**
- **Lucide React** (icons)
- **Vanilla CSS** (`src/styles.css`)

---

## Project Structure

```text
frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Card.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Stories.tsx
│   │   ├── Activities.tsx
│   │   ├── Learning.tsx
│   │   ├── Games.tsx
│   │   ├── Progress.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   └── useAuthsetic.ts
│   │
│   ├── lib/
│   │   ├── types.ts
│   │   ├── storage.ts
│   │   └── audio.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── data.ts
│   └── styles.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Installation & Running Locally

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit the local server address displayed in the terminal (typically `http://localhost:5173`).

### 3. Build for Production

```bash
npm run build
```

This compiles TypeScript and outputs optimized production assets to `dist/`.

### 4. Preview Production Build

```bash
npm run preview
```
