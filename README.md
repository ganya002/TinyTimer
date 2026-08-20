# TinyTimer Chaos Edition

A fork of TinyTimer that keeps the countdown at the center of the page, then rings it with 100 distinct wonders: arcade games, original songs, graffiti, fake virus popups, a side-street shop, and a Tung Tung Tung Sahur incoming call.

Open `index.html` in a browser. No build step. No emoji. Every icon is original vector sticker art (soot outlines, magma fills).

## The main event

The timer is still the stage. Start, pause, forge a duration, use tea/egg/pomodoro presets.

## Side pieces (not the homepage)

- **Side Street Shop** — a curb kiosk. Spend ticks earned from finishing timers and games. Cosmetics and snacks. It never replaces the clock.
- **Graffiti spray wall** — drag to tag. Virus windows have a **POST** button that stamps their title onto the wall.
- **Virus popup storm** — fake 90s malware you close or POST. Parody only.
- **Tung Tung Tung Sahur call** — he can ring you. Accept and tap the chant, or decline and live with it.
- **Brainrot ambush** — random callers and tap mini-games jump the page while you wait.

## 100 wonders

See [FEATURES.md](FEATURES.md). Launch any of them from the Museum of 100 Wonders at the bottom.

## Songs (original)

- Tick Tock Forever
- Five More Minutes
- Pomodoro Power

## Verify

```bash
node scripts/verify-features.js
```

Checks that there are exactly 100 unique features, every action is wired, every icon exists, and source files contain no emoji.
