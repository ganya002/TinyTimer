/* Wire 100 wonders, vector chrome, museum, keys. */
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.style.display = "block";
  clearTimeout(toast._t); toast._t = setTimeout(() => el.style.display = "none", 2200);
}
function modal(html) {
  document.getElementById("modalBox").innerHTML = html + `<p><button class="ghost" onclick="closeModal()">close</button></p>`;
  document.getElementById("modal").classList.add("show");
}
function closeModal() { document.getElementById("modal").classList.remove("show"); }

const ACTIONS = {
  pauseResume() { Engine.pause(); },
  customTimeForge() { Engine.forge(); document.getElementById("minIn").focus(); },
  pomodoroTrinity() { Engine.preset(25*60, "pomodoro"); toast("Trinity: 25 / 5 / 15 ready"); },
  teaCeremony() { Engine.preset(3*60, "oolong"); },
  eggLab() { Engine.preset(8*60, "jammy egg"); },
  stopwatchAscent() { Engine.toggleStopwatch(); },
  tabataInferno() { Engine.toggleTabata(); },
  twinTimerDuel() { Engine.toggleTwin(); },
  worldClockCarousel() { document.getElementById("worldClocks").parentElement.scrollIntoView({ behavior:"smooth" }); },
  alarmSundial() { document.getElementById("alarmTime").focus(); toast("Pick a wake time"); },
  dateHorizon() { document.getElementById("dateIn").focus(); },
  milliMicroscope() { Engine.toggleMillis(); },
  lapChronicle() { Engine.lap(); },
  keyboardNinja() { toast("Space start/pause · R reset · L lap · V virus · T sahur · N chaos"); },
  memoryVault() { Engine.preset(Engine.lastVault, "vault recall"); },
  flipClock() { Engine.setDisplay("flip"); },
  analogAura() { Engine.setDisplay("analog"); },
  binaryBeacon() { Engine.setDisplay("binary"); },
  morseWhisper() { Engine.setDisplay("morse"); },
  romanEmpire() { Engine.setDisplay("roman"); },
  stickerNumerals() { Engine.setDisplay("sticker"); },
  haloRing() { Engine.setDisplay("halo"); },
  hourglassAges() { Engine.setDisplay("hourglass"); },
  pixelRelic() { Engine.setDisplay("pixel"); },
  hypercube() { Engine.setDisplay("cube"); },
  wordClock() { Engine.setDisplay("word"); },
  hexGate() { Engine.setDisplay("hex"); },
  scientificNotation() { Engine.setDisplay("sci"); },
  mirrorverse() { Engine.setDisplay("mirror"); },
  colossusFullscreen() { Engine.setDisplay("colossus"); },
  confettiCannon() { Visuals.confetti(); },
  novaBurst() { Visuals.nova(); },
  earthquakeShake() { Visuals.shake(); },
  discoInferno() { Visuals.disco(); },
  matrixRain() { Visuals.matrix(); },
  lavaLamp() { Visuals.lavaOn(); },
  tidePool() { Visuals.waves(); },
  starfieldWarp() { Visuals.stars(); },
  glitchHex() { Visuals.glitch(); },
  crtHaunting() { Visuals.crt(); },
  fireflyGarden() { Visuals.fliesOn(); },
  luckyEncounter() { Events.fire({ guaranteed: true }); },
  gravityFlip() { Visuals.gravity(); },
  dvdGhost() { Visuals.dvdOn(); },
  virusStorm() { Virus.storm(5); },
  gameSnake() { Arcade.open("gameSnake"); },
  gameBrickDrop() { Arcade.open("gameBrickDrop"); },
  gameFlappy() { Arcade.open("gameFlappy"); },
  gameMemory() { Arcade.open("gameMemory"); },
  gameMoles() { Arcade.open("gameMoles"); },
  gamePong() { Arcade.open("gamePong"); },
  gameBreakout() { Arcade.open("gameBreakout"); },
  gameTicTac() { Arcade.open("gameTicTac"); },
  gameRPS() { Arcade.open("gameRPS"); },
  gameGuess() { Arcade.open("gameGuess"); },
  gameScramble() { Arcade.open("gameScramble"); },
  gameTyping() { Arcade.open("gameTyping"); },
  gameReflex() { Arcade.open("gameReflex"); },
  gameAim() { Arcade.open("gameAim"); },
  gameCookie() { Arcade.open("gameCookie"); },
  gameSlots() { Arcade.open("gameSlots"); },
  gameDice() { Arcade.open("gameDice"); },
  gameCoin() { Arcade.open("gameCoin"); },
  game2048() { Arcade.open("game2048"); },
  gameMines() { Arcade.open("gameMines"); },
  gameHangman() { Arcade.open("gameHangman"); },
  gameTrivia() { Arcade.open("gameTrivia"); },
  gameSimon() { Arcade.open("gameSimon"); },
  gameConnect4() { Arcade.open("gameConnect4"); },
  gameAsteroids() { Arcade.open("gameAsteroids"); },
  chiptuneLead() { Studio.chiptune(); Studio.open(); },
  melodyForge() { Studio.open(); Studio.playMelody(); },
  crystalPiano() { Studio.open(); toast("Crystal piano is live"); },
  thunderDrums() { Studio.open(); AudioBus.drum("kick"); AudioBus.drum("snare"); },
  metroHeart() { Studio.toggleMetronome(); },
  soundscapes() { Studio.soundscape("rain"); },
  lofiClouds() { Studio.toggleLofi(); },
  victoryFanfare() { Studio.fanfare(); },
  songTickTock() { Studio.song("tick"); },
  songFiveMore() { Studio.song("five"); },
  songPomodoro() { Studio.song("pomo"); },
  starGrid() { Studio.open(); Studio.toggleSeq(); },
  mouseTheremin() { Studio.toggleTheremin(); },
  ukuleleStrum() { Studio.uke("C"); },
  oscilloscope() { Studio.open(); Studio.drawViz(); toast("Visualizer listening"); },
  loopPedal() { Studio.toggleLoop(); },
  keyJingles() { Studio.jingles(); },
  volumeMixer() { Studio.open(); document.getElementById("volMusic").focus(); },
  fortuneCookie() { Fortune.crack(); },
  magic8() { Eight.ask(); },
  emberDragon() { Ember.feed(8); Ember.play(); },
  badgeConstellation() { Badge.show(); },
  dailyStreak() { toast("Streak flame: " + Streak.n + " day(s)"); },
  bossAlarmoth() { Boss.start(); },
  konamiGate() { toast("Enter Up Up Down Down Left Right Left Right B A"); },
  sideShop() { Shop.toggle(); },
  tungCall() { Tung.call(Tung.callers[0]); },
  brainrotAmbush() { Brainrot.toggle(); Brainrot.ambush(); },
  chaosDice() { Chaos.dice(); },
  museumWonders() { document.getElementById("museum").scrollIntoView({ behavior:"smooth" }); }
};

const Chaos = {
  dice() {
    const pool = CHAOS_FEATURES.filter((f) => f.action !== "chaosDice" && Progress.has(f.action));
    if (!pool.length) { toast("nothing unlocked to roll yet"); return; }
    const f = pool[(Math.random()*pool.length)|0];
    toast("Chaos dice: " + f.name);
    launch(f.action);
  }
};

function launch(action) {
  AudioBus.resume();
  if (!Progress.has(action)) {
    toast("still locked");
    return false;
  }
  const fn = ACTIONS[action];
  if (!fn) { toast("missing action " + action); return false; }
  fn();
  return true;
}

function buildChrome() {
  document.getElementById("brandMark").innerHTML = iconHTML("flame", "lg");
  document.getElementById("shopBtn").innerHTML = iconHTML("shop") + " Shop";
  document.getElementById("shopClose").innerHTML = iconHTML("close") + " Close";
  document.getElementById("shopHead").innerHTML = iconHTML("shop") + " Side Street Shop";
  document.getElementById("btnAcceptCall").innerHTML = iconHTML("accept") + " Accept";
  document.getElementById("btnDeclineCall").innerHTML = iconHTML("decline") + " Decline";

  document.getElementById("mainControls").innerHTML = `
    <button id="btnStart">Start</button>
    <button class="ghost locked-ui" id="btnPause" data-unlock="pauseResume">Pause</button>
    <button class="ghost" id="btnReset">Reset</button>
    <button class="gold locked-ui" id="btnLap" data-unlock="lapChronicle">Lap</button>
    <input class="locked-ui" id="minIn" data-unlock="customTimeForge" type="number" min="0" max="999" value="5" style="width:72px" aria-label="minutes" />
    <span class="locked-ui" data-unlock="customTimeForge">:</span>
    <input class="locked-ui" id="secIn" data-unlock="customTimeForge" type="number" min="0" max="59" value="0" style="width:72px" aria-label="seconds" />
    <button class="ghost locked-ui" id="btnForge" data-unlock="customTimeForge">Forge</button>`;

  document.getElementById("presetRow").innerHTML = [
    [25*60,"pomodoro","tomato","25","pomodoroTrinity"],[5*60,"short break","tea","5","pomodoroTrinity"],[15*60,"long break","flame","15","pomodoroTrinity"],
    [2*60,"green tea","tea","green","teaCeremony"],[4*60,"black tea","tea","black","teaCeremony"],[3*60,"oolong","tea","oolong","teaCeremony"],
    [5*60,"herbal","tea","herbal","teaCeremony"],[6*60,"soft egg","egg","soft","eggLab"],[8*60,"jammy egg","egg","jammy","eggLab"],[12*60,"hard egg","egg","hard","eggLab"]
  ].map(([sec,name,ic,label,need]) => `<button class="ghost locked-ui" data-unlock="${need}" data-sec="${sec}" data-name="${name}">${iconHTML(ic)} ${label}</button>`).join("");

  document.getElementById("modeRow").innerHTML = `
    <button class="ghost locked-ui" id="btnSw" data-unlock="stopwatchAscent">${iconHTML("stopwatch")} Stopwatch</button>
    <button class="ghost locked-ui" id="btnTab" data-unlock="tabataInferno">${iconHTML("flame")} Tabata</button>
    <button class="ghost locked-ui" id="btnMs" data-unlock="milliMicroscope">${iconHTML("scope")} ms</button>
    <button class="ghost locked-ui" id="btnTwin" data-unlock="twinTimerDuel">${iconHTML("swords")} Twin Duel</button>
    <button class="lime locked-ui" id="btnChaos" data-unlock="chaosDice">${iconHTML("chaos")} Chaos Dice</button>
    <button class="mag locked-ui" id="btnArcade" data-unlock-cat="game">${iconHTML("boss")} Arcade</button>
    <button class="gold locked-ui" id="btnStudio" data-unlock-cat="music">${iconHTML("mic")} Studio</button>
    <button class="ghost locked-ui" id="btnVirus" data-unlock="virusStorm">${iconHTML("virus")} Popups</button>
    <button class="ghost locked-ui" id="btnTung" data-unlock="tungCall">${iconHTML("tung")} Sahur</button>`;

  document.getElementById("worldTitle").innerHTML = iconHTML("globe") + " World Clock Carousel";
  document.getElementById("alarmTitle").innerHTML = iconHTML("alarm") + " Alarm Sundial";
  document.getElementById("dateTitle").innerHTML = iconHTML("calendar") + " Date Horizon";
  document.getElementById("lapTitle").innerHTML = iconHTML("flag") + " Lap Chronicle";
  document.getElementById("arcadeTitle").innerHTML = iconHTML("boss") + " Arcade Cabinet";
  document.getElementById("museumTitle").innerHTML = iconHTML("museum") + " Museum of 100 Wonders";

  document.getElementById("studioHead").innerHTML = `
    ${iconHTML("mic")}<h2 class="sec-title">Chronos Studio</h2>
    <button data-song="tick">Tick Tock Forever</button>
    <button data-song="five">Five More Minutes</button>
    <button class="mag" data-song="pomo">Pomodoro Power</button>
    <button class="ghost" id="btnFan">${iconHTML("fanfare")} Fanfare</button>
    <button class="ghost" id="btnLofi">${iconHTML("lofi")} Lo-fi</button>
    <button class="ghost" id="btnStopSong">Stop</button>`;

  document.getElementById("studioTools").innerHTML = `
    <label>BPM <input id="bpm" type="range" min="40" max="200" value="120" /></label>
    <button class="ghost" id="btnMetro">${iconHTML("metro")} Metronome</button>
    <button class="ghost" data-sc="rain">${iconHTML("rain")} Rain</button>
    <button class="ghost" data-sc="cafe">Cafe</button>
    <button class="ghost" data-sc="forest">Forest</button>
    <button class="ghost" data-sc="waves">${iconHTML("wave")} Waves</button>
    <button class="ghost" id="btnTher">${iconHTML("theremin")} Theremin</button>
    <button class="ghost" data-uke="C">${iconHTML("uke")} C</button>
    <button class="ghost" data-uke="G">G</button>
    <button class="ghost" data-uke="Am">Am</button>
    <button class="ghost" data-uke="F">F</button>
    <button class="ghost" id="btnLoop">${iconHTML("loop")} Loop Pedal</button>`;

  bindUi();
  Progress.apply();
}

function bindUi() {
  document.getElementById("btnStart").onclick = () => Engine.start();
  document.getElementById("btnPause").onclick = () => Engine.pause();
  document.getElementById("btnReset").onclick = () => Engine.reset();
  document.getElementById("btnLap").onclick = () => Engine.lap();
  document.getElementById("btnForge").onclick = () => Engine.forge();
  document.getElementById("presetRow").onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    Engine.preset(Number(b.dataset.sec), b.dataset.name);
  };
  document.getElementById("btnSw").onclick = () => Engine.toggleStopwatch();
  document.getElementById("btnTab").onclick = () => Engine.toggleTabata();
  document.getElementById("btnMs").onclick = () => Engine.toggleMillis();
  document.getElementById("btnTwin").onclick = () => Engine.toggleTwin();
  document.getElementById("btnChaos").onclick = () => Chaos.dice();
  document.getElementById("btnArcade").onclick = () => Arcade.openPicker();
  document.getElementById("btnStudio").onclick = () => Studio.open();
  document.getElementById("btnVirus").onclick = () => Virus.storm(5);
  document.getElementById("btnTung").onclick = () => Tung.call(Tung.callers[0]);
  document.getElementById("btnStartB").onclick = () => Engine.startB();
  document.getElementById("btnResetB").onclick = () => Engine.resetB();
  document.getElementById("btnArm").onclick = () => Engine.setAlarm();
  document.getElementById("btnHorizon").onclick = () => Engine.setHorizon();
  document.getElementById("btnPlayGame").onclick = () => Arcade.launchSelected();
  document.getElementById("btnCloseGame").onclick = () => Arcade.close();
  document.getElementById("shopBtn").onclick = () => Shop.toggle();
  document.getElementById("shopClose").onclick = () => Shop.close();
  document.getElementById("petChip").onclick = () => Ember.play();
  document.getElementById("btnAcceptCall").onclick = () => Tung.accept();
  document.getElementById("btnDeclineCall").onclick = () => Tung.decline();
  document.getElementById("btnPreviewMelody").onclick = () => Studio.playMelody();
  document.getElementById("studioHead").onclick = (e) => {
    const s = e.target.closest("[data-song]"); if (s) Studio.song(s.dataset.song);
    if (e.target.closest("#btnFan")) Studio.fanfare();
    if (e.target.closest("#btnLofi")) Studio.toggleLofi();
    if (e.target.closest("#btnStopSong")) Studio.stop();
  };
  document.getElementById("studioTools").onclick = (e) => {
    const sc = e.target.closest("[data-sc]"); if (sc) Studio.soundscape(sc.dataset.sc);
    const uk = e.target.closest("[data-uke]"); if (uk) Studio.uke(uk.dataset.uke);
    if (e.target.closest("#btnMetro")) Studio.toggleMetronome();
    if (e.target.closest("#btnTher")) Studio.toggleTheremin();
    if (e.target.closest("#btnLoop")) Studio.toggleLoop();
  };
}

function buildMuseum() {
  const cats = ["all","timer","display","visual","game","music","insane"];
  document.getElementById("filters").innerHTML = cats.map((c) => `<button class="ghost ${c==="all"?"active":""}" data-cat="${c}">${c}</button>`).join("");
  let cat = "all", q = "";
  function draw() {
    const list = CHAOS_FEATURES.filter((f) => (cat==="all"||f.cat===cat) && (f.name+" "+f.blurb).toLowerCase().includes(q));
    const open = list.filter((f) => Progress.has(f.action)).length;
    document.getElementById("museumCount").textContent = open + " / " + list.length + " wonders unlocked in this filter";
    document.getElementById("featureGrid").innerHTML = list.map((f) => {
      const on = Progress.has(f.action);
      return `<button class="feat ${on ? "" : "is-locked"}" data-action="${f.action}" ${on ? "" : "disabled"}>
        ${on ? iconHTML(f.icon) : iconHTML("vault")}
        <div class="id">#${String(f.id).padStart(3,"0")}</div>
        <h3>${on ? f.name : "Locked"}</h3>
        <p>${on ? f.blurb : "Keep playing. Random events peel this open."}</p>
        <span class="cat">${f.cat}</span>
      </button>`;
    }).join("");
  }
  document.getElementById("filters").onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    cat = b.dataset.cat;
    [...document.getElementById("filters").children].forEach((x) => x.classList.toggle("active", x===b));
    draw();
  };
  document.getElementById("museumSearch").oninput = (e) => { q = e.target.value.toLowerCase(); draw(); };
  document.getElementById("featureGrid").onclick = (e) => {
    const b = e.target.closest(".feat"); if (!b) return;
    launch(b.dataset.action);
  };
  draw();
}

function keys() {
  addEventListener("keydown", (e) => {
    if (["INPUT","TEXTAREA"].includes(e.target.tagName)) return;
    Konami.feed(e.key);
    if (Studio.jinglesOn && "12345678".includes(e.key)) {
      AudioBus.tone(330 * Math.pow(2, (Number(e.key)-1)/12), 0.2, "sine", "sfx", 0.12);
    }
    if (e.code === "Space") { e.preventDefault(); if (Progress.has("pauseResume")) Engine.pause(); else Engine.start(); }
    if (e.key === "r" || e.key === "R") Engine.reset();
    if ((e.key === "l" || e.key === "L") && Progress.has("lapChronicle")) Engine.lap();
    if ((e.key === "v" || e.key === "V") && Progress.has("virusStorm")) Virus.storm(3);
    if ((e.key === "t" || e.key === "T") && Progress.has("tungCall")) Tung.call(Tung.callers[0]);
    if ((e.key === "n" || e.key === "N") && Progress.has("chaosDice")) Chaos.dice();
  });
}

window.launchFeature = launch;
window.Chaos = Chaos;
window.ACTIONS = ACTIONS;
window.toast = toast;
window.closeModal = closeModal;
window.modal = modal;
window.buildMuseum = buildMuseum;

window.verifyChaos = function () {
  const ids = CHAOS_FEATURES.map((f) => f.id);
  const names = CHAOS_FEATURES.map((f) => f.name);
  const acts = CHAOS_FEATURES.map((f) => f.action);
  const missing = acts.filter((a) => typeof ACTIONS[a] !== "function");
  const iconMiss = CHAOS_FEATURES.filter((f) => !ICONS[f.icon]).map((f) => f.icon);
  return {
    count: CHAOS_FEATURES.length,
    uniqueIds: new Set(ids).size,
    uniqueNames: new Set(names).size,
    uniqueActions: new Set(acts).size,
    missingActions: missing,
    missingIcons: iconMiss
  };
};

document.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  Progress.boot();
  Engine.boot();
  Visuals.boot();
  Arcade.boot();
  Studio.boot();
  Shop.boot();
  Ember.boot();
  Badge.render();
  Streak.boot();
  Events.boot();
  buildMuseum();
  keys();
  Progress.apply();
  setInterval(() => { if (Progress.has("oscilloscope")) Studio.drawViz(); }, 80);
  const v = window.verifyChaos();
  console.info("TinyTimer Chaos verify", v);
});
