/* Chronos Studio: piano, drums, songs, sequencer, theremin, uke, lofi, metronome. */
const Studio = {
  wave: "square",
  metro: null,
  lofi: null,
  amb: null,
  thereminOsc: null,
  songTimer: [],
  loopTimer: null,
  boot() {
    this.buildPiano();
    this.buildDrums();
    this.buildSeq();
    this.buildMelody();
    document.getElementById("volSfx").oninput = (e) => AudioBus.setVol("sfx", e.target.value/100);
    document.getElementById("volMusic").oninput = (e) => AudioBus.setVol("music", e.target.value/100);
    document.getElementById("volAmb").oninput = (e) => AudioBus.setVol("amb", e.target.value/100);
    document.getElementById("volVoice").oninput = (e) => AudioBus.setVol("voice", e.target.value/100);
    const th = document.getElementById("theremin");
    th.onmousemove = (e) => {
      if (!this.thereminOsc) return;
      const r = th.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      this.thereminOsc.frequency.value = 110 + x * 880;
      this.thereminOsc._g.gain.value = (1 - y) * 0.15;
    };
  },
  open() { document.getElementById("studio").scrollIntoView({ behavior: "smooth" }); toast("Chronos Studio"); },
  buildPiano() {
    const notes = ["C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5"];
    const el = document.getElementById("piano"); el.innerHTML = "";
    notes.forEach((n) => {
      const k = document.createElement("div");
      k.className = "pkey" + (n.includes("#") ? " black" : "");
      k.onmousedown = () => { AudioBus.resume(); AudioBus.tone(AudioBus.note(n), 0.35, this.wave, "music", 0.12); Badge.earn("piano"); };
      el.appendChild(k);
    });
  },
  buildDrums() {
    const el = document.getElementById("drums"); el.innerHTML = "";
    ["kick","snare","hat","clap","tom","crash"].forEach((d) => {
      const b = document.createElement("button"); b.innerHTML = iconHTML("drum") + " " + d;
      b.onclick = () => { AudioBus.resume(); AudioBus.drum(d); };
      el.appendChild(b);
    });
  },
  buildSeq() {
    const el = document.getElementById("seqGrid"); el.innerHTML = "";
    this.seq = Array.from({ length: 8 }, () => Array(16).fill(false));
    const notes = [523, 494, 440, 392, 349, 330, 294, 262];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 16; c++) {
      const i = document.createElement("i");
      i.onclick = () => { this.seq[r][c] = !this.seq[r][c]; i.classList.toggle("on", this.seq[r][c]); };
      el.appendChild(i);
    }
    this._seqNotes = notes;
    if (this.seqClock) clearInterval(this.seqClock);
    let step = 0;
    this.seqClock = setInterval(() => {
      if (!this.seqOn) { step = (step + 1) % 16; return; }
      this.seq.forEach((row, r) => { if (row[step]) AudioBus.tone(this._seqNotes[r], 0.12, this.wave, "music", 0.08); });
      step = (step + 1) % 16;
    }, 150);
  },
  toggleSeq() { this.seqOn = !this.seqOn; toast(this.seqOn ? "Sequencer looping" : "Sequencer paused"); },
  buildMelody() {
    const el = document.getElementById("melodyGrid"); el.innerHTML = "";
    AudioBus.melody.forEach((n, i) => {
      const cell = document.createElement("i");
      if (n) cell.classList.add("on");
      cell.onclick = () => {
        AudioBus.melody[i] = AudioBus.melody[i] ? 0 : [0,4,7,12,16,19,24][i % 7];
        cell.classList.toggle("on", !!AudioBus.melody[i]);
      };
      el.appendChild(cell);
    });
  },
  playMelody() {
    AudioBus.resume();
    AudioBus.melody.forEach((st, i) => {
      if (!st && st !== 0) return;
      setTimeout(() => AudioBus.tone(262 * Math.pow(2, (AudioBus.melody[i] || 0) / 12), 0.18, "square", "music", 0.12), i * 160);
    });
    toast("Alarm melody preview");
  },
  toggleMetronome() {
    AudioBus.resume();
    if (this.metro) { clearInterval(this.metro); this.metro = null; toast("Metronome off"); return; }
    const beat = () => AudioBus.drum(document.getElementById("bpm").value % 2 ? "hat" : "wood");
    const ms = 60000 / Number(document.getElementById("bpm").value || 120);
    this.metro = setInterval(beat, ms); beat();
    toast("Heartbeat on");
  },
  soundscape(kind) {
    AudioBus.resume();
    if (this.amb) { this.amb(); this.amb = null; }
    document.body.classList.remove("waves","forest","lava");
    const id = setInterval(() => {
      if (kind === "rain") AudioBus.noise(0.08, "amb", 0.05);
      if (kind === "cafe") { AudioBus.tone(180+Math.random()*80, 0.05, "triangle", "amb", 0.03); AudioBus.noise(0.04,"amb",0.02); }
      if (kind === "forest") AudioBus.tone(800+Math.random()*400, 0.15, "sine", "amb", 0.03);
      if (kind === "waves") { AudioBus.noise(0.3,"amb",0.04); AudioBus.tone(90,0.4,"sine","amb",0.03); }
    }, kind === "waves" ? 600 : 120);
    if (kind === "waves") document.body.classList.add("waves");
    if (kind === "forest") document.body.classList.add("forest");
    this.amb = () => clearInterval(id);
    toast("Soundscape: " + kind);
  },
  toggleLofi() {
    AudioBus.resume();
    if (this.lofi) { clearInterval(this.lofi); this.lofi = null; toast("Lo-fi parked"); return; }
    let step = 0;
    const chords = [[262,330,392],[220,262,330],[196,247,294],[233,294,349]];
    this.lofi = setInterval(() => {
      AudioBus.noise(0.04, "music", 0.03);
      if (step % 4 === 0) chords[(step/4)%4].forEach((f) => AudioBus.tone(f, 1.4, "triangle", "music", 0.04));
      if (step % 2 === 0) AudioBus.drum("kick");
      if (step % 4 === 2) AudioBus.drum("snare");
      AudioBus.drum("hat");
      step++;
    }, 280);
    toast("Lo-fi clouds");
  },
  fanfare() { AudioBus.resume(); AudioBus.fanfare(); toast("Victory fanfare"); Badge.earn("fanfare"); },
  song(id) {
    AudioBus.resume();
    this.stop();
    const songs = {
      tick: {
        title: "Tick Tock Forever",
        lyrics: ["Tick tock forever in my bones", "A pocket sun that never goes home", "Count the fire, count the spark", "Tiny timer, eat the dark"],
        notes: ["C4","C4","G4","G4","A4","A4","G4","E4","E4","D4","D4","C4","G4","A4","G4","C5"]
      },
      five: {
        title: "Five More Minutes",
        lyrics: ["Just five more minutes under this cheap moon", "Snooze is a love song, hummed out of tune", "Leave the morning on read", "Let the pillow keep my head"],
        notes: ["A3","C4","E4","A3","G3","A3","C4","E4","D4","C4","A3","G3","A3","C4","E4","A4"]
      },
      pomo: {
        title: "Pomodoro Power",
        lyrics: ["Chop the hour into tomatoes", "Twenty-five then we explode", "Break like thunder, back to code", "Pomodoro power, overload"],
        notes: ["E4","G4","B4","E5","D5","B4","G4","E4","F4","A4","C5","A4","G4","B4","E5","E4"]
      }
    };
    const s = songs[id];
    document.getElementById("lyric").innerHTML = `<b>${s.title}</b><div class="dim" id="lyline">${s.lyrics[0]}</div>`;
    s.notes.forEach((n, i) => {
      this.songTimer.push(setTimeout(() => {
        AudioBus.tone(AudioBus.note(n), 0.28, "square", "music", 0.13);
        document.getElementById("lyline").textContent = s.lyrics[Math.min(s.lyrics.length-1, (i/4)|0)];
        this.drawViz();
      }, i * 280));
    });
    toast("Karaoke: " + s.title);
    Badge.earn("karaoke");
  },
  stop() { this.songTimer.forEach(clearTimeout); this.songTimer = []; if (this.lofi) { clearInterval(this.lofi); this.lofi = null; } },
  toggleTheremin() {
    AudioBus.resume();
    const th = document.getElementById("theremin");
    if (this.thereminOsc) { this.thereminOsc.stop(); this.thereminOsc = null; th.classList.add("hidden"); toast("Theremin holstered"); return; }
    th.classList.remove("hidden");
    const o = AudioBus.ctx.createOscillator(); const g = AudioBus.ctx.createGain();
    o.type = "sine"; g.gain.value = 0.001; o.connect(g); g.connect(AudioBus.g.music); o.start();
    o._g = g; this.thereminOsc = o; toast("Haunt the mouse");
  },
  uke(ch) {
    AudioBus.resume();
    const map = { C:[262,330,392], G:[196,247,294], Am:[220,262,330], F:[175,220,262] };
    (map[ch] || map.C).forEach((f, i) => setTimeout(() => AudioBus.tone(f, 0.5, "triangle", "music", 0.1), i * 40));
    toast("Uke " + ch);
  },
  toggleLoop() {
    AudioBus.resume();
    if (this.loopTimer) { clearInterval(this.loopTimer); this.loopTimer = null; AudioBus.capturing = false; toast("Loop stopped"); return; }
    if (!AudioBus.capturing) { AudioBus.capturing = true; AudioBus.loopNotes = []; toast("Loop pedal: play notes, click again to loop"); return; }
    AudioBus.capturing = false;
    const clip = AudioBus.loopNotes.slice();
    if (!clip.length) { toast("empty loop"); return; }
    const span = clip[clip.length-1].at - clip[0].at + 400;
    const play = () => clip.forEach((n) => setTimeout(() => AudioBus.tone(n.freq, n.dur, n.type, "music", 0.1), n.at - clip[0].at));
    play(); this.loopTimer = setInterval(play, span);
    toast("Looping");
  },
  chiptune(type) { this.wave = type || ["square","triangle","sawtooth","sine"][Math.floor(Math.random()*4)]; toast("Lead: " + this.wave); },
  jingles(on) { this.jinglesOn = on !== false ? !this.jinglesOn : true; toast("Key jingles " + (this.jinglesOn ? "armed" : "off")); },
  drawViz() {
    const c = document.getElementById("viz").getContext("2d");
    const data = new Uint8Array(32);
    if (AudioBus.analyser) AudioBus.analyser.getByteTimeDomainData(data);
    c.fillStyle = "#140806"; c.fillRect(0,0,640,64);
    c.fillStyle = "#ff4b1f";
    for (let i=0;i<32;i++) { const v = data[i] || 128; c.fillRect(i*20, 64-(v/4), 16, v/4); }
  }
};
window.Studio = Studio;
