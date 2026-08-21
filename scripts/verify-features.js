#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(read("js/catalog.js"), ctx);

const features = ctx.window.CHAOS_FEATURES;
const errors = [];
if (!Array.isArray(features) || features.length !== 100) {
  errors.push("expected 100 features, got " + (features && features.length));
}
const ids = features.map((f) => f.id);
const names = features.map((f) => f.name);
const actions = features.map((f) => f.action);
const icons = features.map((f) => f.icon);
if (new Set(ids).size !== 100) errors.push("duplicate ids");
if (new Set(names).size !== 100) errors.push("duplicate names");
if (new Set(actions).size !== 100) errors.push("duplicate actions");
if (ids.some((id, i) => id !== i + 1)) errors.push("ids are not 1..100 in order");

const app = read("js/app.js");
const missingActions = actions.filter((a) => !app.includes(a + "()"));
if (missingActions.length) errors.push("unwired actions: " + missingActions.join(", "));

const iconSrc = read("js/icons.js");
const missingIcons = [...new Set(icons)].filter((k) => !iconSrc.includes(k + ":"));
if (missingIcons.length) errors.push("missing icons: " + missingIcons.join(", "));

const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;
const scan = ["index.html","README.md","FEATURES.md","css/chaos.css","js/catalog.js","js/icons.js","js/audio.js","js/timer.js","js/visuals.js","js/games.js","js/music.js","js/insane.js","js/app.js"];
for (const p of scan) {
  const txt = read(p);
  if (emoji.test(txt)) errors.push("emoji found in " + p);
}

if (errors.length) {
  console.error("FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("OK 100 unique features, wired actions, vector icons, no emoji");
