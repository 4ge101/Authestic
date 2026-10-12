// Web Audio sound synthesizer for calm child-friendly sound feedback
// Generates soft harmonic frequencies without external audio files

class CalmSoundSystem {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft bell chime for completing tasks or mindful breathing
  playChime(enabled: boolean = true, frequency: number = 528): void {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth attack and soft decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.95);
    } catch {
      // Audio autoplay policy or unavailable
    }
  }

  // Gentle pop for interactive button taps and card flips
  playTap(enabled: boolean = true): void {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  // Uplifting chord for milestone or quiz success
  playSuccess(enabled: boolean = true): void {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25]; // A Major gentle triad
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.06 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  // Soft ambient nature sound generator
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  public currentAmbientType: string | null = null;

  startAmbient(type: 'stream' | 'rain' | 'wind' | 'waves' = 'stream'): void {
    try {
      this.stopAmbient();
      const ctx = this.getContext();
      if (!ctx) return;

      // Generate pink/brown soothing noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Lowpass brown/pink noise filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter based on nature soundscape
      const filter = ctx.createBiquadFilter();
      if (type === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 1.2;
      } else if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 900;
      } else if (type === 'wind') {
        filter.type = 'lowpass';
        filter.frequency.value = 400;
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 0.8;
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2); // soft gentle volume

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      this.ambientSource = noise;
      this.ambientGain = gain;
      this.currentAmbientType = type;
    } catch {
      // Audio autoplay policy
    }
  }

  stopAmbient(): void {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (this.ambientSource) {
          try {
            (this.ambientSource as AudioBufferSourceNode).stop();
          } catch {
            // Already stopped
          }
          this.ambientSource = null;
        }
        this.ambientGain = null;
        this.currentAmbientType = null;
      }, 550);
    } catch {
      // Ignore
    }
  }

  isPlayingAmbient(): boolean {
    return this.ambientSource !== null;
  }

  // Animal voice synthesizers (soft, friendly, musical harmonic cues)
  playAnimalSound(animal: 'monkey' | 'bird' | 'cat' | 'dog', enabled: boolean = true): void {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (animal === 'monkey') {
        // Playful rising monkey chatter: 3 bouncy melodic chirps
        const pitches = [392, 523.25, 659.25];
        pitches.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + i * 0.09 + 0.07);

          gain.gain.setValueAtTime(0.001, now + i * 0.09);
          gain.gain.linearRampToValueAtTime(0.09, now + i * 0.09 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.09);
        });
      } else if (animal === 'bird') {
        // Sweet melodious double chirp
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1760, now);
        osc1.frequency.exponentialRampToValueAtTime(2349.32, now + 0.08);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.11);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1975.53, now + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(2637.02, now + 0.2);
        gain2.gain.setValueAtTime(0.08, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.23);
      } else if (animal === 'cat') {
        // Gentle soft meow / purr glide
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.35);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (animal === 'dog') {
        // Friendly double woof tones
        [0, 0.14].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now + delay);
          osc.frequency.exponentialRampToValueAtTime(180, now + delay + 0.1);

          gain.gain.setValueAtTime(0.001, now + delay);
          gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.11);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.12);
        });
      }
    } catch {
      // Audio policy
    }
  }
}

export const calmSound = new CalmSoundSystem();
