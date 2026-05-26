type UiSound = "click" | "indicator" | "belt_chime" | "wiper";

export class LayeredEngineAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private idleOsc: OscillatorNode | null = null;
  private idleGain: GainNode | null = null;
  private loadOsc: OscillatorNode | null = null;
  private loadGain: GainNode | null = null;
  private turboNoise: AudioBufferSourceNode | null = null;
  private turboGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private running = false;
  private lastThrottle = 0;

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    this.noiseBuffer = this.createNoiseBuffer();
  }

  async resume(): Promise<void> {
    await this.init();
    if (this.ctx?.state === "suspended") {
      await this.ctx.resume();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    return buffer;
  }

  async playCrank(): Promise<void> {
    await this.resume();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  }

  async playStartBurst(): Promise<void> {
    await this.resume();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  }

  startEngineLoop(): void {
    if (this.running || !this.ctx) return;
    this.running = true;
    const ctx = this.ctx;

    this.idleOsc = ctx.createOscillator();
    this.idleGain = ctx.createGain();
    this.idleOsc.type = "sawtooth";
    this.idleOsc.frequency.value = 42;
    this.idleGain.gain.value = 0.15;
    this.idleOsc.connect(this.idleGain);
    this.idleGain.connect(this.master!);
    this.idleOsc.start();

    this.loadOsc = ctx.createOscillator();
    this.loadGain = ctx.createGain();
    this.loadOsc.type = "square";
    this.loadOsc.frequency.value = 88;
    this.loadGain.gain.value = 0.001;
    this.loadOsc.connect(this.loadGain);
    this.loadGain.connect(this.master!);
    this.loadOsc.start();

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    this.turboGain = ctx.createGain();
    this.turboGain.gain.value = 0.001;
    noise.connect(filter);
    filter.connect(this.turboGain);
    this.turboGain.connect(this.master!);
    noise.start();
    this.turboNoise = noise;
  }

  stopEngineLoop(): void {
    this.running = false;
    [this.idleOsc, this.loadOsc, this.turboNoise].forEach((node) => {
      try {
        node?.stop();
      } catch {
        /* already stopped */
      }
    });
    this.idleOsc = null;
    this.loadOsc = null;
    this.turboNoise = null;
  }

  updateEngine(rpm: number, throttle: number, redline: number, idleRpm: number): void {
    if (!this.running || !this.idleOsc || !this.loadGain || !this.loadOsc || !this.turboGain) {
      return;
    }

    const norm = (rpm - idleRpm) / (redline - idleRpm);
    const baseFreq = 38 + norm * 140;
    this.idleOsc.frequency.setTargetAtTime(baseFreq, this.ctx!.currentTime, 0.05);
    this.loadOsc.frequency.setTargetAtTime(baseFreq * 2.1, this.ctx!.currentTime, 0.05);

    const loadMix = Math.min(1, norm * 1.4 + throttle * 0.5);
    this.loadGain.gain.setTargetAtTime(0.02 + loadMix * 0.22, this.ctx!.currentTime, 0.04);
    this.turboGain.gain.setTargetAtTime(0.002 + norm * 0.08, this.ctx!.currentTime, 0.06);

    if (this.lastThrottle > 0.25 && throttle < 0.08 && norm > 0.15) {
      this.playOverrun(norm);
    }
    this.lastThrottle = throttle;
  }

  private playOverrun(intensity: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(60 + intensity * 80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08 + intensity * 0.1, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  playUiSound(kind: UiSound): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (kind === "click") {
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
    } else if (kind === "indicator") {
      osc.type = "sine";
      osc.frequency.value = 640;
      gain.gain.value = 0.12;
    } else if (kind === "belt_chime") {
      osc.type = "sine";
      osc.frequency.value = 520;
      gain.gain.value = 0.1;
    } else {
      osc.type = "triangle";
      osc.frequency.value = 220;
      gain.gain.value = 0.05;
    }

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  setMasterVolume(value: number): void {
    if (this.master) {
      this.master.gain.setTargetAtTime(value, this.ctx!.currentTime, 0.05);
    }
  }
}

export const engineAudio = new LayeredEngineAudio();
