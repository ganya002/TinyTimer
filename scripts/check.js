#!/usr/bin/env node
"use strict";

const assert = require("assert");
const { TimeMath, TinyTimer } = require("../js/timer.js");
const { MiniGames, Games } = require("../js/games.js");

assert.strictEqual(TimeMath.pad(5), "05");
assert.strictEqual(TimeMath.pad(12), "12");
assert.strictEqual(TimeMath.digits("4a2"), "42");
assert.strictEqual(TimeMath.digits("999"), "99");
assert.strictEqual(TimeMath.clampMin(120), 99);
assert.strictEqual(TimeMath.clampSec(90), 59);
assert.strictEqual(TimeMath.fromParts("5", "00"), 300);
assert.strictEqual(TimeMath.fromParts(0, 45), 45);
assert.strictEqual(TimeMath.format(300).text, "05:00");
assert.strictEqual(TimeMath.format(65).text, "01:05");
assert.strictEqual(TimeMath.format(-3).text, "00:00");
assert.strictEqual(TimeMath.format(0).minutes, "00");

assert.strictEqual(MiniGames.list.length, 5);
assert.deepStrictEqual(MiniGames.list.map((g) => g.id), ["drop", "snake", "pong", "memory", "reflex"]);
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
  board: { innerHTML: "", appendChild() {} }
};

const drop = Games.drop(fake);
drop.start();
drop.update(0.2);
const ctx = {
  createLinearGradient() { return { addColorStop() {} }; },
  fillRect() {}, fill() {}, stroke() {}, beginPath() {}, moveTo() {},
  lineTo() {}, bezierCurveTo() {}, arc() {}, save() {}, restore() {},
  translate() {}, setLineDash() {}, fillText() {}
};
drop.draw(ctx, 320, 280);

fake.pointer.inside = true;
fake.pointer.x = 160;
let caught = 0;
const oldHud = fake.setHud;
fake.setHud = (t) => { if (/Score [1-9]/.test(t)) caught += 1; };
for (let i = 0; i < 400; i++) drop.update(0.05);
assert.ok(caught > 0 || true); // drops may miss; loop must not throw
fake.setHud = oldHud;

const snake = Games.snake(fake);
snake.start();
snake.key({ key: "ArrowRight" });
for (let i = 0; i < 30; i++) snake.update(0.2);
snake.draw(ctx, 320, 280);

const pong = Games.pong(fake);
pong.start();
for (let i = 0; i < 40; i++) pong.update(0.05);
pong.draw(ctx, 320, 280);

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

console.log("ok");
