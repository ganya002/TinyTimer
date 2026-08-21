const TILE = {
  air: 0, dirt: 1, grass: 2, stone: 3, wood: 4, iron: 5, gold: 6, leaves: 7
};

const TILE_COLOR = {
  1: "#6b4226", 2: "#3d8c40", 3: "#7b808c", 4: "#a36b3c", 5: "#c5d0dc", 6: "#e7c56b", 7: "#2f6b32"
};

const TILE_DROP = {
  1: "cobble", 2: "wood", 3: "cobble", 4: "wood", 5: "iron", 6: "gold", 7: "wood"
};

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateWorld(cols, rows, seed) {
  const rand = mulberry32(seed || 20260821);
  const tiles = new Uint8Array(cols * rows);
  const at = (x, y, v) => { if (x >= 0 && y >= 0 && x < cols && y < rows) tiles[y * cols + x] = v; };
  const get = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows) ? TILE.stone : tiles[y * cols + x];

  const surface = [];
  let h = (rows * 0.42) | 0;
  for (let x = 0; x < cols; x++) {
    h += (rand() < 0.5 ? -1 : 1);
    h = Math.max((rows * 0.28) | 0, Math.min((rows * 0.58) | 0, h));
    surface[x] = h;
    at(x, h, TILE.grass);
    for (let y = h + 1; y < rows; y++) {
      const depth = y - h;
      at(x, y, depth < 5 + ((rand() * 3) | 0) ? TILE.dirt : TILE.stone);
    }
  }

  for (let x = 3; x < cols - 3; x++) {
    if (rand() > 0.88) {
      const base = surface[x];
      const tall = 3 + ((rand() * 4) | 0);
      for (let i = 1; i <= tall; i++) at(x, base - i, TILE.wood);
      for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 1; dy++) {
        if (Math.abs(dx) + Math.abs(dy) < 4) at(x + dx, base - tall + dy, TILE.leaves);
      }
    }
  }

  for (let n = 0; n < cols * 2; n++) {
    let x = (rand() * cols) | 0;
    let y = ((0.55 + rand() * 0.35) * rows) | 0;
    const ore = rand() < 0.35 ? TILE.gold : TILE.iron;
    for (let k = 0; k < 6; k++) {
      at(x, y, ore);
      x += (rand() * 3 - 1) | 0;
      y += (rand() * 3 - 1) | 0;
    }
  }

  for (let n = 0; n < 18; n++) {
    let x = (rand() * cols) | 0;
    let y = ((0.4 + rand() * 0.5) * rows) | 0;
    for (let k = 0; k < 24; k++) {
      at(x, y, TILE.air);
      at(x + 1, y, TILE.air);
      x += (rand() * 3 - 1) | 0;
      y += (rand() * 3 - 1) | 0;
    }
  }

  return { tiles, cols, rows, get, at, surface };
}

const Terra = {
  open() {
    const wrap = document.getElementById("terraWrap");
    wrap.classList.remove("hidden");
    document.body.classList.add("overlay-open");
    if (window.MiniGames) MiniGames.suspend();
    this.boot();
  },
  close() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    document.getElementById("terraWrap").classList.add("hidden");
    document.body.classList.remove("overlay-open");
    if (window.MiniGames) MiniGames.resume();
  },
  boot() {
    this.canvas = document.getElementById("terraCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.keys = Object.create(null);
    this.touch = { left: false, right: false, jump: false };
    this.size = 16;
    this.world = generateWorld(96, 42, (Date.now() % 99991) + 7);
    let sx = 20;
    while (sx < 80 && this.world.get(sx, this.world.surface[sx] - 1) !== TILE.air) sx += 1;
    const sy = this.world.surface[sx] - 2;
    this.player = { x: sx * this.size + 2, y: sy * this.size, vx: 0, vy: 0, w: 10, h: 20, hp: 5, inv: 0 };
    this.cam = { x: 0, y: 0 };
    this.slimes = [];
    for (let i = 0; i < 6; i++) {
      const x = ((i + 1) * 12 + 8);
      this.slimes.push({ x: x * this.size, y: (this.world.surface[x] - 1) * this.size, vx: 0, vy: 0, hop: 0, hp: 2, w: 14, h: 12 });
    }
    this.hud = document.getElementById("terraHud");
    this.bindOnce();
    this.resize();
    this.running = true;
    this.last = 0;
    this.loop(0);
    this.say("World loaded. Dig, jump, don't feed the slimes.");
  },
  bindOnce() {
    if (this._bound) return;
    this._bound = true;
    addEventListener("keydown", (e) => {
      if (document.getElementById("terraWrap").classList.contains("hidden")) return;
      this.keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if (e.key === "Escape") this.close();
    });
    addEventListener("keyup", (e) => { this.keys[e.key] = false; });
    addEventListener("resize", () => this.running && this.resize());
    this.canvas.addEventListener("pointerdown", (e) => this.mineAt(e));
    document.getElementById("terraClose").addEventListener("click", () => this.close());
    const pad = document.getElementById("terraPad");
    pad.querySelectorAll("[data-pad]").forEach((btn) => {
      const set = (v) => { this.touch[btn.dataset.pad] = v; };
      btn.addEventListener("pointerdown", (e) => { e.preventDefault(); set(true); });
      btn.addEventListener("pointerup", () => set(false));
      btn.addEventListener("pointerleave", () => set(false));
    });
  },
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.view = { w, h };
  },
  say(text) { if (this.hud) this.hud.textContent = text; },
  solid(tx, ty) {
    const { cols, rows, tiles } = this.world;
    if (ty < 0) return false;
    if (tx < 0 || tx >= cols || ty >= rows) return true;
    const t = tiles[ty * cols + tx];
    return t !== TILE.air && t !== TILE.leaves;
  },
  tileAt(px, py) {
    return { x: Math.floor(px / this.size), y: Math.floor(py / this.size) };
  },
  collide(box) {
    const x0 = Math.floor(box.x / this.size);
    const y0 = Math.floor(box.y / this.size);
    const x1 = Math.floor((box.x + box.w - 0.01) / this.size);
    const y1 = Math.floor((box.y + box.h - 0.01) / this.size);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (this.solid(x, y)) return true;
    return false;
  },
  moveBox(box, dx, dy) {
    box.x += dx;
    if (this.collide(box)) {
      box.x -= dx;
      const step = Math.sign(dx) || 1;
      while (dx && !this.collide({ ...box, x: box.x + step })) box.x += step;
      box.vx = 0;
    }
    box.y += dy;
    let grounded = false;
    if (this.collide(box)) {
      box.y -= dy;
      const step = Math.sign(dy) || 1;
      while (dy && !this.collide({ ...box, y: box.y + step })) box.y += step;
      if (dy > 0) grounded = true;
      box.vy = 0;
    }
    return grounded;
  },
  mineAt(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left + this.cam.x;
    const y = e.clientY - r.top + this.cam.y;
    const t = this.tileAt(x, y);
    const p = this.player;
    const pcx = p.x + p.w / 2, pcy = p.y + p.h / 2;
    const dx = (t.x + 0.5) * this.size - pcx;
    const dy = (t.y + 0.5) * this.size - pcy;
    if (dx * dx + dy * dy > (this.size * 5.5) ** 2) return;
    const slime = this.slimes.find((s) => x > s.x && x < s.x + 14 && y > s.y && y < s.y + 12);
    if (slime) {
      slime.hp -= 1;
      slime.vx += Math.sign(slime.x - p.x) * 80;
      if (slime.hp <= 0) {
        this.slimes = this.slimes.filter((s) => s !== slime);
        if (window.Workshop) Workshop.add("slime", 1);
        this.say("Slime down. Packed slime.");
      }
      return;
    }
    const id = this.world.get(t.x, t.y);
    if (id === TILE.air) return;
    this.world.at(t.x, t.y, TILE.air);
    const drop = TILE_DROP[id];
    if (drop && window.Workshop) Workshop.add(drop, 1);
    this.say("Mined " + (ITEMS[drop] ? ITEMS[drop].name : "block"));
  },
  loop(ts) {
    if (!this.running) return;
    const dt = this.last ? Math.min(0.04, (ts - this.last) / 1000) : 0;
    this.last = ts;
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame((t) => this.loop(t));
  },
  update(dt) {
    const p = this.player;
    const left = this.keys.ArrowLeft || this.keys.a || this.keys.A || this.touch.left;
    const right = this.keys.ArrowRight || this.keys.d || this.keys.D || this.touch.right;
    const jump = this.keys.ArrowUp || this.keys.w || this.keys.W || this.keys[" "] || this.touch.jump;
    p.vx = (right ? 1 : 0) - (left ? 1 : 0);
    p.vx *= 110;
    p.vy += 520 * dt;
    if (jump && p.onGround) p.vy = -210;
    p.onGround = this.moveBox(p, p.vx * dt, p.vy * dt);
    if (p.inv > 0) p.inv -= dt;

    this.slimes.forEach((s) => {
      s.hop -= dt;
      if (s.hop <= 0) {
        s.vx = Math.sign(p.x - s.x) * (40 + Math.random() * 40);
        s.vy = -140 - Math.random() * 40;
        s.hop = 1.1 + Math.random();
      }
      s.vy += 500 * dt;
      s.onGround = this.moveBox(s, s.vx * dt, s.vy * dt);
      if (s.onGround) s.vx *= 0.6;
      const hit = p.x < s.x + 14 && p.x + p.w > s.x && p.y < s.y + 12 && p.y + p.h > s.y;
      if (hit && p.inv <= 0) {
        p.hp -= 1;
        p.inv = 1;
        p.vx = Math.sign(p.x - s.x) * 160;
        p.vy = -80;
        this.say("Ouch · hearts " + p.hp);
        if (p.hp <= 0) {
          p.hp = 5;
          const sx = 48;
          p.x = sx * this.size;
          p.y = (this.world.surface[sx] - 2) * this.size;
          this.say("You fainted and woke at camp.");
        }
      }
    });

    const { w, h } = this.view || { w: 800, h: 400 };
    this.cam.x = Math.max(0, Math.min(this.world.cols * this.size - w, p.x - w / 2));
    this.cam.y = Math.max(0, Math.min(this.world.rows * this.size - h, p.y - h / 2));
  },
  draw() {
    const c = this.ctx;
    const { w, h } = this.view;
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#7ec8e3");
    g.addColorStop(0.55, "#cfe9a5");
    g.addColorStop(1, "#6b4226");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    const t0 = Math.floor(this.cam.x / this.size);
    const t1 = Math.ceil((this.cam.x + w) / this.size);
    const u0 = Math.floor(this.cam.y / this.size);
    const u1 = Math.ceil((this.cam.y + h) / this.size);
    for (let y = u0; y <= u1; y++) {
      for (let x = t0; x <= t1; x++) {
        const id = this.world.get(x, y);
        if (!id) continue;
        c.fillStyle = TILE_COLOR[id] || "#444";
        c.fillRect(x * this.size - this.cam.x, y * this.size - this.cam.y, this.size, this.size);
        c.fillStyle = "rgba(0,0,0,0.12)";
        c.fillRect(x * this.size - this.cam.x, y * this.size - this.cam.y + this.size - 3, this.size, 3);
      }
    }
    this.slimes.forEach((s) => {
      c.fillStyle = "#7ee0c3";
      c.fillRect(s.x - this.cam.x, s.y - this.cam.y, 14, 12);
      c.fillStyle = "#16332c";
      c.fillRect(s.x - this.cam.x + 3, s.y - this.cam.y + 3, 2, 2);
      c.fillRect(s.x - this.cam.x + 9, s.y - this.cam.y + 3, 2, 2);
    });
    const p = this.player;
    c.fillStyle = p.inv > 0 ? "#fff" : "#f2d2b6";
    c.fillRect(p.x - this.cam.x, p.y - this.cam.y, p.w, p.h);
    c.fillStyle = "#1a1a2e";
    c.fillRect(p.x - this.cam.x + 2, p.y - this.cam.y + 4, 2, 2);
    c.fillRect(p.x - this.cam.x + 6, p.y - this.cam.y + 4, 2, 2);
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i < p.hp ? "#ef4444" : "#3a2030";
      c.fillRect(8 + i * 14, 8, 12, 10);
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TILE, generateWorld, Terra, mulberry32 };
}
