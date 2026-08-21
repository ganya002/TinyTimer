const MiniGames = {
  canvas: null,
  ctx: null,
  board: null,
  stage: null,
  hud: null,
  hint: null,
  tabs: null,
  current: "drop",
  game: null,
  raf: 0,
  last: 0,
  running: false,
  paused: false,
  keys: Object.create(null),
  pointer: { x: 0, y: 0, down: false, inside: false },
  scores: {},
  size: { w: 320, h: 280 },

  list: [
    { id: "drop", name: "Drop", hint: "Move the bucket. Catch drops, miss three and it is over." },
    { id: "snake", name: "Snake", hint: "Arrows or WASD. Eat squares, do not hit yourself or the wall." },
    { id: "pong", name: "Pong", hint: "Move the paddle with the mouse or arrows. First to 5 wins." },
    { id: "memory", name: "Memory", hint: "Flip two tiles. Match every pair in as few tries as you can." },
    { id: "reflex", name: "Reflex", hint: "Wait for green, then click. Too early counts as a false start." }
  ],

  boot(els) {
    this.canvas = els.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.board = els.board;
    this.stage = els.stage;
    this.hud = els.hud;
    this.hint = els.hint;
    this.tabs = els.tabs;
    this.scores = this.loadScores();
    this.bind();
    this.renderTabs();
    this.play("drop");
    requestAnimationFrame(() => this.resize());
    addEventListener("resize", () => this.resize());
  },

  formField(el) {
    const tag = (el && el.tagName) || "";
    return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (el && el.isContentEditable);
  },
  bind() {
    const onKey = (e, down) => {
      if (this.formField(e.target) || document.body.classList.contains("overlay-open")) {
        if (!down) this.keys[e.key] = false;
        return;
      }
      this.keys[e.key] = down;
      if (!this.running || this.paused || !this.game) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (down && this.game.key) this.game.key(e);
    };
    addEventListener("keydown", (e) => onKey(e, true));
    addEventListener("keyup", (e) => onKey(e, false));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.paused = true;
      else if (!document.body.classList.contains("overlay-open")) {
        this.paused = false;
        this.last = 0;
      }
    });

    const pos = (e) => {
      const r = this.canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      if (!t) return;
      this.pointer.x = t.clientX - r.left;
      this.pointer.y = t.clientY - r.top;
      this.pointer.inside = this.pointer.x >= 0 && this.pointer.y >= 0 && this.pointer.x <= r.width && this.pointer.y <= r.height;
    };
    this.canvas.addEventListener("pointerdown", (e) => {
      this.canvas.setPointerCapture(e.pointerId);
      this.pointer.down = true;
      pos(e);
      if (this.game && this.game.pointer) this.game.pointer("down");
    });
    this.canvas.addEventListener("pointermove", (e) => {
      pos(e);
      if (this.game && this.game.pointer) this.game.pointer("move");
    });
    this.canvas.addEventListener("pointerup", (e) => {
      this.pointer.down = false;
      pos(e);
      if (this.game && this.game.pointer) this.game.pointer("up");
    });
    this.canvas.addEventListener("pointerleave", () => {
      if (!this.pointer.down) this.pointer.inside = false;
    });
  },
  suspend() { this.paused = true; },
  resume() { this.paused = false; this.last = 0; },

  renderTabs() {
    this.tabs.innerHTML = "";
    this.list.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.name;
      btn.setAttribute("aria-pressed", item.id === this.current ? "true" : "false");
      btn.addEventListener("click", () => this.play(item.id));
      this.tabs.appendChild(btn);
    });
  },

  play(id) {
    this.stop();
    this.current = id;
    this.renderTabs();
    const meta = this.list.find((g) => g.id === id);
    this.hint.textContent = meta ? meta.hint : "";
    this.board.innerHTML = "";
    const factory = Games[id];
    if (!factory) return;
    this.game = factory(this);
    const kind = this.game.kind || "canvas";
    this.stage.classList.toggle("dom", kind === "dom");
    this.resize();
    this.running = true;
    this.last = 0;
    if (this.game.start) this.game.start();
    if (kind === "canvas") this.loop(0);
  },

  restart() {
    this.play(this.current);
  },

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (this.game && this.game.stop) this.game.stop();
    this.game = null;
  },

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || 332;
    const h = this.canvas.clientHeight || 280;
    this.size = { w, h };
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.game && this.game.resize) this.game.resize(w, h);
  },

  loop(ts) {
    if (!this.running || !this.game) return;
    if (this.paused) {
      this.last = 0;
      this.raf = requestAnimationFrame((t) => this.loop(t));
      return;
    }
    const dt = this.last ? Math.min(0.05, (ts - this.last) / 1000) : 0;
    this.last = ts;
    if (this.game.update) this.game.update(dt);
    if (this.game.draw) this.game.draw(this.ctx, this.size.w, this.size.h);
    this.raf = requestAnimationFrame((t) => this.loop(t));
  },

  setHud(text) {
    this.hud.textContent = text;
  },

  record(id, score, better) {
    const prev = this.scores[id];
    const win = prev == null || better(score, prev);
    if (win) {
      this.scores[id] = score;
      try { localStorage.setItem("tinytimer-scores", JSON.stringify(this.scores)); } catch (_) {}
    }
    return this.scores[id];
  },

  loadScores() {
    try { return JSON.parse(localStorage.getItem("tinytimer-scores") || "{}"); }
    catch (_) { return {}; }
  },

  axis() {
    let x = 0, y = 0;
    if (this.keys.ArrowLeft || this.keys.a || this.keys.A) x -= 1;
    if (this.keys.ArrowRight || this.keys.d || this.keys.D) x += 1;
    if (this.keys.ArrowUp || this.keys.w || this.keys.W) y -= 1;
    if (this.keys.ArrowDown || this.keys.s || this.keys.S) y += 1;
    return { x, y };
  }
};

const Games = {
  drop(host) {
    const drops = [];
    const splashes = [];
    let bucketX, catchW, lives, score, spawn, speed, over, started;
    const best = () => host.scores.drop || 0;

    function spawnDrop(w) {
      const gold = Math.random() < 0.12;
      drops.push({
        x: host.testX != null ? host.testX : 16 + Math.random() * (w - 32),
        y: -18,
        r: gold ? 8 : 6 + Math.random() * 3,
        vy: 90 + Math.random() * 50,
        gold
      });
    }

    return {
      start() {
        bucketX = host.size.w / 2;
        catchW = 54;
        lives = 3;
        score = 0;
        spawn = 0;
        speed = 1;
        over = false;
        started = false;
        drops.length = 0;
        splashes.length = 0;
        host.setHud("Score 0  ·  Lives 3  ·  Best " + best());
      },
      pointer(kind) { if (kind === "down" && over) host.restart(); },
      update(dt) {
        if (over) return;
        const { w, h } = host.size;
        const move = host.axis().x;
        if (move) {
          started = true;
          bucketX += move * 280 * dt;
        }
        if (host.pointer.inside || host.pointer.down) {
          started = true;
          bucketX += (host.pointer.x - bucketX) * Math.min(1, dt * 14);
        }
        bucketX = Math.max(catchW / 2, Math.min(w - catchW / 2, bucketX));
        if (!started) return;

        speed += dt * 0.04;
        spawn += dt;
        const gap = Math.max(0.28, 0.85 - score * 0.012);
        if (spawn >= gap) {
          spawn = 0;
          spawnDrop(w);
        }

        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i];
          d.vy += 420 * dt;
          d.y += d.vy * dt * speed;
          const caught = d.y > h - 38 && d.y < h - 10 && Math.abs(d.x - bucketX) < catchW / 2 + d.r;
          if (caught) {
            score += d.gold ? 5 : 1;
            splashes.push({ x: d.x, y: h - 28, t: 0, gold: d.gold });
            drops.splice(i, 1);
            host.setHud("Score " + score + "  ·  Lives " + lives + "  ·  Best " + Math.max(best(), score));
            continue;
          }
          if (d.y > h + 20) {
            drops.splice(i, 1);
            lives -= 1;
            host.setHud("Score " + score + "  ·  Lives " + lives + "  ·  Best " + Math.max(best(), score));
            if (lives <= 0) {
              over = true;
              const rec = host.record("drop", score, (a, b) => a > b);
              host.setHud("Game over  ·  Score " + score + "  ·  Best " + rec);
            }
          }
        }
        for (let i = splashes.length - 1; i >= 0; i--) {
          splashes[i].t += dt;
          if (splashes[i].t > 0.35) splashes.splice(i, 1);
        }
      },
      draw(c, w, h) {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#1b3358");
        g.addColorStop(1, "#0f172a");
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);

        drops.forEach((d) => {
          c.save();
          c.translate(d.x, d.y);
          c.beginPath();
          c.moveTo(0, -d.r * 1.6);
          c.bezierCurveTo(d.r, -d.r * 0.2, d.r, d.r, 0, d.r);
          c.bezierCurveTo(-d.r, d.r, -d.r, -d.r * 0.2, 0, -d.r * 1.6);
          c.fillStyle = d.gold ? "#e7c56b" : "#7eb6ff";
          c.fill();
          c.restore();
        });

        splashes.forEach((s) => {
          c.globalAlpha = 1 - s.t / 0.35;
          c.fillStyle = s.gold ? "#e7c56b" : "#9cc7ff";
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            c.beginPath();
            c.arc(s.x + Math.cos(a) * s.t * 40, s.y + Math.sin(a) * s.t * 18, 2, 0, Math.PI * 2);
            c.fill();
          }
          c.globalAlpha = 1;
        });

        const bx = bucketX, by = h - 28, bw = catchW, bh = 18;
        c.fillStyle = "#e8e8e8";
        c.fillRect(bx - bw / 2, by - 4, 4, bh);
        c.fillRect(bx + bw / 2 - 4, by - 4, 4, bh);
        c.fillRect(bx - bw / 2, by + bh - 6, bw, 6);
        c.strokeStyle = "#9aa0b8";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(bx - bw / 2, by);
        c.lineTo(bx - bw / 2, by + bh);
        c.lineTo(bx + bw / 2, by + bh);
        c.lineTo(bx + bw / 2, by);
        c.stroke();

        if (!started && !over) {
          c.fillStyle = "rgba(0,0,0,0.35)";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#fff";
          c.font = "600 16px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText("Move to catch the drops", w / 2, h / 2);
        }
        if (over) {
          c.fillStyle = "rgba(10,14,28,0.55)";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#fff";
          c.font = "600 18px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText("Restart to play again", w / 2, h / 2);
        }
      }
    };
  },

  snake(host) {
    const cell = 16;
    let cols, rows, body, dir, next, food, acc, dead, score;
    const best = () => host.scores.snake || 0;

    function placeFood() {
      for (let n = 0; n < cols * rows; n++) {
        const x = (Math.random() * cols) | 0;
        const y = (Math.random() * rows) | 0;
        if (!body.some((p) => p.x === x && p.y === y)) { food = { x, y }; return; }
      }
      food = { x: body[0].x, y: body[0].y };
    }

    return {
      start() {
        cols = Math.max(8, Math.floor(host.size.w / cell));
        rows = Math.max(8, Math.floor(host.size.h / cell));
        const sx = (cols / 2) | 0, sy = (rows / 2) | 0;
        body = [{ x: sx, y: sy }, { x: sx - 1, y: sy }, { x: sx - 2, y: sy }];
        dir = { x: 1, y: 0 };
        next = { x: 1, y: 0 };
        acc = 0;
        dead = false;
        score = 0;
        placeFood();
        host.setHud("Length " + body.length + "  ·  Best " + best());
      },
      pointer(kind) { if (kind === "down" && dead) host.restart(); },
      key(e) {
        const map = {
          ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
          w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
          W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
        };
        const n = map[e.key];
        if (!n) return;
        if (n[0] === -dir.x && n[1] === -dir.y) return;
        next = { x: n[0], y: n[1] };
      },
      update(dt) {
        if (dead) return;
        acc += dt;
        const step = Math.max(0.08, 0.16 - score * 0.004);
        if (acc < step) return;
        acc = 0;
        dir = next;
        const head = { x: body[0].x + dir.x, y: body[0].y + dir.y };
        const hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
        const hitSelf = body.some((p) => p.x === head.x && p.y === head.y);
        if (hitWall || hitSelf) {
          dead = true;
          const rec = host.record("snake", score, (a, b) => a > b);
          host.setHud("Game over  ·  Score " + score + "  ·  Best " + rec);
          return;
        }
        body.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 1;
          placeFood();
          host.setHud("Length " + body.length + "  ·  Best " + Math.max(best(), score));
        } else body.pop();
      },
      draw(c, w, h) {
        c.fillStyle = "#111827";
        c.fillRect(0, 0, w, h);
        const ox = Math.floor((w - cols * cell) / 2);
        const oy = Math.floor((h - rows * cell) / 2);
        c.fillStyle = "#161e32";
        c.fillRect(ox, oy, cols * cell, rows * cell);
        c.fillStyle = "#e7c56b";
        c.fillRect(ox + food.x * cell + 2, oy + food.y * cell + 2, cell - 4, cell - 4);
        body.forEach((p, i) => {
          c.fillStyle = i === 0 ? "#7eb6ff" : "#3d6ca8";
          c.fillRect(ox + p.x * cell + 1, oy + p.y * cell + 1, cell - 2, cell - 2);
        });
        if (dead) {
          c.fillStyle = "rgba(10,14,28,0.55)";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#fff";
          c.font = "600 18px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText("Restart to play again", w / 2, h / 2);
        }
      }
    };
  },

  pong(host) {
    let ball, player, cpu, pScore, cScore, serve, over;
    const paddleH = 64, paddleW = 8;

    function serveBall(dir) {
      const ang = (Math.random() * 0.6 - 0.3);
      ball = {
        x: host.size.w / 2,
        y: host.size.h / 2,
        vx: dir * (210 + Math.random() * 40),
        vy: Math.sin(ang) * 220
      };
      serve = 0.6;
    }

    return {
      start() {
        player = host.size.h / 2;
        cpu = host.size.h / 2;
        pScore = 0;
        cScore = 0;
        over = false;
        serveBall(Math.random() < 0.5 ? -1 : 1);
        host.setHud("You 0  ·  CPU 0  ·  first to 5");
      },
      pointer(kind) { if (kind === "down" && over) host.restart(); },
      update(dt) {
        if (over) return;
        const { w, h } = host.size;
        const move = host.axis().y;
        player += move * 320 * dt;
        if (host.pointer.inside || host.pointer.down) {
          player += (host.pointer.y - player) * Math.min(1, dt * 16);
        }
        player = Math.max(paddleH / 2, Math.min(h - paddleH / 2, player));

        const target = ball.y + (ball.vx < 0 ? ball.vy * 0.12 : 0);
        cpu += (target - cpu) * Math.min(1, dt * 4.2);
        cpu = Math.max(paddleH / 2, Math.min(h - paddleH / 2, cpu));

        if (serve > 0) { serve -= dt; return; }

        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.y < 8 || ball.y > h - 8) {
          ball.vy *= -1;
          ball.y = Math.max(8, Math.min(h - 8, ball.y));
        }

        const hitPaddle = (px, py) =>
          ball.x > px - 6 && ball.x < px + paddleW + 6 &&
          ball.y > py - paddleH / 2 && ball.y < py + paddleH / 2;

        if (hitPaddle(w - 22, player) && ball.vx > 0) {
          ball.vx = -Math.min(420, Math.abs(ball.vx) * 1.05);
          ball.vy += (ball.y - player) * 6;
          ball.x = w - 28;
        }
        if (hitPaddle(14, cpu) && ball.vx < 0) {
          ball.vx = Math.min(420, Math.abs(ball.vx) * 1.03);
          ball.vy += (ball.y - cpu) * 5;
          ball.x = 28;
        }
        ball.vy = Math.max(-380, Math.min(380, ball.vy));

        if (ball.x > w) {
          cScore += 1;
          host.setHud("You " + pScore + "  ·  CPU " + cScore + "  ·  first to 5");
          if (cScore >= 5) { over = true; host.setHud("CPU wins  ·  Restart"); }
          else serveBall(-1);
        } else if (ball.x < 0) {
          pScore += 1;
          host.setHud("You " + pScore + "  ·  CPU " + cScore + "  ·  first to 5");
          if (pScore >= 5) {
            over = true;
            host.record("pong", 1, () => true);
            host.setHud("You win  ·  Restart");
          } else serveBall(1);
        }
      },
      draw(c, w, h) {
        c.fillStyle = "#111827";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#2e3358";
        c.setLineDash([6, 8]);
        c.beginPath();
        c.moveTo(w / 2, 8);
        c.lineTo(w / 2, h - 8);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = "#c8cde8";
        c.fillRect(14, cpu - paddleH / 2, paddleW, paddleH);
        c.fillStyle = "#e8e8e8";
        c.fillRect(w - 22, player - paddleH / 2, paddleW, paddleH);
        c.beginPath();
        c.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        c.fillStyle = "#7eb6ff";
        c.fill();
        c.fillStyle = "#fff";
        c.font = "600 18px system-ui, sans-serif";
        c.textAlign = "center";
        c.fillText(String(cScore), w / 2 - 28, 28);
        c.fillText(String(pScore), w / 2 + 28, 28);
      }
    };
  },

  memory(host) {
    const shapes = [
      ["circle", "#7eb6ff"], ["square", "#e7c56b"], ["diamond", "#d07cff"], ["bar", "#7ee0c3"],
      ["ring", "#ff8fab"], ["tri", "#9ad06c"], ["plus", "#ffb36b"], ["hex", "#c8cde8"]
    ];
    let first, lock, matches, tries, timer;

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function paint() {
      const cards = [];
      shapes.forEach((s, i) => { cards.push({ id: i, ...pair(s) }); cards.push({ id: i, ...pair(s) }); });
      shuffle(cards);
      host.board.innerHTML = "";
      const grid = document.createElement("div");
      grid.className = "memory-grid";
      cards.forEach((card) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Hidden tile");
        const pip = document.createElement("span");
        pip.className = "pip " + card.shape;
        pip.style.background = card.color;
        pip.style.color = card.color;
        btn.appendChild(pip);
        btn.addEventListener("click", () => flip(btn, card));
        grid.appendChild(btn);
      });
      host.board.appendChild(grid);
    }

    function pair(s) { return { shape: s[0], color: s[1] }; }

    function flip(btn, card) {
      if (lock || btn.classList.contains("on") || btn.classList.contains("got")) return;
      if (first && first.btn === btn) return;
      btn.classList.add("on");
      btn.setAttribute("aria-label", "Tile " + card.shape);
      if (!first) { first = { btn, card }; return; }
      tries += 1;
      if (first.card.id === card.id) {
        first.btn.classList.add("got");
        btn.classList.add("got");
        first = null;
        matches += 1;
        host.setHud("Matches " + matches + "/8  ·  Tries " + tries);
        if (matches === 8) {
          const rec = host.record("memory", tries, (a, b) => a < b);
          host.setHud("Cleared in " + tries + " tries  ·  Best " + rec);
        }
      } else {
        lock = true;
        const a = first.btn, b = btn;
        first = null;
        timer = setTimeout(() => {
          a.classList.remove("on");
          b.classList.remove("on");
          a.setAttribute("aria-label", "Hidden tile");
          b.setAttribute("aria-label", "Hidden tile");
          lock = false;
        }, 650);
        host.setHud("Matches " + matches + "/8  ·  Tries " + tries);
      }
    }

    return {
      kind: "dom",
      start() {
        first = null;
        lock = false;
        matches = 0;
        tries = 0;
        paint();
        host.setHud("Matches 0/8  ·  Tries 0");
      },
      stop() { clearTimeout(timer); }
    };
  },

  reflex(host) {
    let state, startAt, waitTimer, bestMs;

    function panel(cls, text) {
      host.board.innerHTML = "";
      const el = document.createElement("div");
      el.className = "reflex " + cls;
      el.textContent = text;
      el.addEventListener("click", onClick);
      host.board.appendChild(el);
    }

    function arm() {
      state = "wait";
      panel("wait", "Wait for green…");
      host.setHud("Wait…  ·  Best " + (bestMs ? bestMs + " ms" : "—"));
      waitTimer = setTimeout(() => {
        state = "go";
        startAt = performance.now();
        panel("go", "NOW");
        host.setHud("Click!");
      }, 1100 + Math.random() * 2200);
    }

    function onClick() {
      if (state === "idle") { arm(); return; }
      if (state === "wait") {
        clearTimeout(waitTimer);
        state = "idle";
        panel("idle", "Too soon. Click to try again.");
        host.setHud("False start");
        return;
      }
      if (state === "go") {
        const ms = Math.round(performance.now() - startAt);
        const rec = host.record("reflex", ms, (a, b) => a < b);
        bestMs = rec;
        state = "idle";
        panel("result", ms + " ms. Click to try again.");
        host.setHud("Your time " + ms + " ms  ·  Best " + rec + " ms");
      }
    }

    return {
      kind: "dom",
      start() {
        bestMs = host.scores.reflex || 0;
        state = "idle";
        panel("idle", "Click to start");
        host.setHud("Best " + (bestMs ? bestMs + " ms" : "—"));
      },
      stop() { clearTimeout(waitTimer); },
      key(e) {
        if (e.key === " " || e.key === "Enter") onClick();
      }
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MiniGames, Games };
}
