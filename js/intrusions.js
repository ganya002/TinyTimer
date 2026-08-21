/* Uninvited interruptions. They find you. You do not start them. */
const Intrusions = {
  host() { return document.getElementById("popupLayer"); },
  beep(f, d) { if (window.AudioBus) { AudioBus.resume(); AudioBus.tone(f, d || 0.12, "square", "sfx", 0.12); } },
  layer(html, cls) {
    const el = document.createElement("div");
    el.className = "intrude " + (cls || "");
    el.innerHTML = html;
    this.host().appendChild(el);
    return el;
  },
  unlocked() {
    const n = Progress.count();
    const all = [
      { min: 2, fn: () => this.consent() },
      { min: 3, fn: () => this.sms() },
      { min: 4, fn: () => this.notifs() },
      { min: 4, fn: () => this.clippy() },
      { min: 5, fn: () => this.update() },
      { min: 5, fn: () => this.rate() },
      { min: 6, fn: () => this.bsod() },
      { min: 6, fn: () => this.download() },
      { min: 7, fn: () => this.zoom() },
      { min: 7, fn: () => this.captcha() },
      { min: 8, fn: () => this.news() },
      { min: 8, fn: () => this.battery() },
      { min: 9, fn: () => this.typing() },
      { min: 9, fn: () => this.twofa() },
      { min: 10, fn: () => this.mom() },
      { min: 10, fn: () => this.delivery() },
      { min: 11, fn: () => this.stillThere() },
      { min: 12, fn: () => this.unbox() },
      { min: 12, fn: () => this.invert() },
      { min: 13, fn: () => this.printer() },
      { min: 14, fn: () => this.chain() },
      { min: 15, fn: () => this.meteor() }
    ];
    return all.filter((e) => n >= e.min).map((e) => e.fn);
  },

  consent() {
    let n = 0;
    const el = this.layer(`<div class="consent-box">
      <b>We value your seconds</b>
      <p>This timer uses cookies, ticks, and one (1) dragon. Accept to continue existing.</p>
      <div class="row"><button class="ok">Accept all</button><button class="ghost no">Reject</button></div>
    </div>`, "center-card");
    const again = () => {
      n++;
      el.querySelector("p").textContent = n < 4
        ? "You must accept. The cookie is already in the jar. Accept " + (4 - n) + " more times."
        : "Fine. Have a tick.";
      if (n >= 4) { Shop.add(1); el.remove(); }
    };
    el.querySelector(".ok").onclick = again;
    el.querySelector(".no").onclick = again;
    this.beep(220);
  },

  sms() {
    const lines = [
      ["UNKNOWN", "is the timer still running or are YOU the timer"],
      ["EMBER", "feed me or I eat the minutes"],
      ["SAHUR", "tung tung tung. pick up."],
      ["BANK OF TICKS", "unusual activity: you clicked Start"]
    ];
    const [from, body] = lines[(Math.random() * lines.length) | 0];
    const el = this.layer(`<div class="sms">
      <div class="sms-from">${iconHTML("phone")} ${from}</div>
      <p>${body}</p>
      <button class="ghost">Leave on read</button>
    </div>`);
    el.style.left = "16px"; el.style.bottom = "16px"; el.style.top = "auto";
    el.querySelector("button").onclick = () => el.remove();
    this.beep(880, 0.08); this.beep(660, 0.1);
  },

  notifs() {
    const msgs = ["Timer liked your countdown", "Ember poked you", "New voicemail from Sahur", "Your streak is judging you", "1 new wormhole"];
    msgs.forEach((m, i) => setTimeout(() => {
      const el = this.layer(`<div class="sys-note">${iconHTML("bell")} ${m}</div>`);
      el.style.right = "12px"; el.style.top = (12 + i * 58) + "px"; el.style.left = "auto";
      setTimeout(() => el.remove(), 4200);
    }, i * 240));
    this.beep(1400, 0.05);
  },

  clippy() {
    const el = this.layer(`<div class="clippy">
      ${iconHTML("trivia", "lg")}
      <p>It looks like you're trying to wait. Need help waiting harder?</p>
      <div class="row"><button class="ok">Yes</button><button class="ghost">Go away</button></div>
    </div>`);
    el.style.right = "20px"; el.style.bottom = "20px"; el.style.top = "auto"; el.style.left = "auto";
    el.querySelector(".ok").onclick = () => { toast("help is not coming"); el.remove(); };
    el.querySelector(".ghost").onclick = () => el.remove();
    this.beep(500);
  },

  update() {
    const el = this.layer(`<div class="win-update">
      <b>Important update</b>
      <p>TinyTimer 95 is ready. Restart now or postpone into the heat death of the universe.</p>
      <div class="row"><button class="ok">Restart now</button><button class="ghost">Postpone</button></div>
    </div>`, "center-card");
    el.querySelector(".ok").onclick = () => { Visuals.shake(); toast("restarted nothing"); el.remove(); };
    el.querySelector(".ghost").onclick = () => el.remove();
    this.beep(180, 0.2);
  },

  rate() {
    const el = this.layer(`<div class="rate-box">
      <b>Rate this waiting</b>
      <p>How was your last second?</p>
      <div class="row stars"></div>
    </div>`, "center-card");
    const row = el.querySelector(".stars");
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.textContent = i;
      b.onclick = () => { toast(i <= 2 ? "the timer will remember this" : "five stars stored in a jar"); Shop.add(i === 5 ? 2 : 0); el.remove(); };
      row.appendChild(b);
    }
  },

  bsod() {
    const el = this.layer(`<div class="bsod">
      <div>:(</div>
      <p>TINYTIMER ran into a problem and needs to collect your seconds.</p>
      <p class="hud">Stop code: CLOCK_WATCHED_YOU_BACK</p>
      <button>Tap to boot anyway</button>
    </div>`, "full");
    el.querySelector("button").onclick = () => el.remove();
    AudioBus.resume(); AudioBus.tone(90, 0.4, "sawtooth", "sfx", 0.18);
    setTimeout(() => el.remove(), 8000);
  },

  download() {
    const el = this.layer(`<div class="dl">
      <b>Downloading sahur_real_final.mp3</b>
      <div class="dl-bar"><span></span></div>
      <p class="hud" id="dlpct">1%</p>
    </div>`);
    el.style.right = "16px"; el.style.bottom = "16px"; el.style.top = "auto"; el.style.left = "auto";
    let p = 1;
    const id = setInterval(() => {
      p += 7 + ((Math.random() * 10) | 0);
      if (p > 99) p = 99;
      el.querySelector("span").style.width = p + "%";
      el.querySelector("#dlpct").textContent = p + "% · do not close this tab";
      if (p >= 99) { clearInterval(id); el.querySelector("#dlpct").textContent = "failed: file was a wooden bat"; setTimeout(() => el.remove(), 1800); }
    }, 280);
    this.beep(300);
  },

  zoom() {
    const el = this.layer(`<div class="zoom">
      ${iconHTML("mic", "lg")}
      <b>Chronos is presenting</b>
      <p>You are muted. The timer can still hear you think.</p>
      <div class="row"><button class="ok">Join with ticks</button><button class="ghost">Leave</button></div>
    </div>`, "center-card");
    el.querySelector(".ok").onclick = () => { toast("you said nothing"); el.remove(); };
    el.querySelector(".ghost").onclick = () => el.remove();
    this.beep(740); this.beep(740);
  },

  captcha() {
    const el = this.layer(`<div class="cap">
      <b>Select every clock that is lying</b>
      <div class="cap-grid"></div>
      <button class="ok">Verify</button>
    </div>`, "center-card");
    const g = el.querySelector(".cap-grid");
    let picked = 0;
    for (let i = 0; i < 9; i++) {
      const c = document.createElement("button");
      c.className = "ghost cap-cell";
      c.innerHTML = iconHTML(i % 3 === 0 ? "alarm" : i % 2 ? "stopwatch" : "egg");
      c.onclick = () => { c.classList.toggle("on"); picked += c.classList.contains("on") ? 1 : -1; };
      g.appendChild(c);
    }
    el.querySelector(".ok").onclick = () => {
      toast(picked ? "robot status: inconclusive" : "you selected nothing. suspicious.");
      el.remove();
    };
  },

  news() {
    const el = this.layer(`<div class="ticker">BREAKING: local timer still counting · Sahur seen near the kiosk · scientists confirm five more minutes is a country · Ember ate a second ·</div>`, "ticker-wrap");
    AudioBus.resume(); AudioBus.tone(200, 0.05, "square", "sfx", 0.08);
    setTimeout(() => el.remove(), 9000);
  },

  battery() {
    const el = this.layer(`<div class="batt">
      ${iconHTML("bolt")} <b>10% waiting remaining</b>
      <p>Low patience mode. Plug into a snack or continue anyway.</p>
      <button class="ghost">Continue</button>
    </div>`, "center-card");
    el.querySelector("button").onclick = () => el.remove();
    this.beep(160, 0.25);
  },

  typing() {
    const el = this.layer(`<div class="sms"><div class="sms-from">Sahur</div><p class="dots">is typing</p></div>`);
    el.style.left = "16px"; el.style.bottom = "80px"; el.style.top = "auto";
    setTimeout(() => { el.querySelector(".dots").textContent = "stopped typing. coward."; setTimeout(() => el.remove(), 2000); }, 2600);
    this.beep(900, 0.05);
  },

  twofa() {
    const code = String(100000 + ((Math.random() * 900000) | 0));
    const el = this.layer(`<div class="twofa">
      <b>Two-factor waiting</b>
      <p>Enter the code we just did not send: hint it is ${code}</p>
      <input id="fa" maxlength="6" />
      <button class="ok">Confirm</button>
    </div>`, "center-card");
    el.querySelector("button").onclick = () => {
      const ok = el.querySelector("#fa").value === code;
      toast(ok ? "identity: timer" : "wrong. you may still wait.");
      el.remove();
    };
  },

  mom() {
    const el = this.layer(`<div class="call-lite">
      ${iconHTML("phone", "lg")}
      <b>Mom</b>
      <p>incoming · she knows the timer is open</p>
      <div class="row"><button class="lime">Accept</button><button class="mag">Decline</button></div>
    </div>`, "center-card");
    el.querySelector(".lime").onclick = () => { toast("she says eat something"); Chronos.speak("Did you eat?"); el.remove(); };
    el.querySelector(".mag").onclick = () => { toast("she will call the landline"); el.remove(); };
    this.beep(520); setTimeout(() => this.beep(520), 400);
  },

  delivery() {
    const el = this.layer(`<div class="sms">
      <div class="sms-from">DOOR</div>
      <p>Your package (1 wooden bat, slightly used) is 30 seconds away.</p>
      <button class="ghost">I did not order this</button>
    </div>`);
    el.style.right = "16px"; el.style.bottom = "16px"; el.style.top = "auto"; el.style.left = "auto";
    el.querySelector("button").onclick = () => el.remove();
    this.beep(600);
  },

  stillThere() {
    const el = this.layer(`<div class="still">
      <b>Are you still waiting?</b>
      <p>Press continue or we will pause your whole personality.</p>
      <button class="ok">I'm still here</button>
    </div>`, "center-card");
    const t = setTimeout(() => { toast("personality paused"); el.remove(); }, 5000);
    el.querySelector("button").onclick = () => { clearTimeout(t); el.remove(); };
  },

  unbox() {
    Visuals.confetti();
    toast("You unboxed: common second");
    this.beep(1046, 0.15);
  },

  invert() {
    document.body.style.filter = "invert(1) hue-rotate(40deg)";
    toast("colors filed a complaint");
    setTimeout(() => { document.body.style.filter = ""; }, 1800);
    Visuals.shake();
  },

  printer() {
    const el = this.layer(`<div class="virus-win" style="position:relative">
      <div class="virus-title">Print Manager<button class="virus-x">X</button></div>
      <div class="virus-body">PC LOAD LETTER. Also the timer jammed.</div>
      <div class="virus-actions"><button class="ok">OK</button></div>
    </div>`, "center-card");
    el.querySelectorAll("button").forEach((b) => b.onclick = () => el.remove());
    this.beep(110, 0.3);
  },

  chain() {
    const el = this.layer(`<div class="mail">
      <b>FWD: FWD: FWD: DO NOT BREAK THIS TIMER</b>
      <p>Send this countdown to 7 friends or the sand will go up. This is not a threat it is a vibe.</p>
      <button class="ghost">Delete</button>
    </div>`, "center-card");
    el.querySelector("button").onclick = () => el.remove();
  },

  meteor() {
    Visuals.shake();
    const el = this.layer(`<div class="meteor">METEOR WARNING · a rock named Tuesday · impact in your next lap</div>`, "ticker-wrap");
    AudioBus.resume(); AudioBus.tone(80, 0.5, "sawtooth", "sfx", 0.2);
    setTimeout(() => el.remove(), 5000);
  }
};

window.Intrusions = Intrusions;
