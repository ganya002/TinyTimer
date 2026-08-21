const TimeMath = {
  pad(n) {
    return String(Math.max(0, n | 0)).padStart(2, "0");
  },
  digits(value) {
    return String(value).replace(/\D/g, "").slice(0, 2);
  },
  clampMin(n) {
    n = parseInt(n, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.min(99, Math.max(0, n));
  },
  clampSec(n) {
    n = parseInt(n, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.min(59, Math.max(0, n));
  },
  fromParts(min, sec) {
    return this.clampMin(min) * 60 + this.clampSec(sec);
  },
  format(total) {
    total = Math.max(0, Math.floor(Number(total) || 0));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return {
      minutes: this.pad(m),
      seconds: this.pad(s),
      text: this.pad(m) + ":" + this.pad(s)
    };
  }
};

const TinyTimer = {
  duration: 300,
  remaining: 300,
  running: false,
  endsAt: 0,
  handle: 0,
  els: null,
  onDone: null,

  mount(els) {
    this.els = els;
    this.paint();
    els.minutes.addEventListener("focus", () => els.minutes.select());
    els.seconds.addEventListener("focus", () => els.seconds.select());
    els.minutes.addEventListener("input", () => {
      els.minutes.value = TimeMath.digits(els.minutes.value);
    });
    els.seconds.addEventListener("input", () => {
      els.seconds.value = TimeMath.digits(els.seconds.value);
    });
    els.minutes.addEventListener("change", () => this.commitFromInputs());
    els.seconds.addEventListener("change", () => this.commitFromInputs());
    els.minutes.addEventListener("blur", () => this.commitFromInputs());
    els.seconds.addEventListener("blur", () => this.commitFromInputs());
    els.minutes.addEventListener("keydown", (e) => this.onKey(e, "minutes"));
    els.seconds.addEventListener("keydown", (e) => this.onKey(e, "seconds"));
    els.start.addEventListener("click", () => this.toggle());
    els.reset.addEventListener("click", () => this.reset());
    if (els.preset) {
      els.preset.addEventListener("change", () => {
        const v = els.preset.value;
        if (v === "custom") {
          els.minutes.focus();
          els.minutes.select();
          return;
        }
        this.setSeconds(parseInt(v, 10));
      });
    }
  },

  onKey(e, field) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      if (field === "minutes") {
        this.setSeconds(this.readInputs() + delta * 60);
      } else {
        this.setSeconds(this.readInputs() + delta);
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      this.commitFromInputs();
      this.start();
    }
  },

  readInputs() {
    return TimeMath.fromParts(this.els.minutes.value, this.els.seconds.value);
  },

  commitFromInputs() {
    const typed = this.readInputs();
    if (this.running) {
      this.setSeconds(typed, { keepRunning: true });
      return;
    }
    if (typed !== this.remaining) this.setSeconds(typed);
  },

  setSeconds(total, opts) {
    total = Math.max(0, Math.min(99 * 60 + 59, total | 0));
    this.remaining = total;
    if (!this.running || (opts && opts.keepRunning)) this.duration = total;
    if (this.running && opts && opts.keepRunning) {
      this.endsAt = Date.now() + this.remaining * 1000;
    }
    if (this.els && this.els.preset) {
      const match = [...this.els.preset.options].find((o) => o.value === String(total));
      this.els.preset.value = match ? match.value : "custom";
    }
    this.paint();
    if (!this.running) this.setStatus("");
  },

  toggle() {
    if (this.running) this.pause();
    else this.start();
  },

  start() {
    const typed = this.readInputs();
    if (typed !== this.remaining && typed > 0) this.setSeconds(typed);
    if (this.remaining <= 0) this.remaining = this.duration;
    if (this.remaining <= 0) {
      this.setStatus("Set a time first.");
      return;
    }
    this.running = true;
    this.endsAt = Date.now() + this.remaining * 1000;
    this.els.start.textContent = "Pause";
    this.setStatus("Running");
    this.tick();
  },

  pause() {
    if (!this.running) return;
    this.syncRemaining();
    this.running = false;
    clearTimeout(this.handle);
    this.els.start.textContent = "Start";
    this.setStatus("Paused");
    this.paint();
  },

  reset() {
    this.running = false;
    clearTimeout(this.handle);
    this.remaining = this.duration;
    this.els.start.textContent = "Start";
    this.setStatus("");
    this.paint();
  },

  syncRemaining() {
    if (!this.running) return;
    this.remaining = Math.max(0, Math.ceil((this.endsAt - Date.now()) / 1000));
  },

  tick() {
    if (!this.running) return;
    this.syncRemaining();
    this.paint();
    if (this.remaining <= 0) {
      this.finish();
      return;
    }
    const ms = (this.endsAt - Date.now()) % 1000 || 1000;
    this.handle = setTimeout(() => this.tick(), Math.min(250, ms));
  },

  finish() {
    this.running = false;
    clearTimeout(this.handle);
    this.remaining = 0;
    this.els.start.textContent = "Start";
    this.paint();
    this.setStatus("Time's up");
    chime();
    if (typeof this.onDone === "function") this.onDone();
  },

  paint() {
    const f = TimeMath.format(this.remaining);
    if (document.activeElement !== this.els.minutes) this.els.minutes.value = f.minutes;
    if (document.activeElement !== this.els.seconds) this.els.seconds.value = f.seconds;
    this.els.minutes.setAttribute("aria-valuenow", String(parseInt(f.minutes, 10)));
    this.els.seconds.setAttribute("aria-valuenow", String(parseInt(f.seconds, 10)));
  },

  setStatus(text) {
    if (!this.els.status) return;
    this.els.status.textContent = text;
  }
};

function chime() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    const ctx = new AC();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02 + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32 + i * 0.11);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.11);
      osc.stop(now + 0.36 + i * 0.11);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch (_) { /* ignore autoplay limits */ }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TimeMath, TinyTimer };
}
