#!/usr/bin/env node
"use strict";

const assert = require("assert");
const { TimeMath, TinyTimer } = require("../js/timer.js");
const { MiniGames, Games } = require("../js/games.js");
const { RECIPES, SITE_THEMES, recipeMatch, countsFromGrid, pickDrop, Workshop } = require("../js/workshop.js");
const { TILE, generateWorld } = require("../js/terraria.js");

assert.strictEqual(TimeMath.format(300).text, "05:00");
assert.strictEqual(TimeMath.fromParts("5", "00"), 300);
assert.strictEqual(TimeMath.clampSec(90), 59);

assert.strictEqual(MiniGames.list.length, 5);
["drop", "snake", "pong", "memory", "reflex"].forEach((id) => {
  assert.strictEqual(typeof Games[id], "function");
});

const fake = {
  size: { w: 320, h: 280 },
  scores: {},
  setHud() {},
  record(id, score) { this.scores[id] = score; return score; },
  axis() { return { x: 0, y: 0 }; },
  pointer: { x: 160, y: 140, down: false, inside: false },
  keys: {},
  board: { innerHTML: "", appendChild() {} },
  testX: 160,
  restart() { this.restarted = true; }
};

const ctx = {
  createLinearGradient() { return { addColorStop() {} }; },
  fillRect() {}, fill() {}, stroke() {}, beginPath() {}, moveTo() {},
  lineTo() {}, bezierCurveTo() {}, arc() {}, save() {}, restore() {},
  translate() {}, setLineDash() {}, fillText() {}
};

fake.pointer.inside = true;
fake.pointer.x = 160;
const drop = Games.drop(fake);
drop.start();
let caught = 0;
fake.setHud = (t) => { if (/Score [1-9]/.test(t)) caught += 1; };
for (let i = 0; i < 120; i++) drop.update(0.05);
assert.ok(caught > 0, "centered drops should be catchable");
drop.draw(ctx, 320, 280);

const snake = Games.snake(fake);
snake.start();
snake.key({ key: "ArrowUp" });
for (let i = 0; i < 8; i++) snake.update(0.2);
snake.draw(ctx, 320, 280);
fake.restarted = false;
snake.pointer("down");

const pong = Games.pong(fake);
pong.start();
for (let i = 0; i < 40; i++) pong.update(0.05);
pong.draw(ctx, 320, 280);

assert.strictEqual(recipeMatch({ wood: 4 }, RECIPES.find((r) => r.id === "table")), true);
assert.strictEqual(recipeMatch({ wood: 3 }, RECIPES.find((r) => r.id === "table")), false);
assert.strictEqual(recipeMatch({ obsidian: 8, star: 1 }, RECIPES.find((r) => r.id === "portal")), true);
assert.deepStrictEqual(countsFromGrid(["wood", "wood", null, "stick"]), { wood: 2, stick: 1 });

const drops = new Set();
for (let i = 0; i < 200; i++) drops.add(pickDrop(() => (i % 100) / 100));
assert.ok(drops.has("wood"));
assert.ok(SITE_THEMES.length >= 12);
assert.ok(SITE_THEMES.filter((t) => t.url.startsWith("http")).length >= 8);

Workshop.inventory = { wood: 4 };
assert.ok(recipeMatch(Workshop.inventory, RECIPES.find((r) => r.id === "table")));
Workshop.add("cobble", 2);
assert.strictEqual(Workshop.inventory.cobble, 2);
assert.strictEqual(Workshop.take("cobble", 1), true);
assert.strictEqual(Workshop.inventory.cobble, 1);
assert.strictEqual(Workshop.hitsNeeded(), 4);
Workshop.flags.pick = 3;
assert.strictEqual(Workshop.hitsNeeded(), 1);

const world = generateWorld(48, 24, 42);
assert.strictEqual(world.tiles.length, 48 * 24);
let solid = 0, air = 0, ore = 0;
for (let i = 0; i < world.tiles.length; i++) {
  const t = world.tiles[i];
  if (t === TILE.air) air++;
  else solid++;
  if (t === TILE.iron || t === TILE.gold) ore++;
}
assert.ok(air > 50, "world has sky/caves");
assert.ok(solid > 50, "world has ground");
assert.ok(ore > 0, "world has ore");
assert.strictEqual(world.get(-1, 10), TILE.stone);
assert.ok(world.surface.length === 48);

function fakeEl(value) {
  return {
    value,
    listeners: {},
    addEventListener(type, fn) { this.listeners[type] = fn; },
    focus() {},
    select() {},
    setAttribute() {},
    get options() { return [{ value: "300" }, { value: "60" }, { value: "custom" }]; }
  };
}

const minutes = fakeEl("05");
const seconds = fakeEl("00");
const start = fakeEl("");
start.textContent = "Start";
const reset = fakeEl("");
const preset = fakeEl("300");
preset.value = "300";
const status = fakeEl("");
status.textContent = "";
global.document = { activeElement: null };
TinyTimer.mount({ minutes, seconds, start, reset, preset, status });
start.listeners.click();
assert.strictEqual(TinyTimer.running, true);
start.listeners.click();
assert.strictEqual(TinyTimer.running, false);
reset.listeners.click();
assert.strictEqual(TinyTimer.remaining, TinyTimer.duration);
preset.value = "60";
preset.listeners.change();
assert.strictEqual(TinyTimer.remaining, 60);
minutes.value = "02";
seconds.value = "10";
minutes.listeners.change();
assert.strictEqual(TinyTimer.remaining, 130);

console.log("ok");
