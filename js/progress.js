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
    if (!opts.silent) {
      toast("UNLOCKED · " + feat.name);
      if (window.Dopamine) Dopamine.combo("UNLOCK", "#ffd23a");
      if (window.AudioBus) { AudioBus.resume(); AudioBus.tone(523, 0.12, "square", "sfx", 0.12); AudioBus.tone(784, 0.18, "square", "sfx", 0.1); }
    }
    if (window.buildMuseum) buildMuseum();
    if (window.Arcade && Arcade.refreshSelect) Arcade.refreshSelect();
    return feat;
  },
  unlockNext(n) {
    n = n || 1;
    const locked = this.locked();
    if (!locked.length) return [];
    const got = [];
    const front = locked.slice(0, 10);
    const pool = Math.random() < 0.25 ? locked : front;
    const copy = pool.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < n && i < copy.length; i++) {
      const feat = this.unlock(copy[i].action);
      if (feat) got.push(feat);
    }
    return got;
  },
  apply() {
    const n = this.count();
    document.body.classList.toggle("bland", n === 0);
    document.body.classList.toggle("waking", n > 0 && n < 6);
    document.body.classList.toggle("fire-theme", n >= 6);
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
    const s = document.querySelector(".brand small");
    if (h) h.textContent = n === 0 ? "TinyTimer" : "TinyTimer Chaos Edition";
    if (s) s.textContent = n === 0 ? "" : n + " / 100 unlocked";
    document.title = n === 0 ? "TinyTimer" : "TinyTimer Chaos Edition";
    const hud = document.getElementById("unlockHud");
    if (hud) {
      hud.textContent = n ? (n + " / 100") : "";
      hud.classList.toggle("locked-ui", n === 0);
    }
  }
};

const Events = {
  started: false,
  last: 0,
  boot() {
    setInterval(() => this.pulse(), 3500);
    setTimeout(() => {
      if (!this.started && Progress.count() === 0) {
        /* still bland until they press Start */
      }
    }, 1000);
  },
  onStart() {
    AudioBus.resume();
    if (!this.started) {
      this.started = true;
      setTimeout(() => this.fire({ guaranteed: true, bland: Progress.count() === 0 }), 2200);
    }
  },
  onFinish() {
    this.fire({ guaranteed: true, burst: true });
    Shop.add(5);
  },
  pulse() {
    if (!Engine.running && Progress.count() === 0) return;
    if (!Engine.running && Math.random() > 0.12) return;
    if (Engine.running && Math.random() > 0.28) return;
    if (performance.now() - this.last < 8000 && Progress.count() > 0) return;
    this.fire();
  },
  fire(opts) {
    opts = opts || {};
    this.last = performance.now();
    const n = opts.burst ? (1 + ((Math.random() * 3) | 0)) : 1;
    const got = Progress.unlockNext(n);
    const names = got.map((f) => f.name).join(" · ");
    if (got.length) {
      this.banner(Progress.count() < 4
        ? (names ? ("Something shifted. " + names + ".") : "The timer noticed you.")
        : ("Random event · unlocked " + names));
    } else {
      this.banner("Every wonder is already loose.");
    }
    this.spectacle();
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
    const pool = [];
    if (Progress.has("confettiCannon") || n >= 8) pool.push(() => Visuals.confetti());
    if (Progress.has("novaBurst")) pool.push(() => Visuals.nova());
    if (Progress.has("earthquakeShake") || n >= 3) pool.push(() => Visuals.shake());
    if (Progress.has("virusStorm") && n >= 6) pool.push(() => Virus.storm(2));
    if (Progress.has("tungCall") && n >= 10) pool.push(() => Tung.call());
    if (Progress.has("brainrotAmbush") && n >= 12) pool.push(() => Brainrot.ambush());
    if (Progress.has("fortuneCookie")) pool.push(() => Fortune.crack());
    if (Progress.has("discoInferno") && Math.random() < 0.2) pool.push(() => Visuals.disco());
    if (Progress.has("bossAlarmoth") && n >= 20 && Math.random() < 0.15) pool.push(() => Boss.start());
    if (!pool.length) return;
    if (Math.random() < (n < 6 ? 0.35 : 0.7)) pool[(Math.random() * pool.length) | 0]();
  }
};

window.Progress = Progress;
window.Events = Events;
