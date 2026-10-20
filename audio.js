// Web Audio Synthesizer for Procedural Sound FX and Dynamic Background Music
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicTimer = null;
    this.beatStep = 0;
    this.bpm = 135;
    this.currentTrack = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    return this.enabled;
  }

  // Jump Sound (crisp energetic upward synth chirp)
  playJump() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Jump Pad / Catapult Launch Sound (high-tech energetic spring bounce)
  playPadLaunch() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.22);

    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  // Pink mini pad bounce sound
  playPinkPad() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Gravity Portal Flip SFX
  playGravityFlip() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.08);
    osc.frequency.linearRampToValueAtTime(250, now + 0.2);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Jump Ring / Orb in midair trigger sound
  playOrbTrigger() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Death Crash Sound (harsh noise explosion + low sub rumble)
  playDeath() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Noise buffer
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.36);
  }

  // Victory Fanfare
  playVictory() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  // Coin / Shard Pickup SFX
  playCoin() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Energy Shield Break SFX (cyber deflection crunch)
  playShieldBreak() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Upgrade Purchased / Level Up SFX
  playUpgrade() {
    if (!this.enabled || !this.ctx) return;
    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    });
  }

  // Boss Laser Warning Alarm
  playBossWarning() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(440, now + 0.08);
    osc.frequency.setValueAtTime(880, now + 0.16);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Boss Laser Blast SFX
  playBossBlast() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  // Achievement Unlocked SFX
  playAchievement() {
    if (!this.enabled || !this.ctx) return;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  // Procedural dynamic beat synthesizer that matches the level vibe
  startMusic(levelTheme = 'neon') {
    if (!this.enabled) return;
    this.init();
    if (this.musicTimer) clearInterval(this.musicTimer);

    this.beatStep = 0;
    const stepInterval = (60 / this.bpm) / 4 * 1000; // 16th notes

    // Bassline notes according to atmosphere
    const bassScales = {
      neon: [110, 110, 130.81, 146.83, 110, 98, 110, 164.81],       // A minor synthwave
      void: [65.41, 65.41, 73.42, 65.41, 61.74, 55.0, 65.41, 82.41], // Deep haunting C minor void
      inferno: [146.83, 146.83, 174.61, 196, 146.83, 220, 261.63, 130.81], // D aggressive metal/dnb
      boss: [98.0, 98.0, 116.54, 98.0, 92.5, 98.0, 123.47, 87.31], // G dark industrial terror
      timeattack: [130.81, 164.81, 196.0, 246.94, 261.63, 196.0, 164.81, 130.81] // High tempo rush
    };
    const scale = bassScales[levelTheme] || bassScales.neon;

    this.musicTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Kick on beats 0, 4, 8, 12 (4-on-the-floor)
      if (this.beatStep % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(levelTheme === 'boss' ? 180 : 150, now);
        kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.11);
        kickGain.gain.setValueAtTime(0.55, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.16);
      }

      // 2. Snare / Clack on beats 4 and 12
      if (this.beatStep % 8 === 4) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareGain.gain.setValueAtTime(0.24, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        snareOsc.connect(snareGain);
        snareGain.connect(this.ctx.destination);
        snareOsc.start(now);
        snareOsc.stop(now + 0.13);
      }

      // 3. Hi-hat on offbeats
      if (this.beatStep % 2 === 1) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'highpass';
        hatOsc.frequency.setValueAtTime(6500, now);
        hatGain.gain.setValueAtTime(0.07, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        hatOsc.connect(hatGain);
        hatGain.connect(this.ctx.destination);
        hatOsc.start(now);
        hatOsc.stop(now + 0.05);
      }

      // 4. Synth Bass Arp
      const noteFreq = scale[Math.floor(this.beatStep / 2) % scale.length];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = levelTheme === 'void' ? 'sine' : 'sawtooth';
      bassOsc.frequency.setValueAtTime(noteFreq, now);

      bassGain.gain.setValueAtTime(levelTheme === 'boss' ? 0.18 : 0.13, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.12);

      this.beatStep = (this.beatStep + 1) % 32;
    }, stepInterval);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

window.soundManager = new SoundManager();
