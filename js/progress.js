/* Start locked. Play and random events peel the bland timer open. */
const Progress = {
  unlocked: new Set(),
  saveKey: "tt-unlocks",
  boot() {
    try {
      (JSON.parse(localStorage.getItem(this.saveKey) || "[]") || []).forEach((a) => this.unlocked.add(a));
    } catch (e) {}
    this.apply();
  },
  save() { localStorage.setItem(this.saveKey, JSON.stringify([...this.unlocked])); },
  has(a) { return this.unlocked.has(a); },
  count() { return this.unlocked.size; },
  locked() { return CHAOS_FEATURES.filter((f) => !this.unlocked.has(f.action)); },
  unlock(action, opts) {
    opts = opts || {};
    if (this.unlocked.has(action)) return false;
    const feat = CHAOS_FEATURES.find((f) => f.action === action);
    if (!feat) return false;
    this.unlocked.add(action);
    this.save();
    this.apply();
    if (window.buildMuseum) buildMuseum();
    if (window.Arcade && Arcade.refreshSelect) Arcade.refreshSelect();
    return feat;
  },
  unlockNext(n) {
    n = n || 1;
    const locked = this.locked();
    if (!locked.length) return [];
    const tiny = locked.filter((f) => TINY_ACTIONS.has(f.action));
    const rest = locked.filter((f) => !TINY_ACTIONS.has(f.action));
    const got = [];
    for (let i = 0; i < n; i++) {
      const preferTiny = Math.random() < 0.72 && tiny.length;
      const pool = preferTiny ? tiny : (rest.length ? rest : locked);
      if (!pool.length) break;
      const feat = pool.splice((Math.random() * pool.length) | 0, 1)[0];
      const unlocked = this.unlock(feat.action);
      if (unlocked) got.push(unlocked);
      const cut = (arr) => {
        const x = arr.findIndex((f) => f.action === feat.action);
        if (x >= 0) arr.splice(x, 1);
      };
      cut(tiny); cut(rest);
    }
    return got;
  },
  apply() {
    const n = this.count();
    document.body.classList.toggle("bland", n === 0);
    document.body.classList.remove("waking", "fire-theme");
    document.querySelectorAll("[data-unlock]").forEach((el) => {
      const need = el.dataset.unlock.split(/\s+/).filter(Boolean);
      el.classList.toggle("locked-ui", !need.every((a) => this.has(a)));
    });
    document.querySelectorAll("[data-unlock-cat]").forEach((el) => {
      const cat = el.dataset.unlockCat;
      const ok = CHAOS_FEATURES.some((f) => f.cat === cat && this.has(f.action));
      el.classList.toggle("locked-ui", !ok);
    });
    const sideBits = ["worldClockCarousel", "alarmSundial", "dateHorizon", "lapChronicle"];
    document.body.classList.toggle("has-side", sideBits.some((a) => this.has(a)));
    const h = document.querySelector("h1");
    if (h) h.textContent = "TinyTimer";
    const s = document.querySelector(".brand small");
    if (s) s.textContent = "";
    document.title = "TinyTimer";
    const hud = document.getElementById("unlockHud");
    if (hud) { hud.textContent = ""; hud.classList.add("locked-ui"); }
    this.renderTinyBar();
  },
  renderTinyBar() {
    const bar = document.getElementById("tinyBar");
    if (!bar) return;
    bar.innerHTML = "";
    CHAOS_FEATURES.forEach((f) => {
      if (!this.has(f.action) || RANDOM_ONLY.has(f.action) || CHROME_ACTIONS.has(f.action)) return;
      if (!TINY_ACTIONS.has(f.action) && f.cat !== "display" && f.cat !== "visual") return;
      const b = document.createElement("button");
      b.className = "tiny";
      b.textContent = TINY_LABELS[f.action] || f.name.split(" ")[0];
      b.title = f.name;
      b.onclick = () => launch(f.action);
      bar.appendChild(b);
    });
  }
};

window.RANDOM_ONLY = new Set(["virusStorm", "tungCall", "brainrotAmbush", "bossAlarmoth", "luckyEncounter"]);

const TINY_ACTIONS = new Set([
  "pauseResume","milliMicroscope","lapChronicle","keyboardNinja","memoryVault",
  "flipClock","analogAura","binaryBeacon","morseWhisper","romanEmpire","stickerNumerals",
  "haloRing","pixelRelic","wordClock","hexGate","scientificNotation","mirrorverse",
  "confettiCannon","novaBurst","earthquakeShake","glitchHex","crtHaunting","gravityFlip","dvdGhost",
  "metroHeart","keyJingles","victoryFanfare","loopPedal","ukuleleStrum",
  "fortuneCookie","magic8","dailyStreak","chaosDice","pomodoroTrinity","teaCeremony","eggLab",
  "stopwatchAscent","tabataInferno","twinTimerDuel"
]);

const CHROME_ACTIONS = new Set([
  "pauseResume","customTimeForge","pomodoroTrinity","teaCeremony","eggLab",
  "stopwatchAscent","tabataInferno","milliMicroscope","twinTimerDuel","lapChronicle","chaosDice"
]);

const TINY_LABELS = {
  flipClock: "Flip", analogAura: "Analog", binaryBeacon: "Binary", morseWhisper: "Morse",
  romanEmpire: "Roman", stickerNumerals: "Stickers", haloRing: "Ring", pixelRelic: "Pixel",
  wordClock: "Words", hexGate: "Hex", scientificNotation: "Sci", mirrorverse: "Mirror",
  confettiCannon: "Confetti", novaBurst: "Nova", earthquakeShake: "Shake", glitchHex: "Glitch",
  crtHaunting: "CRT", gravityFlip: "Gravity", dvdGhost: "DVD", metroHeart: "Metronome",
  keyJingles: "Bells", victoryFanfare: "Fanfare", loopPedal: "Loop", ukuleleStrum: "Uke",
  fortuneCookie: "Fortune", magic8: "8-ball", dailyStreak: "Streak", keyboardNinja: "Keys",
  memoryVault: "Vault", hourglassAges: "Glass", hypercube: "Cube", colossusFullscreen: "Wide",
  fireflyGarden: "Fireflies", starfieldWarp: "Stars", lavaLamp: "Lava", tidePool: "Waves",
  discoInferno: "Disco", matrixRain: "Matrix"
};

const Events = {
  started: false,
  last: 0,
  boot() {
    setInterval(() => this.pulse(), 1400);
  },
  onStart() {
    AudioBus.resume();
    Progress.unlockNext(1 + ((Math.random() < 0.6) ? 1 : 0));
    if (!this.started) {
      this.started = true;
      setTimeout(() => this.fire({ guaranteed: true, burst: true }), 700);
    }
  },
  onFinish() {
    this.fire({ guaranteed: true, burst: true });
    Shop.add(5);
  },
  drip() {
    Progress.unlockNext(1 + ((Math.random() < 0.45) ? 1 : 0));
  },
  pulse() {
    if (!Engine.running && Progress.count() === 0) return;
    if (!Engine.running && Math.random() > 0.28) return;
    if (Engine.running && Math.random() > 0.62) return;
    if (performance.now() - this.last < 1800 && Progress.count() > 0) return;
    this.fire();
  },
  fire(opts) {
    opts = opts || {};
    this.last = performance.now();
    let n = 1 + ((Math.random() < 0.8) ? 1 : 0) + ((Math.random() < 0.4) ? 1 : 0);
    if (opts.burst) n += 1 + ((Math.random() * 2) | 0);
    Progress.unlockNext(n);
    if (Math.random() < 0.55) this.spectacle();
  },
  banner(text) {
    const el = document.getElementById("eventBanner");
    if (!el) { toast(text); return; }
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(this._bt);
    this._bt = setTimeout(() => el.classList.remove("show"), 3200);
  },
  spectacle() {
    const n = Progress.count();
    if (n === 0) return;
    const pests = [];
    const extra = Shop.owned && Shop.owned["popup-pack"] ? 2 : 0;
    if (Progress.has("virusStorm")) pests.push(() => Virus.storm(2 + extra));
    if (Progress.has("tungCall")) pests.push(() => Tung.call());
    if (Progress.has("brainrotAmbush")) pests.push(() => Brainrot.ambush());
    if (Progress.has("bossAlarmoth")) pests.push(() => Boss.start());
    if (window.Intrusions) Intrusions.unlocked().forEach((fn) => pests.push(fn));
    const flavor = [];
    if (Progress.has("confettiCannon") || n >= 8) flavor.push(() => Visuals.confetti());
    if (Progress.has("novaBurst")) flavor.push(() => Visuals.nova());
    if (Progress.has("earthquakeShake") || n >= 3) flavor.push(() => Visuals.shake());
    if (Progress.has("discoInferno") && Math.random() < 0.2) flavor.push(() => Visuals.disco());
    const roll = Math.random();
    if (pests.length && roll < 0.62) pests[(Math.random() * pests.length) | 0]();
    else if (flavor.length && roll < 0.88) flavor[(Math.random() * flavor.length) | 0]();
  }
};

window.Progress = Progress;
window.Events = Events;
