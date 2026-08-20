/* Web Audio bus, original jingles, woodblock Sahur hits. */
const AudioBus = {
  ctx: null,
  master: null,
  g: { sfx: null, music: null, amb: null, voice: null },
  analyser: null,
  loopNotes: [],
  capturing: false,
  melody: [0, 4, 7, 12, 7, 4, 0, 7, 12, 16, 12, 7, 4, 7, 0, 4],
  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.master.connect(this.analyser);
    ["sfx", "music", "amb", "voice"].forEach((k) => {
      this.g[k] = this.ctx.createGain();
      this.g[k].connect(this.master);
    });
    this.g.sfx.gain.value = 0.8;
    this.g.music.gain.value = 0.7;
    this.g.amb.gain.value = 0.4;
    this.g.voice.gain.value = 0.9;
  },
  resume() { this.ensure(); if (this.ctx.state === "suspended") this.ctx.resume(); },
  setVol(kind, v) { this.ensure(); this.g[kind].gain.value = v; },
  now() { this.ensure(); return this.ctx.currentTime; },
  tone(freq, dur, type, dest, vol) {
    this.ensure();
    const t = this.now();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type || "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol == null ? 0.12 : vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.g[dest || "sfx"]);
    o.start(t); o.stop(t + dur);
    if (this.capturing) this.loopNotes.push({ freq, dur, type: o.type, at: performance.now() });
    return o;
  },
  noise(dur, dest, vol) {
    this.ensure();
    const n = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = n;
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = 1800;
    g.gain.value = vol == null ? 0.18 : vol;
    src.connect(f); f.connect(g); g.connect(this.g[dest || "sfx"]);
    src.start();
  },
  drum(kind) {
    if (kind === "kick") { this.tone(80, 0.25, "sine", "sfx", 0.4); this.tone(40, 0.2, "triangle", "sfx", 0.2); }
    else if (kind === "snare") { this.noise(0.12, "sfx", 0.3); this.tone(180, 0.1, "triangle", "sfx", 0.12); }
    else if (kind === "hat") this.noise(0.05, "sfx", 0.16);
    else if (kind === "clap") { this.noise(0.08, "sfx", 0.22); this.tone(420, 0.08, "square", "sfx", 0.08); }
    else if (kind === "tom") this.tone(140, 0.28, "sine", "sfx", 0.28);
    else if (kind === "crash") { this.noise(0.4, "sfx", 0.2); this.tone(800, 0.3, "sawtooth", "sfx", 0.05); }
    else if (kind === "wood") this.tone(220, 0.08, "square", "sfx", 0.2);
  },
  tungHit(strong) {
    this.tone(strong ? 140 : 190, 0.09, "square", "sfx", strong ? 0.28 : 0.16);
    this.noise(0.04, "sfx", 0.1);
  },
  fanfare() {
    const n = [523, 659, 784, 1046, 784, 1046];
    n.forEach((f, i) => setTimeout(() => this.tone(f, 0.22, "square", "music", 0.14), i * 140));
  },
  playSeq(notes, dest) {
    let t = 0;
    notes.forEach((n) => {
      const wait = t;
      t += (n.d || 0.25) * 1000;
      setTimeout(() => { if (n.f) this.tone(n.f, n.d || 0.2, n.type || "square", dest || "music", n.v || 0.12); }, wait);
    });
    return t;
  },
  note(name) {
    const map = { C:0, "C#":1, D:2, "D#":3, E:4, F:5, "F#":6, G:7, "G#":8, A:9, "A#":10, B:11 };
    const m = name.match(/^([A-G]#?)(\d)$/);
    if (!m) return 440;
    return 440 * Math.pow(2, (map[m[1]] + (Number(m[2]) - 4) * 12 - 9) / 12);
  }
};

window.AudioBus = AudioBus;
