/* Shop (side kiosk), graffiti, virus windows, Tung Tung calls, brainrot ambush, pet, badges. */
const Shop = {
  ticks: Number(localStorage.getItem("tt-ticks") || 0),
  owned: JSON.parse(localStorage.getItem("tt-owned") || "{}"),
    items: [
    { id: "skin-lava", name: "Lava stage skin", cost: 25, blurb: "Background goes magma." },
    { id: "dragon-snack", name: "Ember snack", cost: 6, blurb: "Feed the dragon. Side treat." },
    { id: "sticker-pack", name: "Sticker bomb", cost: 10, blurb: "Vector stickers slap the wall." },
    { id: "popup-pack", name: "Extra virus pack", cost: 14, blurb: "More fake popups. Worse. Better." },
    { id: "sahur-ring", name: "Sahur ringtone", cost: 20, blurb: "Tung hits when timers end." },
    { id: "mystery-crate", name: "Mystery crate", cost: 9, blurb: "Unlock a random still-locked wonder." },
    { id: "fake-adblock", name: "Disable popups (fake)", cost: 999, blurb: "It does not work. That is the bit." }
  ],
  boot() { this.render(); },
  add(n) { this.ticks += n; this.save(); this.render(); },
  spend(n, silent) {
    if (this.ticks < n) { if (!silent) toast("not enough ticks"); return false; }
    this.ticks -= n; this.save(); this.render(); return true;
  },
  save() { localStorage.setItem("tt-ticks", String(this.ticks)); localStorage.setItem("tt-owned", JSON.stringify(this.owned)); },
  open() { document.getElementById("shopDrawer").classList.add("open"); this.render(); toast("Side street kiosk"); },
  close() { document.getElementById("shopDrawer").classList.remove("open"); },
  toggle() { document.getElementById("shopDrawer").classList.toggle("open"); this.render(); },
  render() {
    const w = document.getElementById("shopWallet"); if (w) w.textContent = this.ticks;
    const t = document.getElementById("tickStat");
    if (t) t.innerHTML = iconHTML("tick") + " <b>" + this.ticks + "</b>";
    const box = document.getElementById("shopItems"); if (!box) return;
    box.innerHTML = this.items.map((it) => `<div class="shop-item">
      ${iconHTML(it.id.includes("dragon") ? "dragon" : it.id.includes("sahur") ? "tung" : it.id.includes("popup") || it.id.includes("adblock") ? "virus" : it.id.includes("skin") ? "lava" : it.id.includes("crate") ? "vault" : "sticker")}
      <div><b>${it.name}</b><div class="hud">${it.blurb}</div></div>
      <button ${this.owned[it.id] ? "disabled" : ""} onclick="Shop.buy('${it.id}')">${this.owned[it.id] ? "owned" : it.cost + " ticks"}</button>
    </div>`).join("");
  },
  buy(id) {
    const it = this.items.find((x) => x.id === id);
    if (!it || this.owned[id]) return;
    if (!this.spend(it.cost)) return;
    this.owned[id] = true; this.save(); this.render();
    if (id === "dragon-snack") Ember.feed(20);
    if (id === "skin-lava") { document.body.classList.add("lava"); Visuals.mode = "lava"; }
    if (id === "sticker-pack") Visuals.confetti();
    if (id === "popup-pack") toast("popups will now arrive in bigger packs. still uninvited.");
    if (id === "mystery-crate") { Progress.unlockNext(1); this.owned[id] = false; this.save(); this.render(); }
    if (id === "fake-adblock") { toast("adblock installed (it is a sticker)"); this.owned[id] = false; this.save(); }
    Dopamine.combo("+OWNED", "#ffd23a");
    Badge.earn("shop");
  }
};

const Graffiti = {
  postPopup(title) {
    Dopamine.combo("+POSTED", "#ff3ec8");
    Shop.add(2);
    Visuals.confetti();
    toast("Posted: " + title);
  }
};

const Virus = {
  templates: [
    { title: "CHRONOS.EXE", body: "Your timer has 37 viruses. They are all late." },
    { title: "CONGRATULATION", body: "You are visitor #1000. Click POST to claim 0 ticks." },
    { title: "URGENT SUNDIAL", body: "Hot singles in your timezone want to count down." },
    { title: "ERROR 5:00", body: "Time could not be found. Did you check behind the couch?" },
    { title: "SAHUR INSTALLER", body: "Tung Tung Tung Sahur wants to use your speakers." },
    { title: "POPUP LICENSE", body: "Your chaos license expired in 1998. POST to renew." },
    { title: "DRAGON TAX", body: "Ember filed a hunger report. Feed immediately." },
    { title: "MUSEUM BREACH", body: "Feature #99 escaped. It is rolling toward you." },
    { title: "LOFI OVERFLOW", body: "Too much vinyl crackle. Buffering rain." },
    { title: "FAKE BLUE SCREEN", body: "A fatal exception 0E has occurred in TINYTIMER. Stay calm. POST it." }
  ],
  storm(n) {
    n = n || 4;
    if (Shop.owned["popup-pack"]) n += 2;
    for (let i = 0; i < n; i++) setTimeout(() => this.spawn(), i * 180);
    toast("Virus popup storm");
    Badge.earn("virus");
    AudioBus.tone(120, 0.2, "sawtooth", "sfx", 0.15);
  },
  spawn() {
    const t = this.templates[(Math.random()*this.templates.length)|0];
    const el = document.createElement("div");
    el.className = "virus-win";
    el.style.left = (40 + Math.random() * (innerWidth - 300)) + "px";
    el.style.top = (40 + Math.random() * (innerHeight - 220)) + "px";
    el.innerHTML = `<div class="virus-title">${iconHTML("virus")} ${t.title}<button class="virus-x">X</button></div>
      <div class="virus-body">${iconHTML("chaos")}<div>${t.body}</div></div>
      <div class="virus-actions"><button class="post">POST</button><button class="ok">OK</button></div>`;
    document.getElementById("popupLayer").appendChild(el);
    const title = el.querySelector(".virus-title");
    title.onmousedown = (e) => {
      const dx = e.clientX - el.offsetLeft, dy = e.clientY - el.offsetTop;
      const move = (ev) => { el.style.left = (ev.clientX - dx) + "px"; el.style.top = (ev.clientY - dy) + "px"; };
      const up = () => { removeEventListener("mousemove", move); removeEventListener("mouseup", up); };
      addEventListener("mousemove", move);
      addEventListener("mouseup", up);
    };
    el.querySelector(".virus-x").onclick = el.querySelector(".ok").onclick = () => el.remove();
    el.querySelector(".post").onclick = () => { Graffiti.postPopup(t.title); el.remove(); AudioBus.fanfare(); };
    if (Math.random() < 0.25) setTimeout(() => this.spawn(), 400);
  }
};

const Tung = {
  callers: [
    { id: "tung", name: "Tung Tung Tung Sahur", line: "TUNG TUNG TUNG SAHUR", art: "tung", hits: ["TUNG","TUNG","TUNG","SAHUR"] },
    { id: "croc", name: "Bombardiro Crocodilo", line: "he is flying your timer to the sun", art: "croc", hits: ["BOMBA","DIRO","CROCO","DILO"] },
    { id: "cup", name: "Cappuccino Assassino", line: "espresso with a hidden blade", art: "cup", hits: ["CAPPU","CINO","ASSA","SSINO"] }
  ],
  active: null,
  call(who) {
    AudioBus.resume();
    const c = who || this.callers[(Math.random()*this.callers.length)|0];
    this.active = c;
    document.getElementById("callerArt").innerHTML = CHAR[c.art] || CHAR.tung;
    document.getElementById("callerName").textContent = c.name;
    document.getElementById("callerLine").textContent = c.line;
    document.getElementById("callOverlay").classList.remove("hidden");
    document.getElementById("callGame").classList.add("hidden");
    this.ring = setInterval(() => { AudioBus.tungHit(true); AudioBus.tungHit(false); }, 420);
    toast(c.name + " is calling");
    Badge.earn("call");
  },
  decline() { this.end(); toast("declined. he will remember this."); },
  accept() {
    clearInterval(this.ring);
    const c = this.active; if (!c) return this.end();
    const box = document.getElementById("callGame");
    box.classList.remove("hidden");
    let i = 0, score = 0;
    box.innerHTML = `<p>Tap the chant</p><div class="tap-zone">${c.hits.map((h, idx)=>`<button data-i="${idx}">${h}</button>`).join("")}</div><p class="hud" id="tungHud">0</p>`;
    box.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const need = i % c.hits.length;
        if (Number(b.dataset.i) === need) { score++; AudioBus.tungHit(need===3); Dopamine.combo(c.hits[need], "#ffd23a"); }
        else AudioBus.drum("crash");
        i++; document.getElementById("tungHud").textContent = "combo "+score;
        if (score >= 8) { Shop.add(8); Visuals.confetti(); this.end(); toast("chant complete"); }
      };
    });
  },
  end() { clearInterval(this.ring); document.getElementById("callOverlay").classList.add("hidden"); this.active = null; }
};

const Brainrot = {
  on: false,
  boot() {},
  toggle() { this.on = !this.on; toast("Brainrot ambush " + (this.on ? "armed" : "asleep")); },
  ambush() {
    const roll = Math.random();
    if (roll < 0.33) { Tung.call(); return; }
    if (roll < 0.66) { Virus.storm(2); return; }
    const el = document.createElement("div");
    el.className = "ambush";
    el.innerHTML = `${iconHTML("brain","lg")}<b>Ambush minigame</b><p class="hud">tap 5 times before it flees</p><button id="ambTap">TAP</button>`;
    document.body.appendChild(el);
    let n = 0;
    const t = setTimeout(() => el.remove(), 6000);
    el.querySelector("#ambTap").onclick = () => {
      n++; Dopamine.combo("+"+n, "#ff3ec8");
      if (n >= 5) { Shop.add(3); clearTimeout(t); el.remove(); Visuals.nova(); }
    };
  }
};

const Ember = {
  love: Number(localStorage.getItem("tt-love") || 50),
  boot() { this.render(); setInterval(() => { this.love = Math.max(0, this.love - 1); this.save(); this.render(); }, 45000); },
  feed(n) { this.love = Math.min(100, this.love + (n || 10)); this.save(); this.render(); toast("Ember purrs magma"); AudioBus.tone(320,0.2,"triangle","sfx",0.12); },
  play() { this.feed(6); Visuals.nova(); },
  save() { localStorage.setItem("tt-love", String(this.love)); },
  render() {
    const mood = this.love > 75 ? "gilded" : this.love > 40 ? "warm" : this.love > 15 ? "peckish" : "dramatic";
    document.getElementById("dragonMood").textContent = mood;
    document.getElementById("loveStat").innerHTML = iconHTML("love") + " <b>" + this.love + "</b>";
    document.getElementById("dragonFace").innerHTML = CHAR.ember;
  }
};

const Badge = {
  got: JSON.parse(localStorage.getItem("tt-badges") || "{}"),
  list: [
    { id: "start", name: "First tick" }, { id: "finish", name: "Zero hero" }, { id: "arcade", name: "Cabinet kid" },
    { id: "piano", name: "Ivory chaos" }, { id: "karaoke", name: "Hook singer" }, { id: "fanfare", name: "Brass goblin" },
    { id: "virus", name: "Popup survivor" }, { id: "call", name: "Sahur pickup" }, { id: "shop", name: "Kiosk regular" },
    { id: "vault", name: "Memory vault" }, { id: "konami", name: "Warp child" }, { id: "reflex", name: "Green strike" }
  ],
  earn(id) {
    if (this.got[id]) return;
    this.got[id] = true;
    localStorage.setItem("tt-badges", JSON.stringify(this.got));
    const b = this.list.find((x) => x.id === id);
    if (b) toast("Badge: " + b.name);
    this.render();
  },
  render() {
    const n = Object.keys(this.got).length;
    const el = document.getElementById("badgeStat");
    if (el) el.innerHTML = iconHTML("badge") + " <b>" + n + "</b>";
  },
  show() {
    modal(`<h2>Badge Constellation</h2><div class="badge-row">${this.list.map((b)=>`<span class="badge ${this.got[b.id]?"got":""}">${iconHTML("badge")} ${b.name}</span>`).join("")}</div>`);
  }
};

const Streak = {
  boot() {
    const today = new Date().toISOString().slice(0,10);
    const last = localStorage.getItem("tt-day");
    let n = Number(localStorage.getItem("tt-streak") || 0);
    if (last !== today) {
      const y = new Date(Date.now()-86400000).toISOString().slice(0,10);
      n = last === y ? n+1 : 1;
      localStorage.setItem("tt-day", today);
      localStorage.setItem("tt-streak", String(n));
    }
    this.n = Number(localStorage.getItem("tt-streak") || 1);
    document.getElementById("streakStat").innerHTML = iconHTML("streak") + " <b>" + this.n + "</b>";
  }
};

const Boss = {
  start() {
    let hp = 100;
    modal(`<h2>ALARMOTH</h2><div>${CHAR.ember}</div><div class="boss-hp"><span id="bhp"></span></div><p class="hud">click the moth before the beep eats you</p><button id="bhit">SWAT</button>`);
    const bar = document.getElementById("bhp");
    const tick = setInterval(() => AudioBus.tone(880,0.08,"square","sfx",0.1), 250);
    document.getElementById("bhit").onclick = () => {
      hp -= 12 + (Math.random()*8);
      bar.style.width = Math.max(0, hp) + "%";
      Visuals.shake();
      if (hp <= 0) { clearInterval(tick); closeModal(); Shop.add(10); AudioBus.fanfare(); toast("Alarmoth down"); }
    };
  }
};

const Chronos = {
  speak(text) {
    if (!window.speechSynthesis) { toast(text); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 0.4; speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
};

const Fortune = {
  lines: [
    "A popup will teach you more than a calendar.",
    "Feed the dragon before the dragon feeds the clock.",
    "The kiosk knows your real name. It is Tick.",
    "Do not answer Sahur on the third ring unless you can chant.",
    "Graffiti is just a to-do list that learned to shout."
  ],
  crack() { modal(`<h2>Fortune cookie</h2>${iconHTML("cookie","xl")}<p>${this.lines[(Math.random()*this.lines.length)|0]}</p>`); }
};

const Eight = {
  lines: ["YES, BUT LOUDER","ASK EMBER","OUTLOOK GRAFFITI","SAHUR SAYS NO","THE KIOSK SHRUGS","DOUBLE OR NOTHING"],
  ask() { modal(`<h2>Magic 8-Sphere</h2>${iconHTML("eight","xl")}<p>${this.lines[(Math.random()*this.lines.length)|0]}</p>`); }
};

const Konami = {
  seq: [],
  need: ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],
  feed(key) {
    this.seq.push(key);
    this.seq = this.seq.slice(-this.need.length);
    if (this.seq.join() === this.need.join()) {
      document.body.classList.add("disco"); Studio.song("pomo"); Visuals.confetti(); Badge.earn("konami"); toast("WARP GATE OPEN");
    }
  }
};

const Dopamine = {
  combo(text, color) {
    const el = document.getElementById("comboFloat");
    el.style.left = (innerWidth/2 - 40 + Math.random()*80) + "px";
    el.style.top = (innerHeight/3) + "px";
    el.style.color = color || "#ffd23a";
    el.textContent = text;
    el.style.opacity = "1";
    setTimeout(() => el.style.opacity = "0", 500);
  }
};

window.Shop = Shop;
window.Graffiti = Graffiti;
window.Virus = Virus;
window.Tung = Tung;
window.Brainrot = Brainrot;
window.Ember = Ember;
window.Badge = Badge;
window.Streak = Streak;
window.Boss = Boss;
window.Chronos = Chronos;
window.Fortune = Fortune;
window.Eight = Eight;
window.Konami = Konami;
window.Dopamine = Dopamine;
