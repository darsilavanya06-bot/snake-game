class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private intervalIds: number[] = [];
  private isPlaying: boolean = false;
  private currentTrackIndex: number = 0;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.1; // Keep it quiet
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public play(trackIndex: number) {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    this.stop();
    this.currentTrackIndex = trackIndex;
    this.isPlaying = true;

    switch (trackIndex) {
      case 0:
        this.playTrack1();
        break;
      case 1:
        this.playTrack2();
        break;
      case 2:
        this.playTrack3();
        break;
      default:
        this.playTrack1();
    }
  }

  public stop() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.activeOscillators = [];
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds = [];
    this.isPlaying = false;
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(this.currentTrackIndex);
    }
    return this.isPlaying;
  }

  public setTrack(index: number) {
    if (this.isPlaying) {
      this.play(index);
    } else {
      this.currentTrackIndex = index;
    }
  }

  // Track 1: SYS.INIT // NEURAL_PULSE (Low drone with rhythmic blips)
  private playTrack1() {
    if (!this.ctx || !this.masterGain) return;

    // Drone
    const drone = this.ctx.createOscillator();
    drone.type = 'sawtooth';
    drone.frequency.value = 55; // Low A
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    drone.connect(filter);
    filter.connect(this.masterGain);
    drone.start();
    this.activeOscillators.push(drone);

    // Blips
    const blipInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const blip = this.ctx.createOscillator();
      blip.type = 'square';
      blip.frequency.value = Math.random() > 0.5 ? 440 : 880;
      
      const blipGain = this.ctx.createGain();
      blipGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      blipGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      
      blip.connect(blipGain);
      blipGain.connect(this.masterGain);
      blip.start();
      blip.stop(this.ctx.currentTime + 0.1);
    }, 500);
    this.intervalIds.push(blipInterval);
  }

  // Track 2: DATA_CORRUPTION_LULLABY (Dissonant arpeggio)
  private playTrack2() {
    if (!this.ctx || !this.masterGain) return;
    
    const notes = [220, 233.08, 261.63, 311.13, 349.23]; // Minor/dissonant scale
    let noteIndex = 0;

    const arpInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = notes[noteIndex];
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);

      noteIndex = (noteIndex + 1) % notes.length;
      if (Math.random() > 0.8) noteIndex = Math.floor(Math.random() * notes.length); // Glitch the sequence
    }, 150);
    this.intervalIds.push(arpInterval);
  }

  // Track 3: VOID_STATIC_SEQUENCE (Noise bursts and high pitched whines)
  private playTrack3() {
    if (!this.ctx || !this.masterGain) return;

    // High whine
    const whine = this.ctx.createOscillator();
    whine.type = 'sine';
    whine.frequency.value = 2000;
    
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(whine.frequency);
    
    const whineGain = this.ctx.createGain();
    whineGain.gain.value = 0.05;

    whine.connect(whineGain);
    whineGain.connect(this.masterGain);
    whine.start();
    lfo.start();
    this.activeOscillators.push(whine, lfo);

    // Noise bursts (simulated with rapid random oscillators)
    const noiseInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      if (Math.random() > 0.3) return; // Only burst sometimes

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 100 + Math.random() * 1000;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }, 100);
    this.intervalIds.push(noiseInterval);
  }
}

export const audioService = new AudioService();
