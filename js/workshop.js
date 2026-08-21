const ITEMS = {
  wood: { name: "Wood", color: "#b56a32" },
  cobble: { name: "Cobble", color: "#8b8e99" },
  iron: { name: "Iron", color: "#d5dbe6" },
  gold: { name: "Gold", color: "#e7c56b" },
  slime: { name: "Slime", color: "#7ee0c3" },
  star: { name: "Star", color: "#fff1a8" },
  obsidian: { name: "Obsidian", color: "#3b2758" },
  stick: { name: "Stick", color: "#8a5a32" },
  table: { name: "Crafting Table", color: "#a36b3c" },
  pick: { name: "Pickaxe", color: "#c8cde8" },
  portal: { name: "Portal", color: "#9b7dff" },
  crystal: { name: "World Crystal", color: "#7eb6ff" },
  banner: { name: "Team Banner", color: "#ff8fab" }
};

const RECIPES = [
  { id: "sticks", name: "Sticks", need: { wood: 1 }, give: { stick: 4 } },
  { id: "table", name: "Crafting Table", need: { wood: 4 }, give: { table: 1 }, flag: "table" },
  { id: "wpick", name: "Wood Pickaxe", need: { wood: 3, stick: 2 }, give: { pick: 1 }, pick: 1 },
  { id: "spick", name: "Stone Pickaxe", need: { cobble: 3, stick: 2 }, give: { pick: 1 }, pick: 2 },
  { id: "ipick", name: "Iron Pickaxe", need: { iron: 3, stick: 2 }, give: { pick: 1 }, pick: 3 },
  { id: "portal", name: "Nether Portal", need: { obsidian: 8, star: 1 }, give: { portal: 1 }, flag: "portal" },
  { id: "crystal", name: "World Crystal", need: { slime: 3, gold: 1, star: 1 }, give: { crystal: 1 }, flag: "world" },
  { id: "minute", name: "+1 Minute", need: { gold: 2, slime: 1 }, effect: "minute" },
  { id: "banner", name: "Team Banner", need: { wood: 3, star: 1 }, give: { banner: 1 }, effect: "banner" }
];

const SITE_THEMES = [
  { id: "tinytimer", name: "TinyTimer", url: "original", bg: "#1a1a2e", panel: "#16213e", ink: "#ffffff", muted: "#c8cde8", accent: "#7eb6ff", btn: "#e8e8e8", btnInk: "#1a1a2e" },
  { id: "github", name: "GitHub", url: "https://github.com", bg: "#0d1117", panel: "#161b22", ink: "#e6edf3", muted: "#8b949e", accent: "#2f81f7", btn: "#21262d", btnInk: "#e6edf3" },
  { id: "wikipedia", name: "Wikipedia", url: "https://wikipedia.org", bg: "#f8f9fa", panel: "#ffffff", ink: "#202122", muted: "#54595d", accent: "#3366cc", btn: "#eaecf0", btnInk: "#202122" },
  { id: "youtube", name: "YouTube", url: "https://youtube.com", bg: "#0f0f0f", panel: "#212121", ink: "#ffffff", muted: "#aaaaaa", accent: "#ff0000", btn: "#ffffff", btnInk: "#0f0f0f" },
  { id: "reddit", name: "Reddit", url: "https://reddit.com", bg: "#0b1416", panel: "#1a282d", ink: "#f2f2f2", muted: "#8ba2ad", accent: "#ff4500", btn: "#d93900", btnInk: "#ffffff" },
  { id: "notion", name: "Notion", url: "https://notion.so", bg: "#ffffff", panel: "#f7f6f3", ink: "#37352f", muted: "#787774", accent: "#2383e2", btn: "#37352f", btnInk: "#ffffff" },
  { id: "spotify", name: "Spotify", url: "https://spotify.com", bg: "#121212", panel: "#181818", ink: "#ffffff", muted: "#b3b3b3", accent: "#1db954", btn: "#1db954", btnInk: "#121212" },
  { id: "twitch", name: "Twitch", url: "https://twitch.tv", bg: "#0e0e10", panel: "#18181b", ink: "#efeff1", muted: "#adadb8", accent: "#bf94ff", btn: "#9146ff", btnInk: "#ffffff" },
  { id: "discord", name: "Discord", url: "https://discord.com", bg: "#313338", panel: "#2b2d31", ink: "#f2f3f5", muted: "#b5bac1", accent: "#5865f2", btn: "#5865f2", btnInk: "#ffffff" },
  { id: "mdn", name: "MDN", url: "https://developer.mozilla.org", bg: "#1a1a1a", panel: "#2b2a33", ink: "#ffffff", muted: "#cdcdcd", accent: "#8cb4ff", btn: "#8cb4ff", btnInk: "#1a1a1a" },
  { id: "stackoverflow", name: "Stack Overflow", url: "https://stackoverflow.com", bg: "#1c1c1c", panel: "#2d2d2d", ink: "#f2f2f2", muted: "#c0c0c0", accent: "#f48024", btn: "#f48024", btnInk: "#1c1c1c" },
  { id: "forest", name: "Forest", url: "portal", bg: "#102418", panel: "#183322", ink: "#e7ffe9", muted: "#9dcea8", accent: "#6fbf73", btn: "#e8e8e8", btnInk: "#102418" },
  { id: "corruption", name: "Corruption", url: "portal", bg: "#1b1030", panel: "#2a1848", ink: "#f3e9ff", muted: "#b9a4d8", accent: "#c084fc", btn: "#e8e8e8", btnInk: "#1b1030" },
  { id: "crimson", name: "Crimson", url: "portal", bg: "#2a1014", panel: "#3d1820", ink: "#ffe8ea", muted: "#d99aa3", accent: "#ef4444", btn: "#e8e8e8", btnInk: "#2a1014" },
  { id: "hallow", name: "Hallow", url: "portal", bg: "#1a1430", panel: "#2a2250", ink: "#fff7ff", muted: "#d7c4ea", accent: "#f9a8d4", btn: "#e8e8e8", btnInk: "#1a1430" },
  { id: "ice", name: "Ice", url: "portal", bg: "#0f1c2e", panel: "#17324a", ink: "#e8f6ff", muted: "#9ec5d8", accent: "#7dd3fc", btn: "#e8e8e8", btnInk: "#0f1c2e" }
];

const LUCKY_DROPS = [
  ["wood", 30], ["cobble", 24], ["iron", 14], ["gold", 10], ["slime", 10], ["star", 6], ["obsidian", 6]
];

function recipeMatch(have, recipe) {
  return Object.keys(recipe.need).every((k) => (have[k] || 0) >= recipe.need[k]);
}

function countsFromGrid(grid) {
  const have = {};
  grid.forEach((id) => { if (id) have[id] = (have[id] || 0) + 1; });
  return have;
}

function pickDrop(rand) {
  const r = (rand || Math.random)();
  let n = r * LUCKY_DROPS.reduce((s, d) => s + d[1], 0);
  for (const [id, w] of LUCKY_DROPS) {
    n -= w;
    if (n <= 0) return id;
  }
  return "wood";
}

const Workshop = {
  inventory: {},
  flags: { table: false, portal: false, world: false, pick: 0 },
  teams: [],
  activeTeam: null,
  theme: "tinytimer",
  grid: Array(9).fill(null),
  selected: null,
  lucky: [],
  spawnTimer: 0,
  els: null,
  panel: "craft",

  boot(els) {
    this.els = els;
    this.load();
    this.applyTheme(this.theme, { silent: true });
    if (this.activeTeam) this.applyTeam(this.activeTeam, { silent: true });
    this.bind();
    this.render();
    this.spawnLucky();
    this.spawnLucky();
    this.spawnAt = Date.now() + 12000;
    this.loop();
    TinyTimer.onDone = () => this.spawnLucky(true);
  },

  bind() {
    this.els.dock.querySelectorAll("[data-panel]").forEach((btn) => {
      btn.addEventListener("click", () => this.open(btn.dataset.panel));
    });
    this.els.sheetClose.addEventListener("click", () => this.close());
    this.els.luckyLayer.addEventListener("pointerdown", (e) => {
      const block = e.target.closest(".lucky");
      if (!block) return;
      e.preventDefault();
      this.hitLucky(block);
    });
    addEventListener("resize", () => this.clampLucky());
  },

  open(panel) {
    this.panel = panel;
    this.els.sheet.classList.remove("hidden");
    document.body.classList.add("overlay-open");
    if (window.MiniGames) MiniGames.suspend();
    this.els.dock.querySelectorAll("[data-panel]").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.panel === panel ? "true" : "false");
    });
    this.render();
  },

  close() {
    this.els.sheet.classList.add("hidden");
    document.body.classList.remove("overlay-open");
    if (window.MiniGames) MiniGames.resume();
    this.els.dock.querySelectorAll("[data-panel]").forEach((b) => b.setAttribute("aria-pressed", "false"));
  },

  add(id, n) {
    this.inventory[id] = (this.inventory[id] || 0) + (n || 1);
    this.save();
    this.renderChips();
  },

  has(id, n) { return (this.inventory[id] || 0) >= (n || 1); },

  take(id, n) {
    n = n || 1;
    if (!this.has(id, n)) return false;
    this.inventory[id] -= n;
    if (this.inventory[id] <= 0) delete this.inventory[id];
    this.save();
    return true;
  },

  hitsNeeded() { return Math.max(1, 4 - (this.flags.pick || 0)); },

  spawnLucky(force) {
    if (!force && this.lucky.length >= 4) return;
    const spot = this.freeSpot();
    if (!spot) return;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "lucky";
    el.style.left = spot.x + "px";
    el.style.top = spot.y + "px";
    el.dataset.hits = "0";
    el.setAttribute("aria-label", "Lucky block");
    el.innerHTML = '<span class="lucky-q">?</span><span class="lucky-crack"></span>';
    this.els.luckyLayer.appendChild(el);
    this.lucky.push(el);
    this.ping("Lucky block");
  },

  viewSize() {
    const vv = window.visualViewport;
    return {
      w: (vv && vv.width) || innerWidth,
      h: (vv && vv.height) || innerHeight
    };
  },

  freeSpot() {
    const pad = 72;
    const { w, h } = this.viewSize();
    for (let i = 0; i < 28; i++) {
      const x = 8 + Math.random() * Math.max(8, w - pad - 16);
      const y = 8 + Math.random() * Math.max(8, h - pad - 100);
      const cx = x + 32, cy = y + 32;
      const under = document.elementFromPoint(Math.min(w - 2, cx), Math.min(h - 2, cy));
      if (under && under.closest(".hero, .side, .dock, .sheet, .lucky, .terra-wrap, .pack-chips")) continue;
      return { x, y };
    }
    return { x: 12, y: 12 };
  },

  clampLucky() {
    const { w, h } = this.viewSize();
    this.lucky.forEach((el) => {
      const x = Math.min(w - 72, Math.max(8, parseFloat(el.style.left) || 8));
      const y = Math.min(h - 140, Math.max(8, parseFloat(el.style.top) || 8));
      el.style.left = x + "px";
      el.style.top = y + "px";
    });
  },

  hitLucky(el) {
    const need = this.hitsNeeded();
    const hits = (parseInt(el.dataset.hits, 10) || 0) + 1;
    el.dataset.hits = String(hits);
    el.classList.remove("swing");
    void el.offsetWidth;
    el.classList.add("swing");
    this.tickSound(180 + hits * 40);
    if (hits < need) return;
    const drop = pickDrop();
    this.add(drop, 1);
    this.ping("Broke a lucky block · " + ITEMS[drop].name);
    el.classList.add("break");
    setTimeout(() => {
      el.remove();
      this.lucky = this.lucky.filter((n) => n !== el);
    }, 180);
    if (Math.random() < 0.45) setTimeout(() => this.spawnLucky(), 700);
  },

  craft(recipe) {
    if (recipe.id !== "sticks" && recipe.id !== "table" && !this.flags.table) {
      this.ping("Craft a Crafting Table first (4 Wood).");
      return false;
    }
    if (!recipeMatch(this.inventory, recipe)) {
      this.ping("Need more materials.");
      return false;
    }
    Object.entries(recipe.need).forEach(([id, n]) => this.take(id, n));
    if (recipe.give) Object.entries(recipe.give).forEach(([id, n]) => this.add(id, n));
    if (recipe.flag) this.flags[recipe.flag] = true;
    if (recipe.pick && recipe.pick > this.flags.pick) this.flags.pick = recipe.pick;
    if (recipe.effect === "minute" && window.TinyTimer) {
      const next = TinyTimer.running ? TinyTimer.remaining + 60 : TinyTimer.duration + 60;
      TinyTimer.setSeconds(Math.min(99 * 60 + 59, next), { keepRunning: TinyTimer.running });
      this.ping("Timer gained a minute.");
    } else if (recipe.effect === "banner") {
      this.ping("Banner ready. Open Teams to use it.");
    } else {
      this.ping("Crafted " + recipe.name);
    }
    this.save();
    this.render();
    return true;
  },

  applyTheme(id, opts) {
    const theme = SITE_THEMES.find((t) => t.id === id) || SITE_THEMES[0];
    this.theme = theme.id;
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--panel", theme.panel);
    root.style.setProperty("--ink", theme.ink);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--btn", theme.btn);
    root.style.setProperty("--btn-ink", theme.btnInk);
    root.dataset.theme = theme.id;
    this.save();
    if (!opts || !opts.silent) this.ping("Portal → " + theme.name);
  },

  importRandomSite() {
    const sites = SITE_THEMES.filter((t) => t.url.startsWith("http"));
    const theme = sites[(Math.random() * sites.length) | 0];
    this.applyTheme(theme.id);
    return theme;
  },

  applyTeam(team, opts) {
    this.activeTeam = team;
    const root = document.documentElement;
    if (team.bg) root.style.setProperty("--bg", team.bg);
    if (team.panel) root.style.setProperty("--panel", team.panel);
    if (team.ink) root.style.setProperty("--ink", team.ink);
    if (team.accent) root.style.setProperty("--accent", team.accent);
    this.save();
    if (!opts || !opts.silent) this.ping("Team " + team.name);
  },

  saveTeam(team) {
    const i = this.teams.findIndex((t) => t.id === team.id);
    if (i >= 0) this.teams[i] = team;
    else this.teams.push(team);
    this.save();
  },

  loop() {
    if (Date.now() >= this.spawnAt) {
      this.spawnLucky();
      this.spawnAt = Date.now() + 9000 + Math.random() * 7000;
    }
    requestAnimationFrame(() => this.loop());
  },

  ping(text) {
    if (!this.els || !this.els.toast) return;
    this.els.toast.textContent = text;
    this.els.toast.classList.add("show");
    clearTimeout(this._toast);
    this._toast = setTimeout(() => this.els.toast.classList.remove("show"), 1600);
  },

  tickSound(freq) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      if (!this._ac) this._ac = new AC();
      const ctx = this._ac;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.value = 0.04;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) { /* ignore */ }
  },

  renderChips() {
    if (!this.els || !this.els.chips) return;
    const keys = Object.keys(this.inventory).filter((k) => this.inventory[k] > 0);
    this.els.chips.innerHTML = keys.length
      ? keys.map((k) => `<span class="chip"><i style="background:${ITEMS[k].color}"></i>${ITEMS[k].name} ${this.inventory[k]}</span>`).join("")
      : `<span class="chip dim">Break lucky blocks for loot</span>`;
  },

  render() {
    this.renderChips();
    const body = this.els && this.els.sheetBody;
    if (!body) return;
    if (this.panel === "craft") body.innerHTML = this.viewCraft();
    if (this.panel === "portal") body.innerHTML = this.viewPortal();
    if (this.panel === "teams") body.innerHTML = this.viewTeams();
    if (this.panel === "world") body.innerHTML = this.viewWorld();
    body.querySelectorAll("[data-craft]").forEach((b) => {
      b.addEventListener("click", () => this.craft(RECIPES.find((r) => r.id === b.dataset.craft)));
    });
    body.querySelectorAll("[data-theme]").forEach((b) => {
      b.addEventListener("click", () => this.applyTheme(b.dataset.theme));
    });
    body.querySelectorAll("[data-random-site]").forEach((b) => {
      b.addEventListener("click", () => this.importRandomSite());
    });
    const form = body.querySelector("#teamForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const team = {
          id: form.dataset.id || "t" + Date.now(),
          name: (form.elements.teamName.value || "").trim() || "Team",
          members: (form.elements.members.value || "").trim(),
          accent: form.elements.accent.value,
          bg: form.elements.bg.value,
          panel: form.elements.panel.value,
          ink: form.elements.ink.value
        };
        this.saveTeam(team);
        this.applyTeam(team);
        this.render();
      });
    }
    body.querySelectorAll("[data-use-team]").forEach((b) => {
      b.addEventListener("click", () => {
        const team = this.teams.find((t) => t.id === b.dataset.useTeam);
        if (team) this.applyTeam(team);
      });
    });
    body.querySelectorAll("[data-del-team]").forEach((b) => {
      b.addEventListener("click", () => {
        this.teams = this.teams.filter((t) => t.id !== b.dataset.delTeam);
        this.save();
        this.render();
      });
    });
    body.querySelectorAll("[data-import-site]").forEach((b) => {
      b.addEventListener("click", () => {
        const theme = SITE_THEMES.find((t) => t.id === b.dataset.importSite);
        if (!theme) return;
        this.saveTeam({
          id: "t" + Date.now(),
          name: theme.name,
          members: theme.url,
          accent: theme.accent,
          bg: theme.bg,
          panel: theme.panel,
          ink: theme.ink
        });
        this.applyTheme(theme.id);
        this.render();
      });
    });
    const play = body.querySelector("[data-play-world]");
    if (play) play.addEventListener("click", () => this.playWorld());
  },

  viewCraft() {
    const recipes = RECIPES.map((r) => {
      const ok = recipeMatch(this.inventory, r) && (r.id === "sticks" || r.id === "table" || this.flags.table);
      const need = Object.entries(r.need).map(([k, n]) => `${ITEMS[k].name} ${n}`).join(", ");
      return `<button type="button" class="recipe ${ok ? "ok" : ""}" data-craft="${r.id}">
        <b>${r.name}</b><span>${need}</span></button>`;
    }).join("");
    return `<h3>Crafting</h3>
      <p class="hint">Break lucky blocks with the pickaxe cursor, then craft. A table unlocks the full bench.</p>
      <p class="hint">Pickaxe tier ${this.flags.pick} · hits per block ${this.hitsNeeded()}</p>
      <div class="recipes">${recipes}</div>`;
  },

  viewPortal() {
    if (!this.flags.portal) {
      return `<h3>Portal</h3><p class="hint">Craft a Nether Portal (8 Obsidian + 1 Star) to transform the site.</p>`;
    }
    const dest = SITE_THEMES.map((t) =>
      `<button type="button" class="theme-card" data-theme="${t.id}" style="--swatch:${t.bg};--acc:${t.accent}">${t.name}</button>`
    ).join("");
    return `<h3>Portal</h3>
      <p class="hint">Step through to restyle TinyTimer. Import a look from a real site, or roll a random one.</p>
      <div class="row-actions">
        <button type="button" data-random-site>Import random site</button>
        <button type="button" data-play-world>Enter world</button>
      </div>
      <div class="theme-grid">${dest}</div>`;
  },

  viewWorld() {
    const ready = this.flags.world || this.flags.pick > 0 || this.flags.portal;
    return `<h3>Terraria world</h3>
      <p class="hint">A small side-on world: dig, fight slimes, gather ore. WASD or arrows, space to jump, click to mine. On a phone use the pad.</p>
      ${ready
        ? `<button type="button" data-play-world>Play world</button>`
        : `<p class="hint">Craft a Wood Pickaxe or World Crystal to open it.</p>`}`;
  },

  viewTeams() {
    const sites = SITE_THEMES.filter((t) => t.url.startsWith("http")).map((t) =>
      `<button type="button" data-import-site="${t.id}">${t.name}</button>`
    ).join("");
    const list = this.teams.map((t) =>
      `<div class="team-row"><b>${t.name}</b><span>${t.members || ""}</span>
        <button type="button" data-use-team="${t.id}">Use</button>
        <button type="button" data-del-team="${t.id}">Delete</button></div>`
    ).join("") || `<p class="hint">No teams yet.</p>`;
    return `<h3>Teams</h3>
      <p class="hint">Make a custom team palette, or import colors from a site.</p>
      <form id="teamForm" class="team-form">
        <input name="teamName" required maxlength="24" placeholder="Team name" />
        <input name="members" maxlength="80" placeholder="Members" />
        <label>Accent <input type="color" name="accent" value="${this.activeTeam && this.activeTeam.accent || "#7eb6ff"}" /></label>
        <label>Background <input type="color" name="bg" value="${this.activeTeam && this.activeTeam.bg || "#1a1a2e"}" /></label>
        <label>Panel <input type="color" name="panel" value="${this.activeTeam && this.activeTeam.panel || "#16213e"}" /></label>
        <label>Text <input type="color" name="ink" value="${this.activeTeam && this.activeTeam.ink || "#ffffff"}" /></label>
        <button type="submit">Save team</button>
      </form>
      <h4>Your teams</h4>${list}
      <h4>Import from a site</h4>
      <div class="row-actions">${sites}<button type="button" data-random-site>Random site</button></div>`;
  },

  playWorld() {
    if (!(this.flags.world || this.flags.pick > 0 || this.flags.portal)) {
      this.ping("Craft a pickaxe or World Crystal first.");
      return;
    }
    this.close();
    if (window.Terra) Terra.open();
  },

  save() {
    try {
      localStorage.setItem("tinytimer-workshop", JSON.stringify({
        inventory: this.inventory, flags: this.flags, teams: this.teams,
        activeTeam: this.activeTeam, theme: this.theme
      }));
    } catch (_) { /* ignore */ }
  },

  load() {
    try {
      const raw = JSON.parse(localStorage.getItem("tinytimer-workshop") || "null");
      if (!raw) return;
      this.inventory = raw.inventory || {};
      this.flags = Object.assign(this.flags, raw.flags || {});
      this.teams = raw.teams || [];
      this.activeTeam = raw.activeTeam || null;
      this.theme = raw.theme || "tinytimer";
    } catch (_) { /* ignore */ }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ITEMS, RECIPES, SITE_THEMES, recipeMatch, countsFromGrid, pickDrop, Workshop };
}
