// Gentle Web Audio API synthesizer for neurodiversity-friendly sound cues
// Audio is OFF by default. Only plays if soundEnabled is true.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playGentleChime(enabled: boolean, frequency = 440) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Warm, soft envelope without harsh clicks
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

export function playSoftSuccess(enabled: boolean) {
  if (!enabled) return;
  // Two gentle ascending notes: C5 (523Hz) then E5 (659Hz)
  playGentleChime(enabled, 523.25);
  setTimeout(() => {
    playGentleChime(enabled, 659.25);
  }, 120);
}

export function speakCardLabel(text: string, voiceGuidanceEnabled: boolean) {
  if (!voiceGuidanceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Calm, relaxed speech rate
    utterance.pitch = 1.05; // Warm, friendly pitch
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis failures
  }
}
