export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private tension: { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  muted = false;

  private ensure() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
  }

  async resume() {
    this.ensure();
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.22;
    if (muted) this.stopTension();
  }

  tick(intensity = 0.5) {
    if (this.muted) return;
    this.ensure();
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 780 + intensity * 420;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09 + intensity * 0.05, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  startTension() {
    if (this.muted) return;
    this.ensure();
    this.stopTension();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 5.4);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 5.4);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.4);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    osc.start();
    this.tension = { osc, gain, filter };
  }

  stopTension() {
    if (!this.tension || !this.ctx) return;
    const { osc, gain } = this.tension;
    const t = this.ctx.currentTime;
    try {
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.stop(t + 0.14);
    } catch {
      /* already stopped */
    }
    this.tension = null;
  }

  win() {
    if (this.muted) return;
    this.ensure();
    const ctx = this.ctx!;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      osc.connect(g);
      g.connect(this.master!);
      osc.start(t);
      osc.stop(t + 0.44);
    });
  }

  lose() {
    if (this.muted) return;
    this.ensure();
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  click() {
    if (this.muted) return;
    this.ensure();
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 440;
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.09);
  }
}

export const sound = new SoundEngine();
