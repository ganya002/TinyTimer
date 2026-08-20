/* Timer engine: countdown, stopwatch, tabata, twin, alarm, horizon, laps, displays. */
const Engine = {
  time: 300,
  duration: 300,
  interval: null,
  running: false,
  stopwatch: false,
  millis: false,
  tabata: false,
  tabataRound: 0,
  tabataWork: true,
  twinOn: false,
  timeB: 180,
  intB: null,
  laps: [],
  alarm: null,
  horizon: null,
  display: "plain",
  morseTimer: null,
  tickMs: 1000,
  lastVault: 300,

  boot() {
    const saved = Number(localStorage.getItem("tt-last") || 300);
    this.lastVault = saved;
    this.time = saved; this.duration = saved;
    const m = Math.floor(saved / 60), s = saved % 60;
    const mi = document.getElementById("minIn"), si = document.getElementById("secIn");
    if (mi) mi.value = m; if (si) si.value = s;
    this.render();
    this.world();
    setInterval(() => { this.world(); this.checkAlarm(); this.checkHorizon(); }, 1000);
    Badge.earn("vault");
  },
  fmt(t, ms) {
    t = Math.max(0, t);
    if (this.display === "roman") return this.roman(Math.floor(t / 60)) + ":" + this.roman(Math.floor(t % 60) || 0);
    if (this.display === "hex") return "0x" + Math.floor(t).toString(16).toUpperCase().padStart(4, "0");
    if (this.display === "sci") return (t).toExponential(2) + " s";
    if (this.display === "word") {
      const m = Math.floor(t / 60), s = Math.floor(t % 60);
      return this.words(m) + " MINUTES " + this.words(s) + " SECONDS";
    }
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    let out = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    if (ms || this.millis) out += "." + String(Math.floor((t % 1) * 100)).padStart(2, "0");
    return out;
  },
  roman(n) {
    if (n === 0) return "N";
    const pairs = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let s = "";
    for (const [v, sy] of pairs) while (n >= v) { s += sy; n -= v; }
    return s;
  },
  words(n) {
    const ones = ["ZERO","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"];
    const tens = ["","","TWENTY","THIRTY","FORTY","FIFTY"];
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
  },
  render() {
    const el = document.getElementById("timer");
    const label = this.fmt(this.time);
    el.textContent = label;
    el.classList.toggle("pixel", this.display === "pixel");
    document.getElementById("timerB").textContent = this.fmt(this.timeB);
    const mm = String(Math.floor(Math.max(0, this.time) / 60)).padStart(2, "0");
    const ss = String(Math.floor(Math.max(0, this.time) % 60)).padStart(2, "0");
    ["flipM1","flipM2","flipS1","flipS2"].forEach((id, i) => {
      const n = (mm + ss)[i];
      const node = document.getElementById(id);
      if (node) node.textContent = n;
    });
    document.getElementById("cube1").textContent = label;
    document.getElementById("cube2").textContent = label;
    document.getElementById("cube3").textContent = label;
    document.getElementById("cube4").textContent = label;
    const frac = this.duration ? Math.max(0, Math.min(1, this.time / this.duration)) : 0;
    document.getElementById("haloArc").style.strokeDashoffset = String(326.7 * (1 - frac));
    document.getElementById("sandTop").style.transform = `translateY(${(1 - frac) * 40}px)`;
    document.getElementById("sandBot").style.height = `${(1 - frac) * 100}%`;
    this.drawBinary();
    this.drawStickers(mm + ss);
    this.drawAnalog();
    if (this.display === "word" || this.display === "sci" || this.display === "hex" || this.display === "roman") {
      el.style.fontSize = this.display === "word" ? "1.6rem" : "3.2rem";
    } else el.style.fontSize = "";
    document.body.classList.toggle("mirror", this.display === "mirror");
    document.body.classList.toggle("pixel", this.display === "pixel");
    document.body.classList.toggle("colossus", this.display === "colossus");
  },
  drawBinary() {
    const box = document.getElementById("binaryBox");
    const v = Math.floor(this.time);
    const bits = (n, w) => n.toString(2).padStart(w, "0").split("").map((b) => `<span class="bit ${b === "1" ? "on" : ""}"></span>`).join("");
    box.innerHTML = `<div>M ${bits(Math.floor(v / 60), 8)}</div><div>S ${bits(v % 60, 8)}</div>`;
  },
  drawStickers(digits) {
    const box = document.getElementById("stickerTime");
    box.innerHTML = digits.split("").map((d, i) => i === 2 ? `<span class="sticker-digit">:</span><span class="sticker-digit">${d}</span>` : `<span class="sticker-digit">${d}</span>`).join("");
    if (digits.length === 4) {
      box.innerHTML = `<span class="sticker-digit">${digits[0]}</span><span class="sticker-digit">${digits[1]}</span><span class="sticker-digit">:</span><span class="sticker-digit">${digits[2]}</span><span class="sticker-digit">${digits[3]}</span>`;
    }
  },
  drawAnalog() {
    const el = document.getElementById("analogFace");
    const t = this.time;
    const m = (t / 60) % 60, s = t % 60;
    const ma = (m / 60) * 360, sa = (s / 60) * 360;
    el.innerHTML = `<svg viewBox="0 0 100 100" class="ico" style="width:160px;height:160px">
      <circle cx="50" cy="50" r="46" fill="#fff4e8" stroke="#1c0b08" stroke-width="4"/>
      <line x1="50" y1="50" x2="${50 + 28 * Math.sin(ma * Math.PI/180)}" y2="${50 - 28 * Math.cos(ma * Math.PI/180)}" stroke="#ff4b1f" stroke-width="4"/>
      <line x1="50" y1="50" x2="${50 + 36 * Math.sin(sa * Math.PI/180)}" y2="${50 - 36 * Math.cos(sa * Math.PI/180)}" stroke="#1c0b08" stroke-width="2"/>
      <circle cx="50" cy="50" r="3" fill="#1c0b08"/>
    </svg>`;
  },
  setDisplay(mode) {
    this.display = mode;
    const map = {
      flip: "flipRow", analog: "analogFace", binary: "binaryBox", hourglass: "hourglass",
      cube: "cubeScene", sticker: "stickerTime", halo: "halo", morse: "morseLamp"
    };
    Object.values(map).forEach((id) => document.getElementById(id).classList.add("hidden"));
    const timer = document.getElementById("timer");
    timer.classList.toggle("hidden", ["flip","analog","binary","hourglass","cube","sticker"].includes(mode));
    if (map[mode]) document.getElementById(map[mode]).classList.remove("hidden");
    if (mode === "halo") document.getElementById("halo").classList.remove("hidden");
    if (mode === "morse") this.startMorse(); else this.stopMorse();
    this.render();
    toast("Display: " + mode);
  },
  startMorse() {
    this.stopMorse();
    const lamp = document.getElementById("morseLamp");
    lamp.classList.remove("hidden");
    const code = { "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----." };
    const seq = String(Math.floor(this.time)).split("").map((d) => code[d] || "").join(" ");
    let i = 0;
    this.morseTimer = setInterval(() => {
      const ch = seq[i % seq.length];
      lamp.classList.toggle("on", ch === "." || ch === "-");
      i++;
    }, 180);
  },
  stopMorse() { clearInterval(this.morseTimer); },
  start() {
    AudioBus.resume();
    if (this.running) return;
    this.running = true;
    document.getElementById("btnStart").textContent = "Running";
    const step = this.millis ? 50 : 1000;
    const delta = this.millis ? 0.05 : 1;
    this.interval = setInterval(() => {
      if (this.stopwatch) this.time += delta;
      else this.time -= delta;
      if (this.tabata) this.tabataTick();
      this.render();
      if (!this.stopwatch && this.time <= 0) this.finish();
    }, step);
    toast("Clock is live");
    Badge.earn("start");
  },
  pause() {
    if (!this.running) { this.start(); document.getElementById("subread").textContent = "resumed"; return; }
    this.running = false;
    clearInterval(this.interval);
    document.getElementById("btnStart").textContent = "Start";
    document.getElementById("subread").textContent = "paused";
    toast("Frozen mid-tick");
  },
  reset() {
    clearInterval(this.interval); this.running = false;
    this.time = this.stopwatch ? 0 : this.duration;
    document.getElementById("btnStart").textContent = "Start";
    this.render();
  },
  forge() {
    const m = Number(document.getElementById("minIn").value) || 0;
    const s = Number(document.getElementById("secIn").value) || 0;
    this.duration = Math.max(1, m * 60 + s);
    this.time = this.duration;
    this.lastVault = this.duration;
    localStorage.setItem("tt-last", String(this.duration));
    this.stopwatch = false;
    this.render();
    toast("Forged " + this.fmt(this.duration));
    Shop.add(1);
  },
  preset(sec, name) {
    this.duration = sec; this.time = sec; this.stopwatch = false;
    localStorage.setItem("tt-last", String(sec));
    document.getElementById("minIn").value = Math.floor(sec / 60);
    document.getElementById("secIn").value = sec % 60;
    this.render();
    document.getElementById("subread").textContent = name;
    toast(name);
  },
  toggleStopwatch() {
    this.stopwatch = !this.stopwatch;
    this.time = this.stopwatch ? 0 : this.duration;
    this.render();
    toast(this.stopwatch ? "Counting up" : "Counting down");
  },
  toggleMillis() { this.millis = !this.millis; toast(this.millis ? "Microscope on" : "Microscope off"); this.render(); },
  toggleTwin() {
    this.twinOn = !this.twinOn;
    document.getElementById("twin").classList.toggle("hidden", !this.twinOn);
    toast(this.twinOn ? "Duel armed" : "Duel sheathed");
  },
  startB() {
    clearInterval(this.intB);
    this.intB = setInterval(() => { this.timeB--; document.getElementById("timerB").textContent = this.fmt(this.timeB); if (this.timeB <= 0) clearInterval(this.intB); }, 1000);
  },
  resetB() { this.timeB = 180; document.getElementById("timerB").textContent = this.fmt(this.timeB); clearInterval(this.intB); },
  toggleTabata() {
    this.tabata = !this.tabata;
    document.getElementById("tabataHud").classList.toggle("hidden", !this.tabata);
    if (this.tabata) { this.tabataRound = 1; this.tabataWork = true; this.duration = 20; this.time = 20; this.start(); }
    this.tabataHud();
  },
  tabataTick() {
    if (this.time > 0) return this.tabataHud();
    this.tabataWork = !this.tabataWork;
    if (this.tabataWork) this.tabataRound++;
    if (this.tabataRound > 8) { this.tabata = false; this.finish(); return; }
    this.time = this.tabataWork ? 20 : 10;
    this.duration = this.time;
    AudioBus.drum("crash");
    this.tabataHud();
  },
  tabataHud() {
    document.getElementById("tabataHud").textContent = this.tabata ? `Round ${this.tabataRound}/8 · ${this.tabataWork ? "WORK" : "REST"}` : "";
  },
  lap() {
    this.laps.unshift(this.fmt(this.time));
    document.getElementById("laps").innerHTML = this.laps.map((l, i) => `#${this.laps.length - i} ${l}`).join("<br>");
    toast("Lap stamped");
  },
  world() {
    const cities = [
      ["Tokyo", "Asia/Tokyo"], ["New York", "America/New_York"], ["London", "Europe/London"],
      ["Cairo", "Africa/Cairo"], ["Sao Paulo", "America/Sao_Paulo"], ["Sydney", "Australia/Sydney"],
      ["Reykjavik", "Atlantic/Reykjavik"], ["Mumbai", "Asia/Kolkata"]
    ];
    const el = document.getElementById("worldClocks");
    el.innerHTML = cities.map(([n, z]) => {
      const t = new Date().toLocaleTimeString("en-GB", { timeZone: z, hour: "2-digit", minute: "2-digit" });
      return `<span>${n}</span><b>${t}</b>`;
    }).join("");
  },
  setAlarm() {
    this.alarm = document.getElementById("alarmTime").value;
    document.getElementById("alarmHud").textContent = this.alarm ? "armed " + this.alarm : "unarmed";
    toast("Sundial armed");
  },
  checkAlarm() {
    if (!this.alarm) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    if (hh === this.alarm && now.getSeconds() === 0) {
      Studio.playMelody();
      Chronos.speak("Alarm. Rise, mortal.");
      Virus.storm(3);
      this.alarm = null;
    }
  },
  setHorizon() {
    this.horizon = document.getElementById("dateIn").value;
    this.checkHorizon();
  },
  checkHorizon() {
    if (!this.horizon) return;
    const diff = new Date(this.horizon + "T00:00:00") - new Date();
    const days = Math.max(0, Math.floor(diff / 86400000));
    document.getElementById("horizonHud").textContent = days + " days to horizon";
  },
  finish() {
    this.running = false; clearInterval(this.interval);
    this.time = 0; this.render();
    document.getElementById("btnStart").textContent = "Start";
    Visuals.confetti(); Visuals.nova(); Visuals.shake();
    AudioBus.fanfare();
    Shop.add(5);
    Badge.earn("finish");
    Chronos.speak("Time is up.");
    if (Math.random() < 0.6) Boss.start();
    else if (Math.random() < 0.5) Tung.call();
    else Virus.storm(4);
    Dopamine.combo("+CLEAR", "#ffd23a");
  }
};
window.Engine = Engine;
