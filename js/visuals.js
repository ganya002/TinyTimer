/* Screen FX: particles, matrix, lava, stars, fireflies, DVD, graffiti cursor sparks. */
const Visuals = {
  bits: [],
  mode: "idle",
  dvd: { x: 40, y: 40, vx: 2.4, vy: 1.8, on: false },
  lava: [],
  stars: [],
  flies: [],
  rain: [],
  raf: 0,
  boot() {
    const c = document.getElementById("fx"), f = document.getElementById("fx-front");
    this.ctx = c.getContext("2d"); this.fctx = f.getContext("2d");
    const resize = () => { c.width = f.width = innerWidth; c.height = f.height = innerHeight; };
    resize(); addEventListener("resize", resize);
    for (let i = 0; i < 12; i++) this.lava.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: 40+Math.random()*80, vy: 0.3+Math.random(), ph: Math.random()*6 });
    for (let i = 0; i < 80; i++) this.stars.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, z: Math.random()*2+0.2 });
    for (let i = 0; i < 40; i++) this.flies.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, ph: Math.random()*6 });
    for (let i = 0; i < 60; i++) this.rain.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, s: 4+Math.random()*8, glyph: "ｱｲｳｴｵｶｷｸｹｺ"[i%10] });
    this.loop();
  },
  loop() {
    const c = this.ctx, w = c.canvas.width, h = c.canvas.height;
    c.clearRect(0,0,w,h);
    this.fctx.clearRect(0,0,w,h);
    if (this.mode === "lava" || document.body.classList.contains("lava")) this.drawLava(c,w,h);
    if (this.mode === "matrix") this.drawMatrix(c,w,h);
    if (this.mode === "stars" || this.mode === "space") this.drawStars(c,w,h);
    if (this.mode === "flies") this.drawFlies(c,w,h);
    if (this.mode === "waves") this.drawWaves(c,w,h);
    this.bits = this.bits.filter((p) => p.life > 0);
    this.bits.forEach((p) => {
      p.life--; p.x += p.vx; p.y += p.vy; p.vy += p.g || 0.05;
      c.globalAlpha = Math.max(0, p.life / p.max);
      c.fillStyle = p.c;
      if (p.tag) {
        c.font = "bold 18px Trebuchet MS";
        c.fillText(p.tag, p.x, p.y);
      } else {
        c.fillRect(p.x, p.y, p.s, p.s * (p.tall || 1));
      }
      c.globalAlpha = 1;
    });
    if (this.dvd.on) this.drawDvd();
    this.raf = requestAnimationFrame(() => this.loop());
  },
  burst(n, x, y, colors) {
    for (let i = 0; i < n; i++) {
      this.bits.push({
        x: x ?? innerWidth/2, y: y ?? innerHeight/3,
        vx: (Math.random()-0.5)*12, vy: (Math.random()-0.9)*10,
        s: 4+Math.random()*8, life: 50+Math.random()*40, max: 90,
        c: colors[i % colors.length], g: 0.12
      });
    }
  },
  confetti() { this.burst(80, innerWidth/2, 80, ["#ff4b1f","#ffd23a","#2ee6ff","#ff3ec8","#b6ff4a"]); AudioBus.noise(0.2,"sfx",0.2); toast("Confetti cannon"); },
  nova() { this.burst(50, innerWidth/2, innerHeight/3, ["#ffd23a","#fff","#ff8a3d"]); toast("Nova"); },
  shake() {
    document.getElementById("stage").classList.remove("shake");
    void document.getElementById("stage").offsetWidth;
    document.getElementById("stage").classList.add("shake");
    setTimeout(() => document.getElementById("stage").classList.remove("shake"), 450);
  },
  disco() { document.body.classList.toggle("disco"); toast("Disco inferno"); },
  matrix() { this.mode = this.mode === "matrix" ? "idle" : "matrix"; toast("Matrix rain"); },
  lavaOn() { document.body.classList.toggle("lava"); this.mode = "lava"; toast("Lava lamp"); },
  waves() { document.body.classList.toggle("waves"); this.mode = "waves"; toast("Tide pool"); },
  stars() { document.body.classList.toggle("space"); this.mode = "stars"; toast("Starfield warp"); },
  glitch() { document.body.classList.toggle("glitch"); toast("Glitch hex"); },
  crt() { document.body.classList.toggle("crt"); toast("CRT haunting"); },
  fliesOn() { this.mode = this.mode === "flies" ? "idle" : "flies"; toast("Firefly garden"); },
  gravity() { document.body.classList.toggle("gravity"); toast("Gravity flipped"); },
  wormhole() {
    const w = document.createElement("div"); w.className = "worm"; document.body.appendChild(w);
    setTimeout(() => w.remove(), 900);
    toast("Wormhole");
  },
  dvdOn() {
    this.dvd.on = !this.dvd.on;
    document.getElementById("dvd").style.display = this.dvd.on ? "block" : "none";
    toast("DVD ghost");
  },
  drawLava(c,w,h) {
    this.lava.forEach((b) => {
      b.y -= b.vy; if (b.y < -80) b.y = h+80;
      b.x += Math.sin((performance.now()/800)+b.ph)*0.4;
      const g = c.createRadialGradient(b.x,b.y,10,b.x,b.y,b.r);
      g.addColorStop(0,"#ffd23acc"); g.addColorStop(1,"#ff4b1f00");
      c.fillStyle = g; c.beginPath(); c.arc(b.x,b.y,b.r,0,6.28); c.fill();
    });
  },
  drawMatrix(c,w,h) {
    c.fillStyle = "#b6ff4a"; c.font = "14px monospace";
    this.rain.forEach((r) => {
      r.y += r.s; if (r.y > h) { r.y = -20; r.x = Math.random()*w; }
      c.fillText(r.glyph, r.x, r.y);
    });
  },
  drawStars(c,w,h) {
    c.fillStyle = "#fff4e8";
    this.stars.forEach((s) => {
      s.z += 0.04; if (s.z > 4) { s.z = 0.2; s.x = Math.random()*w; s.y = Math.random()*h; }
      const px = (s.x - w/2) * s.z + w/2, py = (s.y - h/2) * s.z + h/2;
      c.fillRect(px, py, s.z, s.z*3);
    });
  },
  drawFlies(c) {
    this.flies.forEach((f) => {
      f.x += Math.sin(performance.now()/400 + f.ph)*0.8;
      f.y += Math.cos(performance.now()/500 + f.ph)*0.6;
      c.fillStyle = `rgba(182,255,74,${0.4+Math.sin(performance.now()/200+f.ph)*0.4})`;
      c.beginPath(); c.arc(f.x,f.y,3,0,6.28); c.fill();
    });
  },
  drawWaves(c,w,h) {
    c.strokeStyle = "#2ee6ff88"; c.lineWidth = 2; c.beginPath();
    for (let x=0;x<w;x+=8) c.lineTo(x, h*0.7 + Math.sin(x/40 + performance.now()/400)*18);
    c.stroke();
  },
  drawDvd() {
    const el = document.getElementById("dvd");
    this.dvd.x += this.dvd.vx; this.dvd.y += this.dvd.vy;
    if (this.dvd.x < 0 || this.dvd.x > innerWidth-120) this.dvd.vx *= -1;
    if (this.dvd.y < 0 || this.dvd.y > innerHeight-40) this.dvd.vy *= -1;
    el.style.left = this.dvd.x+"px"; el.style.top = this.dvd.y+"px";
    el.style.color = ["#ff4b1f","#2ee6ff","#ffd23a","#b6ff4a"][Math.abs(Math.floor(this.dvd.x/40))%4];
  }
};
window.Visuals = Visuals;
