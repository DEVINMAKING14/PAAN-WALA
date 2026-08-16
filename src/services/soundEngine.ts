// Web Audio API Synthesizer for Tactile Street & Paan Sounds

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy AudioContext initialization on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Tactile Paan Fold Sound:
   * Layer 1: Leaf rustle (filtered noise burst with soft envelope)
   * Layer 2: Kattha/Chuna moist brush (low bandpass swoosh)
   * Layer 3: Paper/Silver vark snap (high frequency transient click)
   * Layer 4: Counter tap (woody thud)
   */
  public playPaanFoldSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Leaf Rustle / Paper Fold Noise
    const bufferSize = ctx.sampleRate * 0.4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.35);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.4);

    // 2. Tactile Counter Wood Tap / Snap
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);

    // 3. Crisp Silver Foil Crackle (delayed by 90ms)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const foilNow = this.ctx.currentTime;
      const foilOsc = this.ctx.createOscillator();
      const foilGain = this.ctx.createGain();
      foilOsc.type = 'triangle';
      foilOsc.frequency.setValueAtTime(3200, foilNow);
      foilOsc.frequency.exponentialRampToValueAtTime(1800, foilNow + 0.08);

      foilGain.gain.setValueAtTime(0.12, foilNow);
      foilGain.gain.exponentialRampToValueAtTime(0.001, foilNow + 0.08);

      foilOsc.connect(foilGain);
      foilGain.connect(this.ctx.destination);
      foilOsc.start(foilNow);
      foilOsc.stop(foilNow + 0.09);
    }, 90);
  }

  /**
   * Glass Jar Clink (Supari / Saunf Jars)
   */
  public playJarTapSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    [2400, 3150, 4800].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.15 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  /**
   * Vintage Radio Tuning / Click Sound
   */
  public playRadioTuningSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Analog dial static burst
    const bufferSize = ctx.sampleRate * 0.25;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.22);
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.25);

    // Mechanical Relay Click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(750, now);
    clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.05);
  }

  /**
   * Matchbox Strike
   */
  public playMatchboxStrikeSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.18;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (0.5 + Math.random() * 0.5);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.18);
  }

  /**
   * Fire Paan Roar / Whoosh
   */
  public playFirePaanWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.7;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.65);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.7);
  }

  /**
   * Subtle Mechanical Click
   */
  public playSubtleClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Authentic Paan "Peech!" (Spit Tobacco / Pichkaari) Sound Effect
   * YouTube: https://youtu.be/3ivd7sObTk8?t=4
   * Pure wet liquid squelch & spit spray without mechanical click artifact
   */
  public playPaanSpitSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Wet Liquid Squelch / Splash Transient Noise ("Peechhh")
    const bufferSize = Math.floor(ctx.sampleRate * 0.25);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(800, now + 0.22);
    noiseFilter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.25);
  }
}

export const soundEngine = new SoundEngine();
