# TinyTimer Chaos Edition

First visit looks like the original TinyTimer: a bland countdown, Start, and Reset. Nothing else is unlocked.

Play the clock. Random events fire while it runs (and when it hits zero). Each event unlocks more wonders until all 100 are loose.

Open `index.html` in a browser. No build step. No emoji. Every icon is original vector sticker art.

## How progression works

- **0 unlocked** — original look. Navy background, giant 05:00, Start / Reset.
- **Start the timer** — after a couple of seconds the first random event peels something open (Pause, a preset, a visual, a game…).
- **Keep playing** — events keep rolling. The fire-street skin, arcade, studio, shop, popups, and Sahur calls only appear after you unlock them.
- Progress is saved in the browser (`tt-unlocks`). A new visitor always starts empty.

## Side pieces (not the homepage)

- **Side Street Shop** — curb kiosk. Spend ticks. Never the main event. Unlocks late.
- **Virus popup storm** — fake 90s malware you close or POST for ticks.
- **Tung Tung Tung Sahur call** — he rings you once that wonder is unlocked.
- **Brainrot ambush** — random mini-games after it unlocks.

## 100 wonders

See [FEATURES.md](FEATURES.md). The museum lists locked slots as Locked until events open them.

## Songs (original)

- Tick Tock Forever
- Five More Minutes
- Pomodoro Power

## Verify

```bash
node scripts/verify-features.js
```
